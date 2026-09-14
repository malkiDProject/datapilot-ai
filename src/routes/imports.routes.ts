import express from 'express';
import importsController from '../controllers/imports.controller';
import uploadMiddleware from '../middleware/multer.middleware';

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

/**
 * @openapi
 * /api/v1/imports/upload:
 *   post:
 *     summary: Upload a CSV file for import (not parsed yet)
 *     tags: [Imports]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               targetSchema:
 *                 type: string
 *                 description: JSON string describing the target schema (required)
 *               userInstruction:
 *                 type: string
 *                 description: Optional user instruction for the mapping assistant
 *     responses:
 *       200:
 *         description: Upload metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalName:
 *                   type: string
 *                 mimeType:
 *                   type: string
 *                 size:
 *                   type: integer
 *                 headers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 sampleRows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     additionalProperties:
 *                       type: string
 *                 mappingSuggestion:
 *                   type: object
 *       400:
 *         description: Missing file
 */
router.post('/upload', uploadMiddleware.single('file'), importsController.uploadFile);

export default router;
