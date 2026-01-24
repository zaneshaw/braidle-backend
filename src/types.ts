export const CATEGORIES = [
	"puzzleboard",
	"goomba",
	"rabbit",
	"key",
	"green piece",
	"green key",
	"cloud",
	"firepit",
	"lever",
	"flagpole",
	"trellis",
	"2+ ladders",
	"vertical platform",
	"plant",
	"star",
	"no piece",
	"1 piece",
	"world 1",
	"world 2",
	"world 3",
	"world 4",
	"world 5",
	"world 6",
];
export type Category = (typeof CATEGORIES)[number];

export type Level = {
	level: number;
	name: string | null;
	categories: Category[];
	pieceCount: number;
};

export type World = {
	world: number;
	title: string | null;
	levels: Level[];
};
