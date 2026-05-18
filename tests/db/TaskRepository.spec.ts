import { describe, it, expect, beforeAll, afterAll } from "vitest";
import "reflect-metadata";
import { Container } from "inversify";
import { TaskRepository } from "../../src/repositories/TaskRepository.js";
import { Database } from "../../src/Database.js";
import { Config } from "../../src/config/Config.js";
import { createMongo } from "../createMongo.js";

describe("TaskRepository", () => {
	let container: Container;
	let taskRepository: TaskRepository;
	let stopMongo: () => Promise<void>;

	beforeAll(async () => {
		const mongo = await createMongo();
		stopMongo = mongo.stop;
		process.env.DB_URI = mongo.uri;

		container = new Container({ defaultScope: "Singleton" });
		container.bind(Config).toSelf();
		container.bind(Database).toSelf();
		container.bind(TaskRepository).toSelf();

		container.get(Config);
		await container.getAsync(Database);
		taskRepository = container.get(TaskRepository);
	});

	afterAll(async () => {
		const db = container.get(Database);
		await db.disconnect();
		await stopMongo();
	});

	it("should insert and find a task", async () => {
		const result = await taskRepository.insert({
			title: "Test task",
			description: "A test task description",
		});

		expect(result.isOk()).toBe(true);
		const task = result._unsafeUnwrap();
		expect(task.title).toBe("Test task");
		expect(task.status).toBe("pending");

		const findResult = await taskRepository.findById(task._id.toString());
		expect(findResult.isOk()).toBe(true);
		expect(findResult._unsafeUnwrap().title).toBe("Test task");
	});

	it("should return NOT_FOUND for non-existent task", async () => {
		const result = await taskRepository.findById("507f1f77bcf86cd799439011");
		expect(result.isErr()).toBe(true);
		expect(result._unsafeUnwrapErr().type).toBe("NOT_FOUND");
	});

	it("should update a task", async () => {
		const insertResult = await taskRepository.insert({
			title: "Update me",
			description: "Will be updated",
		});
		const task = insertResult._unsafeUnwrap();

		const updateResult = await taskRepository.update(task._id.toString(), {
			status: "done",
			title: "Updated",
		});

		expect(updateResult.isOk()).toBe(true);
		const updated = updateResult._unsafeUnwrap();
		expect(updated.status).toBe("done");
		expect(updated.title).toBe("Updated");
	});

	it("should delete a task", async () => {
		const insertResult = await taskRepository.insert({
			title: "Delete me",
			description: "Will be deleted",
		});
		const task = insertResult._unsafeUnwrap();

		const deleteResult = await taskRepository.delete(task._id.toString());
		expect(deleteResult.isOk()).toBe(true);

		const findResult = await taskRepository.findById(task._id.toString());
		expect(findResult.isErr()).toBe(true);
	});

	it("should list all tasks", async () => {
		const result = await taskRepository.findAll();
		expect(result.isOk()).toBe(true);
		expect(Array.isArray(result._unsafeUnwrap())).toBe(true);
	});
});
