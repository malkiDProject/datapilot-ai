import express from 'express';
import importsController from '../controllers/imports.controller';

const router = express.Router();

/**
 * @openapi
 * /api/v1/imports:
 *   post:
 *     summary: Create a new import job
 *     tags: [Imports]
 *     responses:
 *       201:
 *         description: Import job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportJob'
 */
router.post('/', importsController.createImportJob);

export default router;
