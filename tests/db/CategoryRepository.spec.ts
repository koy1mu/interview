import { describe, it, expect, beforeAll, afterAll } from "vitest";
import "reflect-metadata";
import { Container } from "inversify";
import { CategoryRepository } from "../../src/repositories/CategoryRepository.js";
import { Database } from "../../src/Database.js";
import { Config } from "../../src/config/Config.js";
import { createMongo } from "../createMongo.js";

describe("CategoryRepository", () => {
	let container: Container;
	let categoryRepository: CategoryRepository;
	let stopMongo: () => Promise<void>;

	beforeAll(async () => {
		const mongo = await createMongo();
		stopMongo = mongo.stop;
		process.env.DB_URI = mongo.uri;

		container = new Container({ defaultScope: "Singleton" });
		container.bind(Config).toSelf();
		container.bind(Database).toSelf();
		container.bind(CategoryRepository).toSelf();

		container.get(Config);
		await container.getAsync(Database);
		categoryRepository = container.get(CategoryRepository);
	});

	afterAll(async () => {
		const db = container.get(Database);
		await db.disconnect();
		await stopMongo();
	});

	it("should insert and find a category", async () => {
		const result = await categoryRepository.insert({
			name: "Work",
			color: "#ff0000",
		});

		expect(result.isOk()).toBe(true);
		const category = result._unsafeUnwrap();
		expect(category.name).toBe("Work");
		expect(category.color).toBe("#ff0000");

		const findResult = await categoryRepository.findById(
			category._id.toString(),
		);
		expect(findResult.isOk()).toBe(true);
		expect(findResult._unsafeUnwrap().name).toBe("Work");
	});

	it("should return NOT_FOUND for non-existent category", async () => {
		const result = await categoryRepository.findById(
			"507f1f77bcf86cd799439011",
		);
		expect(result.isErr()).toBe(true);
		expect(result._unsafeUnwrapErr().type).toBe("NOT_FOUND");
	});

	it("should delete a category", async () => {
		const insertResult = await categoryRepository.insert({
			name: "Temporary",
			color: "#00ff00",
		});
		const category = insertResult._unsafeUnwrap();

		const deleteResult = await categoryRepository.delete(
			category._id.toString(),
		);
		expect(deleteResult.isOk()).toBe(true);

		const findResult = await categoryRepository.findById(
			category._id.toString(),
		);
		expect(findResult.isErr()).toBe(true);
	});

	it("should list all categories", async () => {
		const result = await categoryRepository.findAll();
		expect(result.isOk()).toBe(true);
		expect(Array.isArray(result._unsafeUnwrap())).toBe(true);
	});
});
