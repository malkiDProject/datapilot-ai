export class Tenant {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor({ id, name, createdAt = new Date() }: { id: string; name: string; createdAt?: Date }) {
    this.id = id;
    this.name = name.trim();
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }
}
