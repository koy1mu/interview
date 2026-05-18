import "reflect-metadata";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import { createContainer } from "./inversify.config.js";
import { Server } from "./Server.js";
import pino from "pino";

const logger = pino({ name: "DevServer" });

async function main(): Promise<void> {
	logger.info("Starting in-memory MongoDB...");
	const mongod = await MongoMemoryServer.create();
	process.env.DB_URI = mongod.getUri();
	logger.info(`MongoDB running at ${mongod.getUri()}`);

	const container = await createContainer();
	const server = container.get(Server);
	server.start(container);

	process.on("SIGINT", async () => {
		await mongod.stop();
		process.exit(0);
	});
}

main().catch((err) => {
	logger.error(err, "Failed to start dev server");
	process.exit(1);
});
