import prisma from '../lib/prisma';
import { ImportJob } from '../models/importJob';

function toImportJob(record: {
  id: string;
  pipelineId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  fileName?: string | null;
  fileSize?: number | null;
}): ImportJob {
  const job = new ImportJob({
    id: record.id,
    pipelineId: record.pipelineId,
    status: record.status as any,
    fileName: record.fileName ?? undefined,
    fileSize: record.fileSize ?? undefined,
    createdAt: record.createdAt,
  });
  job.updatedAt = record.updatedAt;
  return job;
}

export async function save(importJob: ImportJob): Promise<ImportJob> {
  const record = await prisma.importJob.upsert({
    where: { id: importJob.id },
    update: {
      pipelineId: importJob.pipelineId,
      status: importJob.status as any,
      updatedAt: importJob.updatedAt ?? new Date(),
    },
    create: {
      id: importJob.id,
      pipelineId: importJob.pipelineId,
      status: importJob.status as any,
      createdAt: importJob.createdAt,
      updatedAt: importJob.updatedAt ?? importJob.createdAt,
    },
  });

  return toImportJob(record);
}

export async function findById(id: string): Promise<ImportJob | null> {
  const record = await prisma.importJob.findUnique({
    where: { id },
  });

  return record ? toImportJob(record) : null;
}

export async function update(importJob: ImportJob): Promise<ImportJob> {
  const record = await prisma.importJob.update({
    where: { id: importJob.id },
    data: {
      pipelineId: importJob.pipelineId,
      status: importJob.status as any,
      updatedAt: importJob.updatedAt ?? new Date(),
    },
  });

  return toImportJob(record);
}

export async function deleteById(id: string): Promise<boolean> {
  try {
    await prisma.importJob.delete({ where: { id } });
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  save,
  findById,
  update,
  deleteById,
};
