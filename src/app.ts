import express from 'express';
import importsRoutes from './routes/imports.routes';
import { swaggerSpec, swaggerUi } from './config/swagger';
import mappingsRoutes from './routes/mappings.routes';
import tenantsRoutes from './routes/tenants.routes';
import dataSourcesRoutes from './routes/dataSources.routes';
import targetSchemasRoutes from './routes/targetSchemas.routes';
import pipelinesRoutes from './routes/pipelines.routes';

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
app.use('/api/v1/tenants', tenantsRoutes);
app.use('/api/v1/data-sources', dataSourcesRoutes);
app.use('/api/v1/target-schemas', targetSchemasRoutes);
app.use('/api/v1/pipelines', pipelinesRoutes);
app.use('/api/v1/imports', importsRoutes);
app.use('/api/v1/mappings', mappingsRoutes);

export default app;
