import { integer, pgTable, varchar, timestamp, text, uuid } from "drizzle-orm/pg-core";

export const surveys = pgTable("surveys", {
	id: uuid("id").primaryKey(),
    question: varchar("question", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subquestion = pgTable("subquestion", {
    id: uuid("id").primaryKey(),
    surveyId: uuid("survey_id").references(() => surveys.id),
    subquestion: text(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const answers = pgTable("answers", {
    id: uuid("id").primaryKey(),
    subquestionId: uuid("subquestion_id").references(() => subquestion.id),
    answer: text(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})