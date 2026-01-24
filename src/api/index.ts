import { Hono } from "hono";
import agaRoute from "./aga";

const api = new Hono();

api.get("/", (c) => {
	return c.text("yyyyello");
});

api.route("/aga", agaRoute);

export default api;
