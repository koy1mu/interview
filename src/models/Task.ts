import { ObjectId } from "mongodb";

export interface Task {
	_id: ObjectId;
	title: string;
	description: string;
	status: "pending" | "in-progress" | "done";
	categoryId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type CreateTaskInput = Pick<
	Task,
	"title" | "description" | "categoryId"
>;

export type UpdateTaskInput = Partial<
	Pick<Task, "title" | "description" | "status" | "categoryId">
>;

export function isTask(value: unknown): value is Task {
	if (typeof value !== "object" || value === null) return false;
	const candidate = value as Record<string, unknown>;
	return (
		typeof candidate.title === "string" &&
		typeof candidate.description === "string" &&
		typeof candidate.status === "string" &&
		["pending", "in-progress", "done"].includes(candidate.status as string)
	);
}
