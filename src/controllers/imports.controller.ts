import { Request, Response } from 'express';
import importsService from '../services/imports.service';

export function createImportJob(req: Request, res: Response) {
  try {
    const importJob = importsService.createImportJobService();
    res.status(201).json(importJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create import job' });
  }
}

export default {
  createImportJob,
};
