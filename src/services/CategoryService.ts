import { injectable, inject } from 'inversify';
import { Result } from 'neverthrow';
import { CategoryRepository } from '../repositories/CategoryRepository.js';
import { Category, CreateCategoryInput } from '../models/Category.js';
import { AppError } from '../models/AppError.js';

@injectable()
export class CategoryService {
  constructor(
    @inject(CategoryRepository) private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllCategories(): Promise<Result<Category[], AppError>> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<Result<Category, AppError>> {
    return this.categoryRepository.findById(id);
  }

  async createCategory(input: CreateCategoryInput): Promise<Result<Category, AppError>> {
    return this.categoryRepository.insert(input);
  }

  async deleteCategory(id: string): Promise<Result<void, AppError>> {
    return this.categoryRepository.delete(id);
  }
}
