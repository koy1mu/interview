import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService.js';
import { AppError, getHttpStatus } from '../models/AppError.js';
import { CreateCategoryInput } from '../models/Category.js';

@injectable()
export class CategoryController {
  constructor(
    @inject(CategoryService) private readonly categoryService: CategoryService,
  ) {}

  async getAll(_req: Request, res: Response): Promise<void> {
    const result = await this.categoryService.getAllCategories();
    result.match(
      (categories) => res.status(200).json(categories),
      (error) => this.sendError(res, error),
    );
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateCategoryInput = req.body;
    const result = await this.categoryService.createCategory(input);
    result.match(
      (category) => res.status(201).json(category),
      (error) => this.sendError(res, error),
    );
  }

  async delete(req: Request, res: Response): Promise<void> {
    const result = await this.categoryService.deleteCategory(req.params.id as string);
    result.match(
      () => res.status(200).send(),
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
