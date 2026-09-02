import express from 'express';
import importsRoutes from './routes/imports.routes';
import { swaggerSpec, swaggerUi } from './config/swagger';
import mappingsRoutes from './routes/mappings.routes';

const app = express();

app.use(express.json());

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 service:
 *                   type: string
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DataPilot AI',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/imports', importsRoutes);
app.use('/api/v1/mappings', mappingsRoutes);

export default app;
