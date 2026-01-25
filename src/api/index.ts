import braidoku from "./braidoku";
import puzzlePiece from "./puzzle_piece";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());

app.route("/braidoku", braidoku);
app.route("/puzzle_piece", puzzlePiece);

export default app;
