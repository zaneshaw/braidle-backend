import { getBoard } from "./braidoku";
import { expect, test } from "bun:test";

test("generate braidoku board (seed = '1337')", () => {
	const board = getBoard("Australia/Melbourne", "1337", false);

	expect(board).toStrictEqual({
		columns: ["world 3", "cloud", "1 piece"],
		rows: ["2+ ladders", "trellis", "firepit"],
		grid: [
			[
				[7, 8, 9, 11],
				[16, 17, 37],
				[2, 15, 32],
			],
			[
				[5, 6, 10, 11],
				[6, 28],
				[5, 24, 27],
			],
			[
				[7, 8, 9, 10, 11],
				[1, 16],
				[24, 32],
			],
		],
	});
});
