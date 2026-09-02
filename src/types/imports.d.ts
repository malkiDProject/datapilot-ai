export type ImportJobStatus =
  | 'CREATED'
  | 'FILE_UPLOADED'
  | 'VALIDATED'
  | 'ANALYZED'
  | 'MAPPING_PENDING_APPROVAL'
  | 'READY_TO_TRANSFORM'
  | 'TRANSFORMED'
  | 'EXPORTED'
  | 'FAILED';

export interface ImportJob {
  id: string;
  status: ImportJobStatus;
  fileName?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt?: Date;
}
