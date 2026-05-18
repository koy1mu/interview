import { z } from "zod";

export const QUOTE_SCHEMA = z.object({
	q: z.string(),
	a: z.string(),
});

export type Quote = z.infer<typeof QUOTE_SCHEMA>;
