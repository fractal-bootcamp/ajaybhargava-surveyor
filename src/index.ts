import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { surveys, subquestion, answers } from "./db/schema";
import { randomUUID } from "node:crypto";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const db = drizzle(process.env.DATABASE_URL);

async function main() {
	const surveyData: (typeof surveys.$inferInsert)[] = [
		{
			id: "0192ce07-8c4f-7d66-afec-2482b5c9b03c",
			question: "Thoughts about Donald Trump.",
		},
		{
			id: "0192ce07-8c4f-7d67-805f-0f71581b5622",
			question: "Programming Language Preferences"
		}
	];

	const subQuestionData: (typeof subquestion.$inferInsert)[] = [
		{
			id: "103eb2c4-4c1a-4686-a386-c594e01e6466",
			surveyId: "0192ce07-8c4f-7d66-afec-2482b5c9b03c",
			subquestion: "Is he an idiot?",
		},
		{
			id: "9165a75b-15c6-4415-bff7-59718663d617",
			surveyId: "0192ce07-8c4f-7d66-afec-2482b5c9b03c",
			subquestion: "What shade of orange do you think he is?"
		},
		{
			id: "7656b08b-d4a3-4406-8683-3a6c0a976c2b",
			surveyId: "0192ce07-8c4f-7d67-805f-0f71581b5622",
			subquestion: "What is your favorite language?"
		},
		{
			id: "79bc85e6-24da-4e9a-9cfb-54856b7acce0",
			surveyId: "0192ce07-8c4f-7d67-805f-0f71581b5622",
			subquestion: "Why is this your favorite language?"
		}
	]

	const answerData: (typeof answers.$inferInsert)[] = [
		{
			id: randomUUID(),
			surveyId: "103eb2c4-4c1a-4686-a386-c594e01e6466",
			answer: "Yes, absolutely!"
		},
		{
			id: randomUUID(),
			surveyId: "9165a75b-15c6-4415-bff7-59718663d617",
			answer: "Mandarin"
		},
		{
			id: randomUUID(),
			surveyId: "7656b08b-d4a3-4406-8683-3a6c0a976c2b",
			answer: "English"
		},
		{
			id: randomUUID(),
			surveyId: "79bc85e6-24da-4e9a-9cfb-54856b7acce0",
			answer: "Because I think its full of puns." 
		}
	]

	await db.insert(surveys).values(surveyData);
	await db.insert(subquestion).values(subQuestionData);
	await db.insert(answers).values(answerData);

	const seeded_users = await db.select().from(surveys);
	console.log("Database seeded successfully", seeded_users);

	const seeded_subquestions = await db.select().from(subquestion);
	console.log("Database seeded successfully", seeded_subquestions);

	const seeded_answers = await db.select().from(answers);
	console.log("Database seeded successfully", seeded_answers);
}

main();
