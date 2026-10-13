import express from 'express';
import dataSourcesController from '../controllers/dataSources.controller';

const router = express.Router();

/**
 * @openapi
 * /api/v1/data-sources:
 *   post:
 *     summary: Create a data source
 *     tags: [DataSources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DataSource'
 *     responses:
 *       201:
 *         description: Data source created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataSource'
 */
router.post('/', dataSourcesController.createDataSource);

/**
 * @openapi
 * /api/v1/data-sources/{id}:
 *   get:
 *     summary: Retrieve a data source by id
 *     tags: [DataSources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The data source object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataSource'
 *       404:
 *         description: Data source not found
 */
router.get('/:id', dataSourcesController.getDataSource);

export default router;
