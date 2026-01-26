import app from "./api";

Bun.serve({
	port: 8055,
	fetch: app.fetch,
});

console.log("server running at http://localhost:8055");
