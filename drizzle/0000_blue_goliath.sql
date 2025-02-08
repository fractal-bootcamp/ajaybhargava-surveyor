CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"subquestion_id" uuid,
	"answer" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subquestion" (
	"id" uuid PRIMARY KEY NOT NULL,
	"survey_id" uuid,
	"subquestion" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "surveys" (
	"id" uuid PRIMARY KEY NOT NULL,
	"question" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_subquestion_id_subquestion_id_fk" FOREIGN KEY ("subquestion_id") REFERENCES "public"."subquestion"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subquestion" ADD CONSTRAINT "subquestion_survey_id_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."surveys"("id") ON DELETE no action ON UPDATE no action;