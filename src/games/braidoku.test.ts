import { getBoard } from "./braidoku";
import { expect, test } from "bun:test";

test("generate braidoku board (seed = '1337')", () => {
	const board = getBoard("Australia/Melbourne", "1337", false);

	expect(board).toStrictEqual({
		columns: ["key", "firepit", "2+ ladders"],
		rows: ["puzzleboard", "flagpole", "star"],
		grid: [
			[
				[1, 9, 17, 23],
				[1, 9, 30],
				[9, 17, 23, 30],
			],
			[
				[11, 25, 32, 37],
				[3, 11, 32],
				[3, 11, 32, 37],
			],
			[
				[1, 18, 31],
				[1, 18, 30, 36],
				[18, 22, 30, 31, 36],
			],
		],
	});
});
