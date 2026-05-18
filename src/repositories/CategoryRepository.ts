import { injectable, inject } from 'inversify';
import { Collection, ObjectId } from 'mongodb';
import { Result, ok, err } from 'neverthrow';
import { Database } from '../Database.js';
import { Category, CreateCategoryInput } from '../models/Category.js';
import { AppError } from '../models/AppError.js';

@injectable()
export class CategoryRepository {
  private collection: Collection<Category>;

  constructor(
    @inject(Database) private readonly database: Database,
  ) {
    this.collection = this.database.getCollection<Category>('categories');
    this.collection.createIndex({ name: 1 }, { unique: true }).catch(() => {});
  }

  async findAll(): Promise<Result<Category[], AppError>> {
    try {
      const categories = await this.collection.find().toArray();
      return ok(categories);
    } catch (error) {
      return err(AppError.databaseError('Failed to fetch categories', error));
    }
  }

  async findById(id: string): Promise<Result<Category, AppError>> {
    try {
      const category = await this.collection.findOne({ _id: new ObjectId(id) });
      if (!category) {
        return err(AppError.notFound(`Category with id ${id} not found`));
      }
      return ok(category);
    } catch (error) {
      return err(AppError.databaseError('Failed to fetch category', error));
    }
  }

  async insert(input: CreateCategoryInput): Promise<Result<Category, AppError>> {
    try {
      const category: Category = {
        _id: new ObjectId(),
        name: input.name,
        color: input.color,
      };
      await this.collection.insertOne(category);
      return ok(category);
    } catch (error) {
      return err(AppError.databaseError('Failed to insert category', error));
    }
  }

  async delete(id: string): Promise<Result<void, AppError>> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return err(AppError.notFound(`Category with id ${id} not found`));
      }
      return ok(undefined);
    } catch (error) {
      return err(AppError.databaseError('Failed to delete category', error));
    }
  }
}
