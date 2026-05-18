import { injectable, postConstruct, inject } from 'inversify';
import { MongoClient, Db, Collection } from 'mongodb';
import { Config } from './config/Config.js';
import pino from 'pino';

const logger = pino({ name: 'Database' });

@injectable()
export class Database {
  private client!: MongoClient;
  private db!: Db;

  constructor(
    @inject(Config) private readonly config: Config,
  ) {}

  @postConstruct()
  async init(): Promise<void> {
    this.client = new MongoClient(this.config.values.DB_URI);
    await this.client.connect();
    this.db = this.client.db();
    logger.info('Connected to MongoDB');
  }

  getCollection<T extends object>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.db.command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }
}
