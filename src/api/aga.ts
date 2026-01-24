import { Hono } from "hono";

const route = new Hono();

route.get("/", async (c) => {
	return c.text("aga");
});

export default route;
