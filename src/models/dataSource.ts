export type DataSourceType = 'CSV' | 'SFTP' | 'S3' | 'REST_API' | (string & {});

export class DataSource {
  id: string;
  tenantId: string;
  name: string;
  type: DataSourceType;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    tenantId,
    name,
    type,
    createdAt = new Date(),
  }: {
    id: string;
    tenantId: string;
    name: string;
    type: DataSourceType;
    createdAt?: Date;
  }) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name.trim();
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }
}
