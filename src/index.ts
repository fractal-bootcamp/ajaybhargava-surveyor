import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { surveys, answers } from "./db/schema";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const db = drizzle(process.env.DATABASE_URL);

async function main() {
	const surveyData: typeof surveys.$inferInsert = {
		id: 1,
		question: "How satisfied are you with our service?",
	};

	const answerData: typeof answers.$inferInsert = {
		id: 1,
		surveyId: 1,
		answer: "Very Satisfied",
	};

	await db.insert(surveys).values(surveyData);
	await db.insert(answers).values(answerData);

	const seeded_users = await db.select().from(surveys);
	console.log("Database seeded successfully", seeded_users);

	const seeded_answers = await db.select().from(answers);
	console.log("Database seeded successfully", seeded_answers);
}

main();
