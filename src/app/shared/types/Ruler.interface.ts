import { z } from "zod";

export const rulerSchema = z.object({
	id: z.number(),
	name: z.string(),
	surname: z.string(),
	officeStartDate: z.string().datetime(),
	countryId: z.number(),
});

export type Ruler = z.infer<typeof rulerSchema>;
