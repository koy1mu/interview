import { injectable, inject } from 'inversify';
import { Result, err } from 'neverthrow';
import { TaskRepository } from '../repositories/TaskRepository.js';
import { QuoteFacade } from '../facades/QuoteFacade.js';
import { Task, CreateTaskInput, UpdateTaskInput } from '../models/Task.js';
import { AppError } from '../models/AppError.js';

@injectable()
export class TaskService {
  constructor(
    @inject(TaskRepository) private readonly taskRepository: TaskRepository,
    @inject(QuoteFacade) private readonly quoteFacade: QuoteFacade,
  ) {}

  async getAllTasks(): Promise<Result<Task[], AppError>> {
    return this.taskRepository.findAll();
  }

  async getTaskById(id: string): Promise<Result<Task, AppError>> {
    return this.taskRepository.findById(id);
  }

  async createTask(input: CreateTaskInput): Promise<Result<Task, AppError>> {
    return this.taskRepository.insert(input);
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Result<Task, AppError>> {
    return this.taskRepository.update(id, input);
  }

  async deleteTask(id: string): Promise<Result<void, AppError>> {
    return this.taskRepository.delete(id);
  }

  async createQuoteTask(): Promise<Result<Task, AppError>> {
    const quoteResult = this.quoteFacade.getRandomQuote();

    if (quoteResult.isErr()) {
      return err(quoteResult.error);
    }

    const quote = quoteResult.value;
    return this.taskRepository.insert({
      title: quote.q,
      description: `Inspired by: ${quote.a}`,
    });
  }
}
