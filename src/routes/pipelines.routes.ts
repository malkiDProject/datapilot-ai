import express from 'express';
import pipelinesController from '../controllers/pipelines.controller';

const router = express.Router();

/**
 * @openapi
 * /api/v1/pipelines:
 *   post:
 *     summary: Create a pipeline
 *     tags: [Pipelines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pipeline'
 *     responses:
 *       201:
 *         description: Pipeline created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pipeline'
 */
router.post('/', pipelinesController.createPipeline);

/**
 * @openapi
 * /api/v1/pipelines/{id}:
 *   get:
 *     summary: Retrieve a pipeline by id
 *     tags: [Pipelines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The pipeline object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pipeline'
 *       404:
 *         description: Pipeline not found
 */
router.get('/:id', pipelinesController.getPipeline);

export default router;
