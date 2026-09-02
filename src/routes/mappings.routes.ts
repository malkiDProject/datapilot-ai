import express from 'express';
import mappingsController from '../controllers/mappings.controller';

const router = express.Router();

/**
 * @openapi
 * /api/v1/mappings/suggest:
 *   post:
 *     tags:
 *       - Mappings
 *     summary: Suggest mappings from CSV sample rows to a target schema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MappingRequest'
 *     responses:
 *       '200':
 *         description: Mapping suggestions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MappingResponse'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post('/suggest', mappingsController.suggestMappings);

export default router;
