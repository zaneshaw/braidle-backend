import { levelsDb } from "../data";
import { generate } from "../games/braidoku";
import type { Category } from "../types";
import { Hono } from "hono";
import { DateTime } from "luxon";

type GenerateReturn = { columns: Category[]; rows: Category[]; grid: number[][][] };

// temp braidoku cache
const board: { [key: string]: GenerateReturn } = {};

const app = new Hono();

app.get("/board", async (c) => {
	if (!c.req.query("tz")) return c.text("missing tz (IANA time zone).", 400);

	const date = DateTime.now().setZone(c.req.query("tz")).toISODate();

	if (date == undefined) return c.text("date could not be set.", 500);

	if (!board[date]) {
		board[date] = generate(date, 2, 5, 4);
	}

	return c.json({ columns: board[date].columns, rows: board[date].rows });
});

app.get("/guess", async (c) => {
	if (!c.req.query("tz")) return c.text("missing tz (IANA time zone).", 400);

	const date = DateTime.now().setZone(c.req.query("tz")).toISODate();

	if (date == undefined) return c.text("date could not be set.", 500);

	if (!board[date]) {
		board[date] = generate(date, 2, 5, 4);
	}

	if (c.req.query("index") && c.req.query("world") && c.req.query("level")) {
		const [cellIndex, world, level] = [c.req.query("index"), c.req.query("world"), c.req.query("level")].map((x) => parseInt(x!));

		const levels = Object.values(levelsDb.flat);

		const correct = board[date!]!.grid.flat()[cellIndex!]!.some((levelIndex) => levels[levelIndex]!.world == world && levels[levelIndex]!.level == level);

		return c.json({ correct });
	} else {
		return c.text("missing index, world, or level.", 400);
	}
});

export default app;
