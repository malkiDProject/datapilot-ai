import prisma from '../lib/prisma';
import { Pipeline } from '../models/pipeline';

function toPipeline(record: {
  id: string;
  tenantId: string;
  name: string;
  dataSourceId: string;
  targetSchemaId: string;
  approvalMode: string;
  createdAt: Date;
  updatedAt: Date;
}): Pipeline {
  const pipeline = new Pipeline({
    id: record.id,
    tenantId: record.tenantId,
    name: record.name,
    dataSourceId: record.dataSourceId,
    targetSchemaId: record.targetSchemaId,
    approvalMode: record.approvalMode as any,
    createdAt: record.createdAt,
  });
  pipeline.updatedAt = record.updatedAt;
  return pipeline;
}

export async function save(pipeline: Pipeline): Promise<Pipeline> {
  const record = await prisma.pipeline.upsert({
    where: { id: pipeline.id },
    update: {
      tenantId: pipeline.tenantId,
      name: pipeline.name,
      dataSourceId: pipeline.dataSourceId,
      targetSchemaId: pipeline.targetSchemaId,
      approvalMode: pipeline.approvalMode as any,
      updatedAt: pipeline.updatedAt ?? new Date(),
    },
    create: {
      id: pipeline.id,
      tenantId: pipeline.tenantId,
      name: pipeline.name,
      dataSourceId: pipeline.dataSourceId,
      targetSchemaId: pipeline.targetSchemaId,
      approvalMode: pipeline.approvalMode as any,
      createdAt: pipeline.createdAt,
      updatedAt: pipeline.updatedAt ?? pipeline.createdAt,
    },
  });

  return toPipeline(record);
}

export async function findById(id: string): Promise<Pipeline | null> {
  const record = await prisma.pipeline.findUnique({
    where: { id },
  });

  return record ? toPipeline(record) : null;
}

export async function list(): Promise<Pipeline[]> {
  const records = await prisma.pipeline.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return records.map(toPipeline);
}

export default {
  save,
  findById,
  list,
};
