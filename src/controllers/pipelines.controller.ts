import { Request, Response } from 'express';
import pipelineService from '../services/pipeline.service';

export async function createPipeline(req: Request, res: Response) {
  try {
    const pipeline = await pipelineService.createPipeline({
      tenantId: req.body?.tenantId,
      name: req.body?.name,
      dataSourceId: req.body?.dataSourceId,
      targetSchemaId: req.body?.targetSchemaId,
      approvalMode: req.body?.approvalMode,
    });

    return res.status(201).json(pipeline);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create pipeline';
    if (message.includes('not found')) {
      return res.status(404).json({ error: message });
    }
    return res.status(400).json({ error: message });
  }
}

export async function getPipeline(req: Request, res: Response) {
  try {
    const pipelineId = req.params.id;
    const pipeline = await pipelineService.getPipelineById(pipelineId);

    if (!pipeline) {
      return res.status(404).json({ error: `Pipeline with id '${pipelineId}' not found.` });
    }

    return res.status(200).json(pipeline);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve pipeline';
    return res.status(400).json({ error: message });
  }
}

export default {
  createPipeline,
  getPipeline,
};
