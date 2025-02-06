import { Elysia } from "elysia";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { surveys } from "./db/schema";
import { cors } from "@elysiajs/cors";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const db = drizzle(process.env.DATABASE_URL);

const getSurveys = async () => {
	try {
		const survey_seed = await db.select().from(surveys);
		console.log("Fetched Surveys", survey_seed);
		return survey_seed;
	} catch (error) {
		console.log("Error catching users.", error);
		throw error;
	}
};

const app = new Elysia()
	.get("/", () => "Hello Elysia")
	.get("/surveys", () => getSurveys())
	.use(cors())
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
