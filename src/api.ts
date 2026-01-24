import { levelsDb } from "./data";
import { generate as braidokuGenerate } from "./games/braidoku";
import type { Category } from "./types";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { DateTime } from "luxon";

type GenerateReturn = { columns: Category[]; rows: Category[]; grid: number[][][] };

// temp braidoku cache
const board: { [key: string]: GenerateReturn } = {};

export const log = (...message: string[]) => {
	console.log(...message);
};

const api = new Hono();
api.use(logger(log));

api.get("/", (c) => {
	return c.text("yyyyello");
});

api.get("/braidoku/board", async (c) => {
	if (!c.req.query("tz")) return c.text("missing tz (IANA time zone).", 400);

	const date = DateTime.now().setZone(c.req.query("tz")).toISODate();

	if (date == undefined) return c.text("date could not be set.", 500);

	if (!board[date]) {
		board[date] = braidokuGenerate(date, 2, 5, 4);
	}

	log("aaa");

	return c.json({ columns: board[date].columns, rows: board[date].rows });
});

api.get("/braidoku/guess", async (c) => {
	if (!c.req.query("tz")) return c.text("missing tz (IANA time zone).", 400);

	const date = DateTime.now().setZone(c.req.query("tz")).toISODate();

	if (date == undefined) return c.text("date could not be set.", 500);

	if (!board[date]) {
		board[date] = braidokuGenerate(date, 2, 5, 4);
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

export default api;
