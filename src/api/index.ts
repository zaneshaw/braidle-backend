import braidoku from "./braidoku";
import levels from "./levels";
import puzzlePiece from "./puzzle_piece";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();
app.use("*", cors());
app.use(logger());

app.route("/levels", levels);
app.route("/braidoku", braidoku);
app.route("/puzzle_piece", puzzlePiece);

export default app;
