import { describe, it, expect, vi, beforeEach } from "vitest";
import { Config } from "./Config.js";

describe("Config", () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
	});

	it("should load config from environment variables", () => {
		vi.stubEnv("APP_NAME", "test-app");
		vi.stubEnv("APP_PORT", "4000");
		vi.stubEnv("DB_URI", "mongodb://test:27017/db");

		const config = new Config();
		config.init();

		expect(config.values.APP_NAME).toBe("test-app");
		expect(config.values.APP_PORT).toBe(4000);
		expect(config.values.DB_URI).toBe("mongodb://test:27017/db");
	});

	it("should use defaults when env vars are missing", () => {
		const config = new Config();
		config.init();

		expect(config.values.APP_NAME).toBe("task-manager");
		expect(config.values.APP_PORT).toBe(3000);
	});
});
