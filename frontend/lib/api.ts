const API_BASE = "/api";

export interface Task {
	_id: string;
	title: string;
	description: string;
	status: "pending" | "in-progress" | "done";
	categoryId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	_id: string;
	name: string;
	color: string;
}

export const api = {
	async getTasks(): Promise<Task[]> {
		const res = await fetch(`${API_BASE}/tasks`);
		return res.json();
	},

	async createTask(
		title: string,
		description: string,
		categoryId?: string,
	): Promise<Task> {
		const res = await fetch(`${API_BASE}/tasks`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, description, categoryId }),
		});
		return res.json();
	},

	async updateTask(
		id: string,
		data: Partial<
			Pick<Task, "title" | "description" | "status" | "categoryId">
		>,
	): Promise<Task> {
		const res = await fetch(`${API_BASE}/tasks/${id}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		return res.json();
	},

	async deleteTask(id: string): Promise<void> {
		await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
	},

	async createQuoteTask(): Promise<Task> {
		const res = await fetch(`${API_BASE}/tasks/quote`, { method: "POST" });
		return res.json();
	},

	async getCategories(): Promise<Category[]> {
		const res = await fetch(`${API_BASE}/categories`);
		return res.json();
	},

	async createCategory(name: string, color: string): Promise<Category> {
		const res = await fetch(`${API_BASE}/categories`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, color }),
		});
		return res.json();
	},

	async deleteCategory(id: string): Promise<void> {
		await fetch(`${API_BASE}/categories/${id}`, { method: "DELETE" });
	},
};
