import { injectable } from "inversify";
import { Result, ok, err } from "neverthrow";
import { Quote, QUOTE_SCHEMA } from "./apitypes/Quote.js";
import { AppError } from "../models/AppError.js";

const QUOTE_API_URL = "https://zenquotes.io/api/random";

@injectable()
export class QuoteFacade {
	async getRandomQuote(): Promise<Result<Quote, AppError>> {
		try {
			const response = await fetch(QUOTE_API_URL);

			if (!response.ok) {
				return err(
					AppError.quoteFacadeError(
						`Quote API returned status ${response.status}`,
					),
				);
			}

			const data = await response.json();
			const parsed = QUOTE_SCHEMA.safeParse(
				Array.isArray(data) ? data[0] : data,
			);

			if (!parsed.success) {
				return err(
					AppError.quoteFacadeError(
						"Invalid response from Quote API",
						parsed.error,
					),
				);
			}

			return ok(parsed.data);
		} catch (error) {
			return err(AppError.quoteFacadeError("Failed to fetch quote", error));
		}
	}
}
