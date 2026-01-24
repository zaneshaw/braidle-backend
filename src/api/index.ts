import braidoku from "./braidoku";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());

app.route("/braidoku", braidoku);

export default app;
