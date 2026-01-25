import { levelsDb } from "../data";
import type { Level } from "../types";
import { DateTime } from "luxon";
import { join } from "path";
import random from "random";

export async function getPiece(timezone: string, seed?: string) {
	let _seed = Bun.hash(seed ? seed : (DateTime.now().setZone(timezone).toISODate() as string)).toString();

	random.use(_seed);

	const levelsWithPieces = Object.values(levelsDb.flat).filter((level) => level.pieceCount > 0);
	const level = random.choice(levelsWithPieces) as Level & { world: number };
	const pieceNumber = random.int(1, level.pieceCount);

	const pieceFile = Bun.file(join(import.meta.dir, "../../assets/images/pieces/", `${level.world}-${level.level}_${pieceNumber}.webp`));
	const pieceImage = new Uint8Array(await pieceFile.arrayBuffer());

	return { level, image: pieceImage };
}
