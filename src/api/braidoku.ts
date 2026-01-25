import { levelsDb } from "../data";
import { generate } from "../games/braidoku";
import type { Category } from "../types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { DateTime } from "luxon";
import z from "zod";
import { CanonicalTimezoneSchema } from "zod-timezone-validation";

type GenerateReturn = { columns: Category[]; rows: Category[]; grid: number[][][] };

// temp braidoku cache
const board: { [key: string]: GenerateReturn } = {};

const app = new Hono();

app.get(
	"/board",
	zValidator(
		"query",
		z.object({
			tz: CanonicalTimezoneSchema,
		})
	),
	async (c) => {
		const date = DateTime.now().setZone(c.req.valid("query").tz).toISODate() as string;

		if (!board[date]) {
			board[date] = generate(date, 2, 5, 4);
		}

		return c.json({ columns: board[date].columns, rows: board[date].rows });
	}
);

app.get(
	"/guess",
	zValidator(
		"query",
		z.object({
			tz: CanonicalTimezoneSchema,
			index: z.coerce.number().min(0).max(8),
			world: z.coerce.number(),
			level: z.coerce.number(),
		})
	),
	async (c) => {
		const date = DateTime.now().setZone(c.req.valid("query").tz).toISODate() as string;

		if (!board[date]) {
			board[date] = generate(date, 2, 5, 4);
		}

		const levels = Object.values(levelsDb.flat);

		const cell = board[date].grid.flat()[c.req.valid("query").index]!;
		const correct = cell.some((levelIndex) => levels[levelIndex]!.world == c.req.valid("query").world && levels[levelIndex]!.level == c.req.valid("query").level);

		return c.json(correct);
	}
);

export default app;
