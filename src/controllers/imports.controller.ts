import { Request, Response } from 'express';
import path from 'path';
import importsService from '../services/imports.service';
import { ImportJobStatus } from '../constants/importJobStatus';
import csvParserService from '../services/csvParser.service';
import mappingService from '../services/mapping.service';

export async function createImportJob(req: Request, res: Response) {
  try {
    const pipelineId = req.body && req.body.pipelineId;

    if (!pipelineId || typeof pipelineId !== 'string' || !pipelineId.trim()) {
      return res.status(400).json({ error: 'pipelineId is required.' });
    }

    const importJob = await importsService.createImportJobService({ pipelineId });
    return res.status(201).json(importJob);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create import job';
    if (message.includes('not found')) {
      return res.status(404).json({ error: message });
    }
    return res.status(400).json({ error: message });
  }
}

export async function uploadFile(req: Request, res: Response) {
  try {
    const importJobId = req.params && req.params.id;

    if (!importJobId || typeof importJobId !== 'string') {
      return res.status(400).json({ error: 'Missing import job id in path parameter.' });
    }

    let uploadContext;
    try {
      uploadContext = await importsService.resolveImportJobUploadContext(importJobId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resolve import job upload context';
      if (message.includes('not found')) {
        return res.status(404).json({ error: message });
      }
      return res.status(400).json({ error: message });
    }

    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded. Provide a file in the "file" field.' });
    }

    const isCsvMime = (file.mimetype || '').toLowerCase() === 'text/csv';
    const ext = path.extname(file.originalname || '').toLowerCase();
    const isCsvExt = ext === '.csv';

    if (!isCsvMime && !isCsvExt) {
      return res.status(400).json({ error: 'Uploaded file must be a CSV (MIME type text/csv or .csv extension).' });
    }

    const targetSchema = uploadContext.targetSchema.fields;
    const userInstruction = req.body && typeof req.body.userInstruction === 'string' ? req.body.userInstruction : undefined;

    try {
      const parsed = csvParserService.parseCsvBuffer(file.buffer);

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

export async function getImportJob(req: Request, res: Response) {
  try {
    const importJobId = req.params && req.params.id;
    if (!importJobId || typeof importJobId !== 'string') {
      return res.status(400).json({ error: 'Missing import job id in path parameter.' });
    }

    const importJob = await importsService.getImportJobById(importJobId);
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
