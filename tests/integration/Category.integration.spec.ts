import { describe, it, expect, beforeAll, afterAll } from "vitest";
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

describe("Category Integration", () => {
	let container: Container;
	let api: AppApi;
	let httpServer: HttpServer;
	let stopMongo: () => Promise<void>;
	const TEST_PORT = 3098;

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
	});

	it("should create and list categories", async () => {
		const createRes = await api.createCategory({
			name: "Work",
			color: "#3498db",
		});
		expect(createRes.status).toBe(201);

		const category = await createRes.json();
		expect(category.name).toBe("Work");
		expect(category.color).toBe("#3498db");

		const listRes = await api.getCategories();
		expect(listRes.status).toBe(200);

		const categories = await listRes.json();
		expect(categories.length).toBeGreaterThan(0);
	});

	it("should delete a category", async () => {
		const createRes = await api.createCategory({
			name: "Temporary",
			color: "#e74c3c",
		});
		const category = await createRes.json();

		const deleteRes = await api.deleteCategory(category._id);
		expect(deleteRes.status).toBe(204);
	});

	it("should return 404 when deleting non-existent category", async () => {
		const res = await api.deleteCategory("507f1f77bcf86cd799439011");
		expect(res.status).toBe(404);
	});
});
