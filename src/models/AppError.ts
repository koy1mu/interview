export type ErrorType =
	| "DATABASE_ERROR"
	| "NOT_FOUND"
	| "VALIDATION_ERROR"
	| "QUOTE_FACADE_ERROR";

export class AppError<T extends ErrorType = ErrorType> {
	readonly type: T;
	readonly message: string;
	readonly cause?: unknown;

	private constructor(type: T, message: string, cause?: unknown) {
		this.type = type;
		this.message = message;
		this.cause = cause;
	}

	static databaseError(
		message: string,
		cause?: unknown,
	): AppError<"DATABASE_ERROR"> {
		return new AppError("DATABASE_ERROR", message, cause);
	}

	static notFound(message: string): AppError<"NOT_FOUND"> {
		return new AppError("NOT_FOUND", message);
	}

	static validationError(message: string): AppError<"VALIDATION_ERROR"> {
		return new AppError("VALIDATION_ERROR", message);
	}

	static quoteFacadeError(
		message: string,
		cause?: unknown,
	): AppError<"QUOTE_FACADE_ERROR"> {
		return new AppError("QUOTE_FACADE_ERROR", message, cause);
	}
}

export function getHttpStatus(error: AppError): number {
	switch (error.type) {
		case "NOT_FOUND":
			return 404;
		case "VALIDATION_ERROR":
			return 400;
		case "DATABASE_ERROR":
		case "QUOTE_FACADE_ERROR":
			return 500;
	}
}
