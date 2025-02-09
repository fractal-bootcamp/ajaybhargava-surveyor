import { Elysia, t } from "elysia";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { surveys, answers, subquestion } from './src/db/schema';
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
	return questions;
};

const addAnswers = async (answer: { subquestionId: string; answer: string }) => {
	console.log(answer);
	await db.insert(answers).values({
		id: randomUUID(),
		subquestionId: answer.subquestionId,
		answer: answer.answer.toString(),
	});
	console.log("Insertion successful.");
};

const addANewQuestion = async (question: { surveyId: string, question: string }) => {
	await db.insert(subquestion).values({
		id: randomUUID(),
		surveyId: question.surveyId,
		subquestion: question.question
	});
	console.log("Question added successfully.");
};

const deleteAQuestion = async (questionId: string) => {
	await db.delete(answers).where(eq(answers.subquestionId, questionId));
	await db.delete(subquestion).where(eq(subquestion.id, questionId));
	console.log("Question deleted successfully.");
};

const deleteASurvey = async (surveyId: string) => {
	await db.delete(answers).where(eq(answers.subquestionId, surveyId));
	await db.delete(subquestion).where(eq(subquestion.surveyId, surveyId));
	await db.delete(surveys).where(eq(surveys.id, surveyId));
	console.log("Survey deleted successfully.");
};

const getAnswers = async (subquestionId: string) => {
	const results = await db.select().from(answers).where(eq(answers.subquestionId, subquestionId));
	return results;
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
			addAnswers(body);
			return { success: true };
		},
		{
			body: t.Object({
				subquestionId: t.String(),
				answer: t.String(),
			}),
		},
	)
	.post(
		"/update_questions",
		({ body }) => {
			addANewQuestion(body);
			return { success: true};
		},
		{
			body: t.Object({
				surveyId: t.String(),
				question: t.String(),
			})
		}
	)
	.delete(
		"/delete_question",
		({ body }) => {
			deleteAQuestion(body.questionId);
			return { success: true };
		},
		{
			body: t.Object({
				questionId: t.String(),
			}),
		},
	)
	.delete(
		"/surveys/:id",
		({ params: { id } }) => {
			deleteASurvey(id);
			return { success: true };
		},
		{
			params: t.Object({
				id: t.String(),
			}),
		},
	)
	.get("/answers/:id", ({ params: { id } }) => getAnswers(id), {
		params: t.Object({
			id: t.String(),
		}),
	})
	.use(
		cors({
			origin: [
				"http://localhost:5173",
				"https://localhost:5173",
				...(process.env.RAILWAY_PUBLIC_DOMAIN ? [process.env.RAILWAY_PUBLIC_DOMAIN] : []),
				...(process.env.NETLIFY_DOMAIN ? [process.env.NETLIFY_DOMAIN] : [])
			],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.listen(process.env.PORT ?? 3000);
	// .listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
