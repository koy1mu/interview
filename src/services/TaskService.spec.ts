import { describe, it, expect, vi, beforeEach } from "vitest";
import "reflect-metadata";
import { TaskService } from "./TaskService.js";
import { TaskRepository } from "../repositories/TaskRepository.js";
import { QuoteFacade } from "../facades/QuoteFacade.js";
import { ok, err } from "neverthrow";
import { AppError } from "../models/AppError.js";
import { ObjectId } from "mongodb";
import { Task } from "../models/Task.js";

vi.mock("../repositories/TaskRepository.js");
vi.mock("../facades/QuoteFacade.js");

describe("TaskService", () => {
	let taskService: TaskService;
	let taskRepository: TaskRepository;
	let quoteFacade: QuoteFacade;

	const mockTask: Task = {
		_id: new ObjectId(),
		title: "Test task",
		description: "Test description",
		status: "pending",
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(() => {
		taskRepository = new TaskRepository(null as any);
		quoteFacade = new QuoteFacade();
		taskService = new TaskService(taskRepository, quoteFacade);
	});

	describe("getAllTasks", () => {
		it("should return all tasks", async () => {
			vi.mocked(taskRepository.findAll).mockResolvedValue(ok([mockTask]));

			const result = await taskService.getAllTasks();

			expect(result.isOk()).toBe(true);
			expect(result._unsafeUnwrap()).toEqual([mockTask]);
		});

		it("should propagate database errors", async () => {
			vi.mocked(taskRepository.findAll).mockResolvedValue(
				err(AppError.databaseError("connection failed")),
			);

			const result = await taskService.getAllTasks();

			expect(result.isErr()).toBe(true);
			expect(result._unsafeUnwrapErr().type).toBe("DATABASE_ERROR");
		});
	});

	describe("createQuoteTask", () => {
		it("should create a task from a quote", async () => {
			vi.mocked(quoteFacade.getRandomQuote).mockResolvedValue(
				ok({ q: "Be the change", a: "Gandhi" }),
			);
			vi.mocked(taskRepository.insert).mockResolvedValue(ok(mockTask));

			const result = await taskService.createQuoteTask();

			expect(result.isOk()).toBe(true);
			expect(taskRepository.insert).toHaveBeenCalledWith({
				title: "Be the change",
				description: "Inspired by: Gandhi",
			});
		});

		it("should return error when quote API fails", async () => {
			vi.mocked(quoteFacade.getRandomQuote).mockResolvedValue(
				err(AppError.quoteFacadeError("API unavailable")),
			);

			const result = await taskService.createQuoteTask();

			expect(result.isErr()).toBe(true);
			expect(result._unsafeUnwrapErr().type).toBe("QUOTE_FACADE_ERROR");
			expect(taskRepository.insert).not.toHaveBeenCalled();
		});
	});
});
