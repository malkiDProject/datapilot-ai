import test from 'node:test';
import assert from 'node:assert/strict';

import test from 'node:test';
import assert from 'node:assert/strict';

import prisma from '../src/lib/prisma.ts';
import tenantService from '../src/services/tenant.service.ts';
import dataSourceService from '../src/services/dataSource.service.ts';
import targetSchemaService from '../src/services/targetSchema.service.ts';
import pipelineService from '../src/services/pipeline.service.ts';
import importsService from '../src/services/imports.service.ts';
import importJobRepository from '../src/repositories/importJob.repository.ts';
import { ImportJob } from '../src/models/importJob.ts';
import { ImportJobStatus } from '../src/constants/importJobStatus.ts';

const createTenant = async () => tenantService.createTenant({ name: 'Acme Corp' });
const createDataSource = async (tenantId: string) =>
  dataSourceService.createDataSource({ tenantId, name: 'Customer Leads', type: 'CSV' });
const createTargetSchema = async (tenantId: string) =>
  targetSchemaService.createTargetSchema({
    tenantId,
    name: 'Customer Export',
    fields: { name: 'string', email: 'string', age: 'number' },
  });

test('Tenant, data source, target schema, and pipeline can be created together', async () => {
  const tenant = await createTenant();
  const dataSource = await createDataSource(tenant.id);
  const targetSchema = await createTargetSchema(tenant.id);

  const pipeline = await pipelineService.createPipeline({
    tenantId: tenant.id,
    name: 'Lead Sync',
    dataSourceId: dataSource.id,
    targetSchemaId: targetSchema.id,
    approvalMode: 'MANUAL',
  });

  assert.equal(pipeline.tenantId, tenant.id);
  assert.equal(pipeline.approvalMode, 'MANUAL');
  assert.equal(pipeline.dataSourceId, dataSource.id);
  assert.equal(pipeline.targetSchemaId, targetSchema.id);
});

test('ImportJob creation fails when pipeline does not exist', async () => {
  await assert.rejects(
    () => importsService.createImportJobService({ pipelineId: 'missing-pipeline-id' }),
    /Pipeline with id 'missing-pipeline-id' not found/,
  );
});

test('Pipeline creation fails when datasource and target schema belong to different tenants', async () => {
  const tenantA = await createTenant();
  const tenantB = await createTenant();
  const dataSource = await createDataSource(tenantA.id);
  const targetSchema = await createTargetSchema(tenantB.id);

  await assert.rejects(
    () =>
      pipelineService.createPipeline({
        tenantId: tenantA.id,
        name: 'Bad Pipeline',
        dataSourceId: dataSource.id,
        targetSchemaId: targetSchema.id,
        approvalMode: 'AUTO',
      }),
    /must belong to the same tenant/,
  );
});

test('Upload context resolves the pipeline target schema for an import job', async () => {
  const tenant = await createTenant();
  const dataSource = await createDataSource(tenant.id);
  const targetSchema = await createTargetSchema(tenant.id);
  const pipeline = await pipelineService.createPipeline({
    tenantId: tenant.id,
    name: 'Customer Sync',
    dataSourceId: dataSource.id,
    targetSchemaId: targetSchema.id,
    approvalMode: 'AUTO',
  });

  const importJob = new ImportJob({
    id: 'import-job-123',
    pipelineId: pipeline.id,
    status: ImportJobStatus.CREATED,
    createdAt: new Date(),
  });
  await importJobRepository.save(importJob);

  const context = await importsService.resolveImportJobUploadContext(importJob.id);

  assert.equal(context.importJob.pipelineId, pipeline.id);
  assert.equal(context.targetSchema.id, targetSchema.id);
  assert.deepEqual(context.targetSchema.fields, targetSchema.fields);
});

test('Upload context fails when the related pipeline is no longer available', async () => {
  const tenant = await createTenant();
  const dataSource = await createDataSource(tenant.id);
  const targetSchema = await createTargetSchema(tenant.id);
  const pipeline = await pipelineService.createPipeline({
    tenantId: tenant.id,
    name: 'Archived Sync',
    dataSourceId: dataSource.id,
    targetSchemaId: targetSchema.id,
    approvalMode: 'AUTO',
  });

  const importJob = new ImportJob({
    id: 'pipeline-deleted-job',
    pipelineId: pipeline.id,
    status: ImportJobStatus.CREATED,
    createdAt: new Date(),
  });
  await importJobRepository.save(importJob);

  await prisma.pipeline.delete({ where: { id: pipeline.id } });

  await assert.rejects(
    () => importsService.resolveImportJobUploadContext(importJob.id),
    /ImportJob with id 'pipeline-deleted-job' not found/,
  );
});
