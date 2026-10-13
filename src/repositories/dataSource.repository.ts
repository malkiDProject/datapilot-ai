import prisma from '../lib/prisma';
import { DataSource } from '../models/dataSource';

function toDataSource(record: {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}): DataSource {
  const dataSource = new DataSource({
    id: record.id,
    tenantId: record.tenantId,
    name: record.name,
    type: record.type as any,
    createdAt: record.createdAt,
  });
  dataSource.updatedAt = record.updatedAt;
  return dataSource;
}

export async function save(dataSource: DataSource): Promise<DataSource> {
  const record = await prisma.dataSource.upsert({
    where: { id: dataSource.id },
    update: {
      tenantId: dataSource.tenantId,
      name: dataSource.name,
      type: dataSource.type as any,
      updatedAt: dataSource.updatedAt ?? new Date(),
    },
    create: {
      id: dataSource.id,
      tenantId: dataSource.tenantId,
      name: dataSource.name,
      type: dataSource.type as any,
      createdAt: dataSource.createdAt,
      updatedAt: dataSource.updatedAt ?? dataSource.createdAt,
    },
  });

  return toDataSource(record);
}

export async function findById(id: string): Promise<DataSource | null> {
  const record = await prisma.dataSource.findUnique({
    where: { id },
  });

  return record ? toDataSource(record) : null;
}

export async function list(): Promise<DataSource[]> {
  const records = await prisma.dataSource.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return records.map(toDataSource);
}

export default {
  save,
  findById,
  list,
};
