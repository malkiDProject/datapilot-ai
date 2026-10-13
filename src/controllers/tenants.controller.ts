import { Request, Response } from 'express';
import tenantService from '../services/tenant.service';

export async function createTenant(req: Request, res: Response) {
  try {
    const tenant = await tenantService.createTenant({ name: req.body?.name });
    return res.status(201).json(tenant);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create tenant';
    return res.status(400).json({ error: message });
  }
}

export async function getTenant(req: Request, res: Response) {
  try {
    const tenantId = req.params.id;
    const tenant = await tenantService.getTenantById(tenantId);

    if (!tenant) {
      return res.status(404).json({ error: `Tenant with id '${tenantId}' not found.` });
    }

    return res.status(200).json(tenant);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve tenant';
    return res.status(400).json({ error: message });
  }
}

export default {
  createTenant,
  getTenant,
};
