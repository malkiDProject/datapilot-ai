import express from 'express';
import tenantsController from '../controllers/tenants.controller';

const router = express.Router();

/**
 * @openapi
 * /api/v1/tenants:
 *   post:
 *     summary: Create a tenant
 *     tags: [Tenants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tenant'
 *     responses:
 *       201:
 *         description: Tenant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 */
router.post('/', tenantsController.createTenant);

/**
 * @openapi
 * /api/v1/tenants/{id}:
 *   get:
 *     summary: Retrieve a tenant by id
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The tenant object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       404:
 *         description: Tenant not found
 */
router.get('/:id', tenantsController.getTenant);

export default router;
