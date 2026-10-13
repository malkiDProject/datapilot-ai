import crypto from 'crypto';
import { ImportJob } from '../models/importJob';
import { ImportJobStatus } from '../constants/importJobStatus';
import importJobRepository from '../repositories/importJob.repository';
import pipelineRepository from '../repositories/pipeline.repository';
import targetSchemaRepository from '../repositories/targetSchema.repository';

export async function createImportJobService({ pipelineId }: { pipelineId: string }): Promise<ImportJob> {
  if (!pipelineId || typeof pipelineId !== 'string' || !pipelineId.trim()) {
    throw new Error('pipelineId is required.');
  }

  const pipeline = await pipelineRepository.findById(pipelineId);
  if (!pipeline) {
    throw new Error(`Pipeline with id '${pipelineId}' not found.`);
  }

  const now = new Date();
  const importJob = new ImportJob({
    id: crypto.randomUUID(),
    pipelineId,
    status: ImportJobStatus.CREATED,
    createdAt: now,
  });

  importJob.updatedAt = now;
  await importJobRepository.save(importJob);

  return importJob;
}

export async function resolveImportJobUploadContext(importJobId: string): Promise<{ importJob: ImportJob; targetSchema: { fields: Record<string, string> } }> {
  if (!importJobId || typeof importJobId !== 'string' || !importJobId.trim()) {
    throw new Error('Import job id is required.');
  }

  const importJob = await importJobRepository.findById(importJobId);
  if (!importJob) {
    throw new Error(`ImportJob with id '${importJobId}' not found.`);
  }

  const pipeline = await pipelineRepository.findById(importJob.pipelineId);
  if (!pipeline) {
    throw new Error(`Pipeline with id '${importJob.pipelineId}' not found.`);
  }

  const targetSchema = await targetSchemaRepository.findById(pipeline.targetSchemaId);
  if (!targetSchema) {
    throw new Error(`TargetSchema with id '${pipeline.targetSchemaId}' not found.`);
  }

  return {
    importJob,
    targetSchema,
  };
}

export async function getImportJobById(id: string): Promise<ImportJob | null> {
  return importJobRepository.findById(id);
}

export async function updateImportJobStatus(id: string, status: ImportJobStatus): Promise<ImportJob | null> {
  const job = await importJobRepository.findById(id);
  if (!job) return null;
  job.status = status;
  job.updatedAt = new Date();
  return importJobRepository.update(job);
}

export default {
  createImportJobService,
  resolveImportJobUploadContext,
  getImportJobById,
  updateImportJobStatus,
};
