import { Elysia, t } from "elysia";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { surveys, subquestion, answers } from "./src/db/schema";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const db = drizzle(process.env.DATABASE_URL);

const testConnection = async () => {
	try {
		const result = await db.execute(sql`SELECT NOW()`);
		console.log('✅ Database connected successfully');
		return true;
	} catch (error) {
		console.error('❌ Database connection failed:', error);
		return false;
	}
};

// You can call this right after creating the db instance
await testConnection();

const getAllSurveys = async () => {
	const results = await db.select().from(surveys);
	return results;
};

const makeASurvey = async (survey: typeof surveys.$inferInsert) => {
	await db.insert(surveys).values(survey);
	console.log("Survey inserted successfully.");
};

const getSurveyQuestions = async (id: string) => {
	const questions = await db
		.select()
		.from(subquestion)
		.where(eq(subquestion.surveyId, id));
	console.log("Returned data successfully.");
	return questions;
};

const addAnswers = async (userAnswers: Record<string, string>) => {
	console.log(userAnswers);
	await Promise.all(
		Object.entries(userAnswers).map(([surveyId, answer]) =>
			db.insert(answers).values({
				id: randomUUID(),
				surveyId,
				answer: answer.toString(),
			}),
		),
	);
	console.log("Insertion successful.");
};

const app = new Elysia()
	.get("/", () => "Hello Elysia")
	.get("/surveys", () => getAllSurveys())
	.get("/questions/:id", ({ params: { id } }) => getSurveyQuestions(id), {
		params: t.Object({
			id: t.String(),
		}),
	})
	.post(
		"/surveys",
		({ body }) => {
			makeASurvey(body as typeof surveys.$inferInsert);
			return { success: true };
		},
		{
			body: t.Object({
				id: t.String(),
				question: t.String(),
			}),
		},
	)
	.post(
		"/answers",
		({ body }) => {
			addAnswers(body as Record<string, string>);
			return { success: true };
		},
		{
			body: t.Object({
				subquestionId: t.String(),
				answer: t.String(),
			}),
		},
	)
	.use(
		cors({
			origin: ["localhost:5173", ...(process.env.RAILWAY_PUBLIC_DOMAIN ? [process.env.RAILWAY_PUBLIC_DOMAIN] : [])],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.listen(process.env.PORT ?? 3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
