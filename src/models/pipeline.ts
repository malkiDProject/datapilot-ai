export type ApprovalMode = 'MANUAL' | 'AUTO' | (string & {});

export class Pipeline {
  id: string;
  tenantId: string;
  name: string;
  dataSourceId: string;
  targetSchemaId: string;
  approvalMode: ApprovalMode;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    tenantId,
    name,
    dataSourceId,
    targetSchemaId,
    approvalMode,
    createdAt = new Date(),
  }: {
    id: string;
    tenantId: string;
    name: string;
    dataSourceId: string;
    targetSchemaId: string;
    approvalMode: ApprovalMode;
    createdAt?: Date;
  }) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name.trim();
    this.dataSourceId = dataSourceId;
    this.targetSchemaId = targetSchemaId;
    this.approvalMode = approvalMode;
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }
}
