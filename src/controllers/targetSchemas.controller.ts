import { Request, Response } from 'express';
import targetSchemaService from '../services/targetSchema.service';

export async function createTargetSchema(req: Request, res: Response) {
  try {
    const targetSchema = await targetSchemaService.createTargetSchema({
      tenantId: req.body?.tenantId,
      name: req.body?.name,
      fields: req.body?.fields,
    });

    return res.status(201).json(targetSchema);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create target schema';
    if (message.includes('not found')) {
      return res.status(404).json({ error: message });
    }
    return res.status(400).json({ error: message });
  }
}

export async function getTargetSchema(req: Request, res: Response) {
  try {
    const targetSchemaId = req.params.id;
    const targetSchema = await targetSchemaService.getTargetSchemaById(targetSchemaId);

    if (!targetSchema) {
      return res.status(404).json({ error: `TargetSchema with id '${targetSchemaId}' not found.` });
    }

    return res.status(200).json(targetSchema);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve target schema';
    return res.status(400).json({ error: message });
  }
}

export default {
  createTargetSchema,
  getTargetSchema,
};
