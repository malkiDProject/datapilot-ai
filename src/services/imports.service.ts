import crypto from 'crypto';
import { ImportJob } from '../models/importJob';
import { ImportJobStatus } from '../constants/importJobStatus';

const jobs: ImportJob[] = [];

export function createImportJobService() {
  const now = new Date();
  const importJob = new ImportJob({
    id: crypto.randomUUID(),
    status: ImportJobStatus.CREATED,
    createdAt: now,
  });

  importJob.updatedAt = now;
  jobs.push(importJob);

  return {
    id: importJob.id,
    status: importJob.status,
    createdAt: importJob.createdAt,
    updatedAt: importJob.updatedAt,
  };
}

export default {
  createImportJobService,
};
