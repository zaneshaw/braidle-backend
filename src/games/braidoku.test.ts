import { getBoard } from "./braidoku";
import { expect, test } from "bun:test";

test("generate braidoku board (seed = 1337)", () => {
	const board = getBoard("Australia/Melbourne", 1337, false);

	expect(board).toStrictEqual({
		columns: ["firepit", "key", "goomba"],
		rows: ["plant", "cloud", "flagpole"],
		grid: [
			[
				[8, 9, 30, 36],
				[9, 13, 17],
				[9, 13, 17, 30, 36],
			],
			[
				[1, 16],
				[1, 16, 17, 37],
				[1, 16, 17],
			],
			[
				[3, 11, 32],
				[11, 25, 32, 37],
				[3, 11, 25],
			],
		],
	});
});
