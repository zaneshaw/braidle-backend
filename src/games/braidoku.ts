import { levelsDb } from "../data";
import { CATEGORIES, type Category } from "../types";
import { DateTime } from "luxon";
import random from "random";

// temp braidoku cache
const boardCache: { [key: string]: BraidokuBoard } = {};

type BraidokuBoard = { columns: Category[]; rows: Category[]; grid: number[][][] };

function randomCategories(quantity: number): Category[] {
	const set = new Set<Category>();

	while (set.size < quantity) {
		set.add(random.choice(CATEGORIES) as Category);
	}

	return Array.from(set);
}

export function getBoard(timezone: string, seed?: string, useCache: boolean = true) {
	let _seed = Bun.hash(seed ? seed : (DateTime.now().setZone(timezone).toISODate() as string)).toString();

	if (useCache && boardCache[_seed]) {
		return boardCache[_seed]!;
	}

	let board = generate(_seed, 2, 5, 4);
	if (useCache) {
		boardCache[_seed] = board;
	}

	return board;
}

function generate(seed: string, minLevelsPerCell: number, maxLevelsPerCell: number, maxLevelOccurrences: number): BraidokuBoard {
	let columns: Category[] = [];
	let rows: Category[] = [];
	let grid: number[][][] = [];
	let attempts = 0;

	random.use(seed);

	generator: while (true) {
		// lol
		if (attempts % 1000 == 0) {
			random.use((seed += random.int(0, 999)));
		}

		attempts++;

		// get 6 random unique categories and assign them to columns and rows
		const categories = randomCategories(6);
		columns = [categories[0]!, categories[1]!, categories[2]!];
		rows = [categories[3]!, categories[4]!, categories[5]!];

		// get flattened array of levels
		const levels = Object.values(levelsDb.flat);

		// init a 3x3 array for the grid. indexed by rows
		grid = new Array(3).fill(0).map(() => new Array(3));

		// for every cell, find every level that matches the cell's categories
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				const matchingIndexes = levels.filter((level) => level.categories.includes(columns[col]!) && level.categories.includes(rows[row]!)).map((level) => levels.indexOf(level));
				grid[row]![col] = matchingIndexes;
			}
		}

		// validation
		const counts: { [key: string]: number } = {};
		for (const cell of grid.flat()) {
			// if the cell has too little or too many levels, fail
			if (cell.length < minLevelsPerCell || cell.length > maxLevelsPerCell) {
				continue generator;
			}

			// add each of the cell's levels to a counting dictionary
			for (const levelIndex of cell) {
				counts[levelIndex] = counts[levelIndex] ? counts[levelIndex] + 1 : 1;

				// if a level's count exceeds the maximum, fail
				if (counts[levelIndex] > maxLevelOccurrences) {
					continue generator;
				}
			}
		}

		break;
	}

	return { columns, rows, grid };
}
