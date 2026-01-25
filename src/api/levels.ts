import { levelsDb } from "../data";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

const app = new Hono();

app.get(
	"/",
	zValidator(
		"query",
		z.object({
			filter: z.enum(["hasPieces"]).optional(),
		})
	),
	async (c) => {
		const q = c.req.valid("query");

		let levels = levelsDb.raw;

		if (q.filter == "hasPieces") {
			levels = levels.map((world) => ({
				...world,
				levels: world.levels.filter((level) => level.pieceCount > 0),
			}));
		}

		const strippedLevels = levels.map((world) => ({
			...world,
			levels: world.levels.map(({ categories, pieceCount, ...keep }) => keep),
		}));

		return c.json({ levels: strippedLevels });
	}
);

export default app;
