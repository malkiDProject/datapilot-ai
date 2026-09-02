import { Request, Response } from 'express';
import mappingService from '../services/mapping.service';

export async function suggestMappings(req: Request, res: Response) {
  try {
    const { sampleRows, targetSchema, userInstruction } = req.body;
    if (!sampleRows || !targetSchema) {
      return res.status(400).json({ error: 'sampleRows and targetSchema are required in the request body' });
    }

    const suggestion = await mappingService.suggestMappings(sampleRows, targetSchema, userInstruction);
    res.json(suggestion);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to suggest mappings' });
  }
}

export default {
  suggestMappings,
};
