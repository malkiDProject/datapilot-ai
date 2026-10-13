import express from 'express';
import targetSchemasController from '../controllers/targetSchemas.controller';

const router = express.Router();

/**
 * @openapi
 * /api/v1/target-schemas:
 *   post:
 *     summary: Create a target schema
 *     tags: [TargetSchemas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TargetSchema'
 *     responses:
 *       201:
 *         description: Target schema created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TargetSchema'
 */
router.post('/', targetSchemasController.createTargetSchema);

/**
 * @openapi
 * /api/v1/target-schemas/{id}:
 *   get:
 *     summary: Retrieve a target schema by id
 *     tags: [TargetSchemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The target schema object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TargetSchema'
 *       404:
 *         description: Target schema not found
 */
router.get('/:id', targetSchemasController.getTargetSchema);

export default router;
