import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { Tenant } from '../models/tenant';

function toTenant(record: {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}): Tenant {
  const tenant = new Tenant({
    id: record.id,
    name: record.name,
    createdAt: record.createdAt,
  });
  tenant.updatedAt = record.updatedAt;
  return tenant;
}

export async function save(tenant: Tenant): Promise<Tenant> {
  const record = await prisma.tenant.upsert({
    where: { id: tenant.id },
    update: {
      name: tenant.name,
      updatedAt: tenant.updatedAt ?? new Date(),
    },
    create: {
      id: tenant.id,
      name: tenant.name,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt ?? tenant.createdAt,
    },
  });

  return toTenant(record);
}

export async function findById(id: string): Promise<Tenant | null> {
  const record = await prisma.tenant.findUnique({
    where: { id },
  });

  return record ? toTenant(record) : null;
}

export async function list(): Promise<Tenant[]> {
  const records = await prisma.tenant.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return records.map(toTenant);
}

export default {
  save,
  findById,
  list,
};
