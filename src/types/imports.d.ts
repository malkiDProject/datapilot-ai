export type ImportJobStatus =
  | 'CREATED'
  | 'FILE_UPLOADED'
  | 'VALIDATED'
  | 'MAPPING_SUGGESTED'
  | 'ANALYZED'
  | 'MAPPING_PENDING_APPROVAL'
  | 'READY_TO_TRANSFORM'
  | 'TRANSFORMED'
  | 'EXPORTED'
  | 'FAILED';

export interface ImportJob {
  id: string;
  pipelineId: string;
  status: ImportJobStatus;
  fileName?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}
