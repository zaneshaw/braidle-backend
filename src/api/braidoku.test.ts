import app from ".";
import { getBoard } from "../games/braidoku";
import { expect, test } from "bun:test";

test("GET /braidoku/board (seed = 1337)", async () => {
	const res = await app.request("/braidoku/board?tz=Australia/Melbourne&seed=1337&useCache=false", {
		method: "GET",
		headers: new Headers({ "Content-Type": "application/json" }),
	});

	expect(res.status).toBe(200);

	const board = getBoard("Australia/Melbourne", 1337, false);

	expect(await res.json()).toStrictEqual({ columns: board.columns, rows: board.rows });
});
