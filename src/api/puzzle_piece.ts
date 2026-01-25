import { getPiece } from "../games/puzzle_piece";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { CanonicalTimezoneSchema } from "zod-timezone-validation";

const app = new Hono();

const schema = z.object({
	tz: CanonicalTimezoneSchema,
	seed: z.string().optional(),
});

app.get("/image", zValidator("query", schema), async (c) => {
	const piece = await getPiece(c.req.valid("query").tz, c.req.valid("query").seed);

	return c.json({ base64: `data:image/png;base64,${piece.image.toBase64()}` });
});

app.get(
	"/guess",
	zValidator(
		"query",
		z.object({
			...schema.shape,
			world: z.coerce.number(),
			level: z.coerce.number(),
		})
	),
	async (c) => {
		const piece = await getPiece(c.req.valid("query").tz, c.req.valid("query").seed);

		const correct = piece.level.world == c.req.valid("query").world && piece.level.level == c.req.valid("query").level;

		return c.json(correct);
	}
);

export default app;
