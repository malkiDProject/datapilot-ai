import { ImportJobStatus } from '../constants/importJobStatus';

export class ImportJob {
  id: string;
  pipelineId: string;
  status: ImportJobStatus;
  fileName?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    pipelineId,
    status = ImportJobStatus.CREATED,
    fileName,
    fileSize,
    createdAt = new Date(),
  }: {
    id: string;
    pipelineId: string;
    status?: ImportJobStatus;
    fileName?: string;
    fileSize?: number;
    createdAt?: Date;
  }) {
    this.id = id;
    this.pipelineId = pipelineId;
    this.status = status ?? ImportJobStatus.CREATED;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }
}
