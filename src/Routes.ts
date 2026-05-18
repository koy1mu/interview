import { Router } from "express";
import { Container } from "inversify";
import { TaskController } from "./controllers/TaskController.js";
import { CategoryController } from "./controllers/CategoryController.js";

export function registerRoutes(container: Container): Router {
	const router = Router();

	const taskController = container.get(TaskController);
	const categoryController = container.get(CategoryController);

	// Task routes
	router.get("/api/tasks", (req, res) => taskController.getAll(req, res));
	router.get("/api/tasks/:id", (req, res) => taskController.getById(req, res));
	router.post("/api/tasks", (req, res) => taskController.create(req, res));
	router.post("/api/tasks/quote", (req, res) =>
		taskController.createFromQuote(req, res),
	);
	router.post("/api/tasks/:id", (req, res) => taskController.update(req, res));
	router.delete("/api/tasks/:id", (req, res) =>
		taskController.delete(req, res),
	);

	// Category routes
	router.get("/api/categories", (req, res) =>
		categoryController.getAll(req, res),
	);
	router.post("/api/categories", (req, res) =>
		categoryController.create(req, res),
	);
	router.delete("/api/categories/:id", (req, res) =>
		categoryController.delete(req, res),
	);

	return router;
}
