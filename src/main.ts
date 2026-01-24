import api from "./api";

Bun.serve({
	port: 3000,
	fetch: api.fetch,
});

console.log("server running at http://localhost:3000");
