import crypto from 'crypto';
import { ApprovalMode, Pipeline } from '../models/pipeline';
import pipelineRepository from '../repositories/pipeline.repository';
import dataSourceRepository from '../repositories/dataSource.repository';
import targetSchemaRepository from '../repositories/targetSchema.repository';
import tenantRepository from '../repositories/tenant.repository';

function normalizeApprovalMode(mode: string): ApprovalMode {
  const normalized = typeof mode === 'string' ? mode.trim().toUpperCase() : '';

  if (normalized === 'MANUAL' || normalized === 'AUTO') {
    return normalized as ApprovalMode;
  }

  throw new Error(`Approval mode '${mode}' is not supported.`);
}

export async function createPipeline({
  tenantId,
  name,
  dataSourceId,
  targetSchemaId,
  approvalMode,
}: {
  tenantId: string;
  name: string;
  dataSourceId: string;
  targetSchemaId: string;
  approvalMode: string;
}): Promise<Pipeline> {
  const tenant = await tenantRepository.findById(tenantId);
  if (!tenant) {
    throw new Error(`Tenant with id '${tenantId}' not found.`);
  }

  const pipelineName = typeof name === 'string' ? name.trim() : '';
  if (!pipelineName) {
    throw new Error('Pipeline name is required.');
  }

  const dataSource = await dataSourceRepository.findById(dataSourceId);
  if (!dataSource) {
    throw new Error(`DataSource with id '${dataSourceId}' not found.`);
  }

  const targetSchema = await targetSchemaRepository.findById(targetSchemaId);
  if (!targetSchema) {
    throw new Error(`TargetSchema with id '${targetSchemaId}' not found.`);
  }

  if (dataSource.tenantId !== tenantId) {
    throw new Error('DataSource must belong to the same tenant as the pipeline.');
  }

  if (targetSchema.tenantId !== tenantId) {
    throw new Error('TargetSchema must belong to the same tenant as the pipeline.');
  }

  const normalizedApprovalMode = normalizeApprovalMode(approvalMode);
  const now = new Date();
  const pipeline = new Pipeline({
    id: crypto.randomUUID(),
    tenantId,
    name: pipelineName,
    dataSourceId,
    targetSchemaId,
    approvalMode: normalizedApprovalMode,
    createdAt: now,
  });

  pipeline.updatedAt = now;
  await pipelineRepository.save(pipeline);

  return pipeline;
}

export async function getPipelineById(id: string): Promise<Pipeline | null> {
  if (!id || typeof id !== 'string' || !id.trim()) {
    throw new Error('Pipeline id is required.');
  }

  return pipelineRepository.findById(id);
}

export default {
  createPipeline,
  getPipelineById,
};
