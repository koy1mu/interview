import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService.js';
import { AppError, getHttpStatus } from '../models/AppError.js';
import { CreateTaskInput, UpdateTaskInput } from '../models/Task.js';

@injectable()
export class TaskController {
  constructor(
    @inject(TaskService) private readonly taskService: TaskService,
  ) {}

  async getAll(_req: Request, res: Response): Promise<void> {
    const result = await this.taskService.getAllTasks();
    result.match(
      (tasks) => res.status(200).json(tasks),
      (error) => this.sendError(res, error),
    );
  }

  async getById(req: Request, res: Response): Promise<void> {
    const result = await this.taskService.getTaskById(req.params.id as string);
    result.match(
      (task) => res.status(200).json(task),
      (error) => this.sendError(res, error),
    );
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateTaskInput = req.body;
    const result = await this.taskService.createTask(input);
    result.match(
      (task) => res.status(201).json(task),
      (error) => this.sendError(res, error),
    );
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateTaskInput = req.body;
    const result = await this.taskService.updateTask(req.params.id as string, input);
    result.match(
      (task) => res.status(200).json(task),
      (error) => this.sendError(res, error),
    );
  }

  async delete(req: Request, res: Response): Promise<void> {
    const result = await this.taskService.deleteTask(req.params.id as string);
    result.match(
      () => res.status(204).send(),
      (error) => this.sendError(res, error),
    );
  }

  async createFromQuote(_req: Request, res: Response): Promise<void> {
    const result = await this.taskService.createQuoteTask();
    result.match(
      (task) => res.status(201).json(task),
      (error) => this.sendError(res, error),
    );
  }

  private sendError(res: Response, error: AppError): void {
    res.status(getHttpStatus(error)).json({
      type: error.type,
      message: error.message,
    });
  }
}
