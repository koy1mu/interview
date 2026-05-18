import "reflect-metadata";
import { createContainer } from "./inversify.config.js";
import { Server } from "./Server.js";
import pino from "pino";

const logger = pino({ name: "Application" });

async function main(): Promise<void> {
	try {
		const container = await createContainer();
		const server = container.get(Server);
		server.start(container);
	} catch (error) {
		logger.error(error, "Failed to start application");
		process.exit(1);
	}
}

main();
