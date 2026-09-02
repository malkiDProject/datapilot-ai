import { ImportJob } from '../models/importJob';

const jobs: Map<string, ImportJob> = new Map();

export function save(importJob: ImportJob): ImportJob {
  jobs.set(importJob.id, importJob);
  return importJob;
}

export function findById(id: string): ImportJob | null {
  return jobs.get(id) ?? null;
}

export function update(importJob: ImportJob): ImportJob {
  jobs.set(importJob.id, importJob);
  return importJob;
}

export function deleteById(id: string): boolean {
  return jobs.delete(id);
}

export default {
  save,
  findById,
  update,
  deleteById,
};
