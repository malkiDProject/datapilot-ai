import crypto from 'crypto';
import { DataSource, DataSourceType } from '../models/dataSource';
import dataSourceRepository from '../repositories/dataSource.repository';
import tenantRepository from '../repositories/tenant.repository';

const supportedDataSourceTypes: DataSourceType[] = ['CSV', 'SFTP', 'S3', 'REST_API'];

function normalizeDataSourceType(type: string): DataSourceType {
  const normalized = typeof type === 'string' ? type.trim().toUpperCase() : '';

  if (normalized === 'CSV' || normalized === 'SFTP' || normalized === 'S3' || normalized === 'REST_API') {
    return normalized as DataSourceType;
  }

  throw new Error(`Data source type '${type}' is not supported.`);
}

export async function createDataSource({ tenantId, name, type }: { tenantId: string; name: string; type: string }): Promise<DataSource> {
  const tenant = await tenantRepository.findById(tenantId);
  if (!tenant) {
    throw new Error(`Tenant with id '${tenantId}' not found.`);
  }

  const dataSourceName = typeof name === 'string' ? name.trim() : '';
  if (!dataSourceName) {
    throw new Error('Data source name is required.');
  }

  const normalizedType = normalizeDataSourceType(type);
  const now = new Date();
  const dataSource = new DataSource({
    id: crypto.randomUUID(),
    tenantId,
    name: dataSourceName,
    type: normalizedType,
    createdAt: now,
  });

  dataSource.updatedAt = now;
  await dataSourceRepository.save(dataSource);

  return dataSource;
}

export async function getDataSourceById(id: string): Promise<DataSource | null> {
  if (!id || typeof id !== 'string' || !id.trim()) {
    throw new Error('Data source id is required.');
  }

  return dataSourceRepository.findById(id);
}

export default {
  createDataSource,
  getDataSourceById,
  supportedDataSourceTypes,
};
