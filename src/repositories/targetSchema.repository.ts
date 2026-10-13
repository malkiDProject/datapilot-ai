import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { TargetSchema } from '../models/targetSchema';

function toTargetSchema(record: {
  id: string;
  tenantId: string;
  name: string;
  fields: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}): TargetSchema {
  const targetSchema = new TargetSchema({
    id: record.id,
    tenantId: record.tenantId,
    name: record.name,
    fields: (record.fields as Record<string, string>) ?? {},
    createdAt: record.createdAt,
  });
  targetSchema.updatedAt = record.updatedAt;
  return targetSchema;
}

export async function save(targetSchema: TargetSchema): Promise<TargetSchema> {
  const record = await prisma.targetSchema.upsert({
    where: { id: targetSchema.id },
    update: {
      tenantId: targetSchema.tenantId,
      name: targetSchema.name,
      fields: targetSchema.fields as Prisma.JsonObject,
      updatedAt: targetSchema.updatedAt ?? new Date(),
    },
    create: {
      id: targetSchema.id,
      tenantId: targetSchema.tenantId,
      name: targetSchema.name,
      fields: targetSchema.fields as Prisma.JsonObject,
      createdAt: targetSchema.createdAt,
      updatedAt: targetSchema.updatedAt ?? targetSchema.createdAt,
    },
  });

  return toTargetSchema(record);
}

export async function findById(id: string): Promise<TargetSchema | null> {
  const record = await prisma.targetSchema.findUnique({
    where: { id },
  });

  return record ? toTargetSchema(record) : null;
}

export async function list(): Promise<TargetSchema[]> {
  const records = await prisma.targetSchema.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return records.map(toTargetSchema);
}

export default {
  save,
  findById,
  list,
};
