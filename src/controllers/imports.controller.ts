import { Request, Response } from 'express';
import path from 'path';
import importsService from '../services/imports.service';
import csvParserService from '../services/csvParser.service';

export function createImportJob(req: Request, res: Response) {
  try {
    const importJob = importsService.createImportJobService();
    res.status(201).json(importJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create import job' });
  }
}

export function uploadFile(req: Request, res: Response) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded. Provide a file in the "file" field.' });
    }

    // Validate that the uploaded file is a CSV: prefer MIME type, fallback to .csv extension
    const isCsvMime = (file.mimetype || '').toLowerCase() === 'text/csv';
    const ext = path.extname(file.originalname || '').toLowerCase();
    const isCsvExt = ext === '.csv';

    if (!isCsvMime && !isCsvExt) {
      return res.status(400).json({ error: 'Uploaded file must be a CSV (MIME type text/csv or .csv extension).' });
    }

    // Attempt to parse CSV from the uploaded buffer
    try {
      const parsed = csvParserService.parseCsvBuffer(file.buffer);

      const result = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        headers: parsed.headers,
        sampleRows: parsed.sampleRows,
      };

      return res.status(200).json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid CSV file';
      return res.status(400).json({ error: message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to process upload' });
  }
}

export default {
  createImportJob,
  uploadFile,
};
