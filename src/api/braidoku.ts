import { levelsDb } from "../data";
import { getBoard } from "../games/braidoku";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { CanonicalTimezoneSchema } from "zod-timezone-validation";

const app = new Hono();

const schema = z.object({
	tz: CanonicalTimezoneSchema,
	seed: z.coerce.number().int().min(0).max(999999999999).optional(),
	useCache: z.coerce.boolean().default(true),
});

app.get("/board", zValidator("query", schema), async (c) => {
	const board = getBoard(c.req.valid("query").tz, c.req.valid("query").seed, c.req.valid("query").useCache);

	return c.json({ columns: board.columns, rows: board.rows });
});

app.get(
	"/guess",
	zValidator(
		"query",
		z.object({
			...schema.shape,
			index: z.coerce.number().min(0).max(8),
			world: z.coerce.number(),
			level: z.coerce.number(),
		})
	),
	async (c) => {
		const board = getBoard(c.req.valid("query").tz, c.req.valid("query").seed, c.req.valid("query").useCache);

		const levels = Object.values(levelsDb.flat);

		const cell = board.grid.flat()[c.req.valid("query").index]!;
		const correct = cell.some((levelIndex) => levels[levelIndex]!.world == c.req.valid("query").world && levels[levelIndex]!.level == c.req.valid("query").level);

		return c.json(correct);
	}
);

export default app;
