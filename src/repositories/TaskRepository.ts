import { injectable, inject } from 'inversify';
import { Collection, ObjectId } from 'mongodb';
import { Result, ok, err } from 'neverthrow';
import { Database } from '../Database.js';
import { Task, CreateTaskInput, UpdateTaskInput } from '../models/Task.js';
import { AppError } from '../models/AppError.js';

@injectable()
export class TaskRepository {
  private collection: Collection<Task>;

  constructor(
    @inject(Database) private readonly database: Database,
  ) {
    this.collection = this.database.getCollection<Task>('tasks');
    this.collection.createIndex({ status: 1 }).catch(() => {});
    this.collection.createIndex({ categoryId: 1 }).catch(() => {});
  }

  async findAll(): Promise<Result<Task[], AppError>> {
    try {
      const tasks = await this.collection.find().toArray();
      return ok(tasks);
    } catch (error) {
      return err(AppError.databaseError('Failed to fetch tasks', error));
    }
  }

  async findById(id: string): Promise<Result<Task, AppError>> {
    try {
      const task = await this.collection.findOne({ _id: new ObjectId(id) });
      if (!task) {
        return err(AppError.notFound(`Task with id ${id} not found`));
      }
      return ok(task);
    } catch (error) {
      return err(AppError.databaseError('Failed to fetch task', error));
    }
  }

  async insert(input: CreateTaskInput): Promise<Result<Task, AppError>> {
    try {
      const now = new Date();
      const task: Task = {
        _id: new ObjectId(),
        title: input.title,
        description: input.description,
        status: 'pending',
        categoryId: input.categoryId,
        createdAt: now,
        updatedAt: now,
      };
      await this.collection.insertOne(task);
      return ok(task);
    } catch (error) {
      return err(AppError.databaseError('Failed to insert task', error));
    }
  }

  async update(id: string, input: UpdateTaskInput): Promise<Result<Task, AppError>> {
    try {
      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...input, updatedAt: new Date() } },
        { returnDocument: 'before' },
      );
      if (!result) {
        return err(AppError.notFound(`Task with id ${id} not found`));
      }
      return ok(result);
    } catch (error) {
      return err(AppError.databaseError('Failed to update task', error));
    }
  }

  async delete(id: string): Promise<Result<void, AppError>> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return err(AppError.notFound(`Task with id ${id} not found`));
      }
      return ok(undefined);
    } catch (error) {
      return err(AppError.databaseError('Failed to delete task', error));
    }
  }
}
