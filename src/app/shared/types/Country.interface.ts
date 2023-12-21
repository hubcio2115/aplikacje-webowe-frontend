import { z } from "zod";

export const countrySchema = z.object({
	id: z.number(),
	name: z.string(),
	gdp: z.number(),
	isInEurope: z.boolean(),
	formationYear: z.string().datetime(),
	rulerId: z.number().optional(),
});

export type Country = z.infer<typeof countrySchema>;
