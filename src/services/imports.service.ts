import crypto from 'crypto';
import { ImportJob } from '../models/importJob';
import { ImportJobStatus } from '../constants/importJobStatus';
import importJobRepository from '../repositories/importJob.repository';

export function createImportJobService() {
  const now = new Date();
  const importJob = new ImportJob({
    id: crypto.randomUUID(),
    status: ImportJobStatus.CREATED,
    createdAt: now,
  });

  importJob.updatedAt = now;
  // Persist the newly created ImportJob in the shared repository
  importJobRepository.save(importJob);

  return {
    id: importJob.id,
    status: importJob.status,
    createdAt: importJob.createdAt,
    updatedAt: importJob.updatedAt,
  };
}

export function getImportJobById(id: string): ImportJob | null {
  // Delegate to repository for lookup; keep controller free of repo logic
  return importJobRepository.findById(id);
}

export default {
  createImportJobService,
  getImportJobById,
};
