import { Express } from "express";
import { Container } from "inversify";

export class AppApi {
	private baseUrl: string;

	constructor(
		private readonly app: Express,
		port: number,
	) {
		this.baseUrl = `http://localhost:${port}`;
	}

	private async request(
		method: string,
		path: string,
		body?: unknown,
	): Promise<Response> {
		// Use the express app's address for testing
		const url = `${this.baseUrl}${path}`;
		const options: RequestInit = {
			method,
			headers: { "Content-Type": "application/json" },
		};
		if (body) {
			options.body = JSON.stringify(body);
		}
		return fetch(url, options);
	}

	async getTasks(): Promise<Response> {
		return this.request("GET", "/api/tasks");
	}

	async getTask(id: string): Promise<Response> {
		return this.request("GET", `/api/tasks/${id}`);
	}

	async createTask(body: {
		title: string;
		description: string;
		categoryId?: string;
	}): Promise<Response> {
		return this.request("POST", "/api/tasks", body);
	}

	async updateTask(
		id: string,
		body: Record<string, unknown>,
	): Promise<Response> {
		return this.request("POST", `/api/tasks/${id}`, body);
	}

	async deleteTask(id: string): Promise<Response> {
		return this.request("DELETE", `/api/tasks/${id}`);
	}

	async createQuoteTask(): Promise<Response> {
		return this.request("POST", "/api/tasks/quote");
	}

	async getCategories(): Promise<Response> {
		return this.request("GET", "/api/categories");
	}

	async createCategory(body: {
		name: string;
		color: string;
	}): Promise<Response> {
		return this.request("POST", "/api/categories", body);
	}

	async deleteCategory(id: string): Promise<Response> {
		return this.request("DELETE", `/api/categories/${id}`);
	}
}
