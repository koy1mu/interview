import { injectable, postConstruct } from "inversify";
import dotenv from "dotenv";
import { z } from "zod";

const ConfigSchema = z.object({
	APP_NAME: z.string().default("task-manager"),
	APP_PORT: z.coerce.number().default(3000),
	DB_URI: z.string().default("mongodb://localhost:27017/task-manager"),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

@injectable()
export class Config {
	private _values!: AppConfig;

	@postConstruct()
	init(): void {
		dotenv.config();
		this._values = ConfigSchema.parse(process.env);
	}

	get values(): AppConfig {
		return this._values;
	}
}
