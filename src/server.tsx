import { Elysia } from "elysia";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { surveys } from "./db/schema";
import { cors } from "@elysiajs/cors";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const db = drizzle(process.env.DATABASE_URL);

const getAllSurveys = async () => {
	const results = await db.select().from(surveys);
	return results;
};

const app = new Elysia()
	.get("/", () => "Hello Elysia")
	.get("/surveys", () => getAllSurveys())
	.use(
		cors({
			origin: "localhost:5173",
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
