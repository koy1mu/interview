import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import "reflect-metadata";
import { Container } from "inversify";
import { Server as HttpServer } from "http";
import { createMongo } from "../createMongo.js";
import { Config } from "../../src/config/Config.js";
import { Database } from "../../src/Database.js";
import { TaskRepository } from "../../src/repositories/TaskRepository.js";
import { CategoryRepository } from "../../src/repositories/CategoryRepository.js";
import { QuoteFacade } from "../../src/facades/QuoteFacade.js";
import { TaskService } from "../../src/services/TaskService.js";
import { CategoryService } from "../../src/services/CategoryService.js";
import { TaskController } from "../../src/controllers/TaskController.js";
import { CategoryController } from "../../src/controllers/CategoryController.js";
import { Server } from "../../src/Server.js";
import { AppApi } from "./utils/AppApi.js";

describe("Task Integration", () => {
	let container: Container;
	let api: AppApi;
	let httpServer: HttpServer;
	let stopMongo: () => Promise<void>;
	const TEST_PORT = 3099;

	beforeAll(async () => {
		const mongo = await createMongo();
		stopMongo = mongo.stop;
		process.env.DB_URI = mongo.uri;
		process.env.APP_PORT = String(TEST_PORT);

		container = new Container({ defaultScope: "Singleton" });
		container.bind(Config).toSelf();
		container.bind(Database).toSelf();
		container.bind(TaskRepository).toSelf();
		container.bind(CategoryRepository).toSelf();
		container.bind(QuoteFacade).toSelf();
		container.bind(TaskService).toSelf();
		container.bind(CategoryService).toSelf();
		container.bind(TaskController).toSelf();
		container.bind(CategoryController).toSelf();
		container.bind(Server).toSelf();

		container.get(Config);
		await container.getAsync(Database);

		const server = container.get(Server);
		const app = server.create(container);

		await new Promise<void>((resolve) => {
			httpServer = app.listen(TEST_PORT, resolve);
		});

		api = new AppApi(app, TEST_PORT);
	});

	afterAll(async () => {
		await new Promise<void>((resolve) => httpServer.close(() => resolve()));
		const db = container.get(Database);
		await db.disconnect();
		await stopMongo();
		vi.restoreAllMocks();
	});

	it("should create and retrieve a task", async () => {
		const createRes = await api.createTask({
			title: "Integration test task",
			description: "Created during integration test",
		});
		expect(createRes.status).toBe(201);

		const created = await createRes.json();
		expect(created.title).toBe("Integration test task");
		expect(created.status).toBe("pending");

		const getRes = await api.getTask(created._id);
		expect(getRes.status).toBe(200);

		const fetched = await getRes.json();
		expect(fetched.title).toBe("Integration test task");
	});

	it("should update a task status", async () => {
		const createRes = await api.createTask({
			title: "To update",
			description: "Will be updated",
		});
		const created = await createRes.json();

		const updateRes = await api.updateTask(created._id, { status: "done" });
		expect(updateRes.status).toBe(200);

		const updated = await updateRes.json();
		expect(updated.status).toBe("done");
	});

	it("should delete a task", async () => {
		const createRes = await api.createTask({
			title: "To delete",
			description: "Will be deleted",
		});
		const created = await createRes.json();

		const deleteRes = await api.deleteTask(created._id);
		expect(deleteRes.status).toBe(204);

		const getRes = await api.getTask(created._id);
		expect(getRes.status).toBe(404);
	});

	it("should return 404 for non-existent task", async () => {
		const res = await api.getTask("507f1f77bcf86cd799439011");
		expect(res.status).toBe(404);
	});

	it("should create a task from a quote", async () => {
		const quoteFacade = container.get(QuoteFacade);
		const originalMethod = quoteFacade.getRandomQuote.bind(quoteFacade);
		const { ok } = await import("neverthrow");

		quoteFacade.getRandomQuote = vi
			.fn()
			.mockResolvedValue(
				ok({
					q: "The only way to do great work is to love what you do",
					a: "Steve Jobs",
				}),
			);

		const res = await api.createQuoteTask();
		expect(res.status).toBe(201);

		const task = await res.json();
		expect(task.title).toBe(
			"The only way to do great work is to love what you do",
		);
		expect(task.description).toContain("Steve Jobs");

		quoteFacade.getRandomQuote = originalMethod;
	});

	it("should list all tasks", async () => {
		const res = await api.getTasks();
		expect(res.status).toBe(200);

		const tasks = await res.json();
		expect(Array.isArray(tasks)).toBe(true);
		expect(tasks.length).toBeGreaterThan(0);
	});
});
