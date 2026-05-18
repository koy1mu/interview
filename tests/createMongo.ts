import { MongoMemoryServer } from "mongodb-memory-server-core";

export async function createMongo(): Promise<{
	uri: string;
	stop: () => Promise<void>;
}> {
	const mongod = await MongoMemoryServer.create();
	return {
		uri: mongod.getUri(),
		stop: () => mongod.stop(),
	};
}
