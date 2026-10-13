import crypto from 'crypto';
import { Tenant } from '../models/tenant';
import tenantRepository from '../repositories/tenant.repository';

export async function createTenant({ name }: { name: string }): Promise<Tenant> {
  const tenantName = typeof name === 'string' ? name.trim() : '';

  if (!tenantName) {
    throw new Error('Tenant name is required.');
  }

  const now = new Date();
  const tenant = new Tenant({
    id: crypto.randomUUID(),
    name: tenantName,
    createdAt: now,
  });

  tenant.updatedAt = now;
  await tenantRepository.save(tenant);

  return tenant;
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  if (!id || typeof id !== 'string' || !id.trim()) {
    throw new Error('Tenant id is required.');
  }

  return tenantRepository.findById(id);
}

export default {
  createTenant,
  getTenantById,
};
