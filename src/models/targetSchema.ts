export type FieldSchemaMap = Record<string, string>;

export class TargetSchema {
  id: string;
  tenantId: string;
  name: string;
  fields: FieldSchemaMap;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    tenantId,
    name,
    fields,
    createdAt = new Date(),
  }: {
    id: string;
    tenantId: string;
    name: string;
    fields: FieldSchemaMap;
    createdAt?: Date;
  }) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name.trim();
    this.fields = fields;
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }
}
