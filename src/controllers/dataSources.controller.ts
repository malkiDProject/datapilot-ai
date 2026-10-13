import { Request, Response } from 'express';
import dataSourceService from '../services/dataSource.service';

export async function createDataSource(req: Request, res: Response) {
  try {
    const dataSource = await dataSourceService.createDataSource({
      tenantId: req.body?.tenantId,
      name: req.body?.name,
      type: req.body?.type,
    });

    return res.status(201).json(dataSource);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create data source';
    if (message.includes('not found')) {
      return res.status(404).json({ error: message });
    }
    return res.status(400).json({ error: message });
  }
}

export async function getDataSource(req: Request, res: Response) {
  try {
    const dataSourceId = req.params.id;
    const dataSource = await dataSourceService.getDataSourceById(dataSourceId);

    if (!dataSource) {
      return res.status(404).json({ error: `DataSource with id '${dataSourceId}' not found.` });
    }

    return res.status(200).json(dataSource);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve data source';
    return res.status(400).json({ error: message });
  }
}

export default {
  createDataSource,
  getDataSource,
};
