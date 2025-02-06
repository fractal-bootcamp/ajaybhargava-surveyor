import { integer, pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const surveys = pgTable("surveys", {
	id: integer("id").primaryKey(),
    question: varchar("question", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const answers = pgTable("answers", {
    id: integer("id").primaryKey(),
    surveyId: integer("survey_id").references(() => surveys.id),
    answer: text(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

