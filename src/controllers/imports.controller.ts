import { Request, Response } from 'express';
import path from 'path';
import importsService from '../services/imports.service';
import { ImportJobStatus } from '../constants/importJobStatus';
import csvParserService from '../services/csvParser.service';
import mappingService from '../services/mapping.service';

export function createImportJob(req: Request, res: Response) {
  try {
    const importJob = importsService.createImportJobService();
    res.status(201).json(importJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create import job' });
  }
}

export async function uploadFile(req: Request, res: Response) {
  try {
    const importJobId = req.params && req.params.id;

    if (!importJobId || typeof importJobId !== 'string') {
      return res.status(400).json({ error: 'Missing import job id in path parameter.' });
    }

    // verify import job exists via service
    const importJob = importsService.getImportJobById(importJobId);
    if (!importJob) {
      return res.status(404).json({ error: `ImportJob with id '${importJobId}' not found.` });
    }

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

    // Parse and validate targetSchema from form field
    const targetSchemaRaw = (req.body && req.body.targetSchema) || null;
    if (!targetSchemaRaw) {
      return res.status(400).json({ error: 'Missing required form field "targetSchema" (JSON string).' });
    }

    let targetSchema: Record<string, string>;
    try {
      targetSchema = JSON.parse(targetSchemaRaw);
      if (typeof targetSchema !== 'object' || Array.isArray(targetSchema) || targetSchema === null) {
        throw new Error('targetSchema must be a JSON object');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON in targetSchema';
      return res.status(400).json({ error: `Invalid targetSchema: ${message}` });
    }

    const userInstruction = req.body && typeof req.body.userInstruction === 'string' ? req.body.userInstruction : undefined;

    // Attempt to parse CSV from the uploaded buffer
    try {
      const parsed = csvParserService.parseCsvBuffer(file.buffer);

      // Call mapping service (AI) with sampleRows, targetSchema, and optional userInstruction
      let mappingSuggestion;
      try {
        mappingSuggestion = await mappingService.suggestMappings(parsed.sampleRows, targetSchema, userInstruction);
      } catch (err) {
        return res.status(500).json({ error: 'Failed to generate mapping suggestion' });
      }

      const result = {
        importJobId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        headers: parsed.headers,
        sampleRows: parsed.sampleRows,
        mappingSuggestion,
      };

      // Update ImportJob status to reflect that an AI mapping suggestion was generated
      try {
        importsService.updateImportJobStatus(importJobId, ImportJobStatus.MAPPING_SUGGESTED);
      } catch (err) {
        // Do not fail the request if status update fails; log silently (no logger configured)
      }

      return res.status(200).json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid CSV file';
      return res.status(400).json({ error: message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to process upload' });
  }
}

export function getImportJob(req: Request, res: Response) {
  try {
    const importJobId = req.params && req.params.id;
    if (!importJobId || typeof importJobId !== 'string') {
      return res.status(400).json({ error: 'Missing import job id in path parameter.' });
    }

    const importJob = importsService.getImportJobById(importJobId);
    if (!importJob) {
      return res.status(404).json({ error: `ImportJob with id '${importJobId}' not found.` });
    }

    return res.status(200).json(importJob);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve import job' });
  }
}

export default {
  createImportJob,
  uploadFile,
  getImportJob,
};
