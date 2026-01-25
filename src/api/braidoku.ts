import { levelsDb } from "../data";
import { getBoard } from "../games/braidoku";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { CanonicalTimezoneSchema } from "zod-timezone-validation";

const app = new Hono();

const schema = z.object({
	tz: CanonicalTimezoneSchema,
	seed: z.string().optional(),
	useCache: z.coerce.boolean().default(true),
});

app.get("/board", zValidator("query", schema), async (c) => {
	const q = c.req.valid("query");

	const board = getBoard(q.tz, q.seed, q.useCache);

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
		const q = c.req.valid("query");

		const board = getBoard(q.tz, q.seed, q.useCache);
		const levels = Object.values(levelsDb.flat);

		const cell = board.grid.flat()[q.index]!;
		const correct = cell.some((levelIndex) => levels[levelIndex]!.world == q.world && levels[levelIndex]!.level == q.level);

		return c.json({ correct });
	}
);

export default app;
