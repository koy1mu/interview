import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "reflect-metadata";
import { QuoteFacade } from "./QuoteFacade.js";

describe("QuoteFacade", () => {
	let quoteFacade: QuoteFacade;
	const fetchMock = vi.fn();

	beforeEach(() => {
		quoteFacade = new QuoteFacade();
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return a quote on success", async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => [{ q: "Stay hungry, stay foolish", a: "Steve Jobs" }],
		});

		const result = await quoteFacade.getRandomQuote();

		expect(result.isOk()).toBe(true);
		const quote = result._unsafeUnwrap();
		expect(quote.q).toBe("Stay hungry, stay foolish");
		expect(quote.a).toBe("Steve Jobs");
	});
});
