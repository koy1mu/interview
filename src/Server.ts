import express, { Express } from 'express';
import { injectable, inject } from 'inversify';
import swaggerUi from 'swagger-ui-express';
import { Config } from './config/Config.js';
import { registerRoutes } from './Routes.js';
import { Container } from 'inversify';
import apiDocs from './apiDocs.json' with { type: 'json' };
import pino from 'pino';

const logger = pino({ name: 'Server' });

@injectable()
export class Server {
  private app!: Express;

  constructor(
    @inject(Config) private readonly config: Config,
  ) {}

  create(container: Container): Express {
    this.app = express();
    this.app.use(express.json());

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const routes = registerRoutes(container);
    this.app.use(routes);

    return this.app;
  }

  start(container: Container): void {
    const app = this.create(container);
    const port = this.config.values.APP_PORT;

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  }
}
