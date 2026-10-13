import crypto from 'crypto';
import { TargetSchema } from '../models/targetSchema';
import targetSchemaRepository from '../repositories/targetSchema.repository';
import tenantRepository from '../repositories/tenant.repository';

export async function createTargetSchema({
  tenantId,
  name,
  fields,
}: {
  tenantId: string;
  name: string;
  fields: Record<string, string>;
}): Promise<TargetSchema> {
  const tenant = await tenantRepository.findById(tenantId);
  if (!tenant) {
    throw new Error(`Tenant with id '${tenantId}' not found.`);
  }

  const targetSchemaName = typeof name === 'string' ? name.trim() : '';
  if (!targetSchemaName) {
    throw new Error('Target schema name is required.');
  }

  if (!fields || typeof fields !== 'object' || Array.isArray(fields) || Object.keys(fields).length === 0) {
    throw new Error('Target schema fields are required.');
  }

  const normalizedFields: Record<string, string> = {};
  Object.entries(fields).forEach(([fieldName, fieldType]) => {
    if (!fieldName || typeof fieldName !== 'string' || !fieldName.trim()) {
      throw new Error('Target schema field names must be non-empty strings.');
    }
    if (typeof fieldType !== 'string' || !fieldType.trim()) {
      throw new Error(`Field '${fieldName}' must declare a valid schema type.`);
    }
    normalizedFields[fieldName] = fieldType;
  });

  const now = new Date();
  const targetSchema = new TargetSchema({
    id: crypto.randomUUID(),
    tenantId,
    name: targetSchemaName,
    fields: normalizedFields,
    createdAt: now,
  });

  targetSchema.updatedAt = now;
  await targetSchemaRepository.save(targetSchema);

  return targetSchema;
}

export async function getTargetSchemaById(id: string): Promise<TargetSchema | null> {
  if (!id || typeof id !== 'string' || !id.trim()) {
    throw new Error('Target schema id is required.');
  }

  return targetSchemaRepository.findById(id);
}

export default {
  createTargetSchema,
  getTargetSchemaById,
};
