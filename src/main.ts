import app from "./api";

Bun.serve({
	port: 3000,
	fetch: app.fetch,
});

console.log("server running at http://localhost:3000");
