import type { Level, World } from "./types";
import { join } from "path";

const levelsFile = Bun.file(join(import.meta.dir, "levels.json"));

export const levelsDb: { raw: World[]; flat: { [key: string]: Level & { world: number } } } = {
	raw: await levelsFile.json(),
	get flat() {
		let flattened: { [key: string]: Level & { world: number } } = {};

		for (const world of this.raw) {
			for (const level of world.levels) {
				flattened[`${world.world}-${level.level}`] = { world: world.world, ...level };
			}
		}

		return flattened;
	},
};
