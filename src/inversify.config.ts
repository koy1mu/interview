import { Container } from "inversify";
import { Config } from "./config/Config.js";
import { Database } from "./Database.js";
import { TaskRepository } from "./repositories/TaskRepository.js";
import { CategoryRepository } from "./repositories/CategoryRepository.js";
import { QuoteFacade } from "./facades/QuoteFacade.js";
import { TaskService } from "./services/TaskService.js";
import { CategoryService } from "./services/CategoryService.js";
import { TaskController } from "./controllers/TaskController.js";
import { CategoryController } from "./controllers/CategoryController.js";
import { Server } from "./Server.js";

export async function createContainer(): Promise<Container> {
	const container = new Container({ defaultScope: "Singleton" });

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

	// Trigger postConstruct lifecycle hooks
	container.get(Config);
	await container.getAsync(Database);

	return container;
}
