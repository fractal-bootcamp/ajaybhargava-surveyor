import type { Route } from "../../+types/root";
import type { App } from "../../../../src/server";
import { treaty } from "@elysiajs/eden";
import { randomUUID } from "node:crypto";
import { redirect, NavLink } from "react-router";

const client = treaty<App>(
	process.env.RAILWAY_PUBLIC_DOMAIN ?? "localhost:3000",
);

export function meta() {
	return [
		{ title: "Create New Survey" },
		{ name: "description", content: "Create a new survey" },
	];
}

export async function action({ request }: Route.ActionArgs) {
	const NewSurvey = await request.formData();
	const NewQuestion = NewSurvey.get("Question");

	if (typeof NewQuestion !== "string") {
		throw new Error("Question must be provided");
	}

	const response = client.surveys.post({
		id: randomUUID(),
		question: NewQuestion,
	});

	if (!(await response).data?.success) {
		throw new Error("Failed to Create Survey!");
	}

	redirect("/");
}

export default function New({ actionData }: Route.ComponentProps) {
	return (
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex-1 flex flex-col items-center gap-16 min-h-0">
				<h1 className="text-6xl">Survey Application</h1>
				<div className="bg-gray-200 dark:bg-gray-500 rounded-2xl shadow-md p-6 text-2xl dark:text-black flex flex-col justify-between min-w[600px]">
					<form method="post" className="flex flex-col gap-4 min-w-[600px]">
						<label htmlFor="Question" className="text-xl">
							Enter a Survey Title
						</label>
						<input
							type="text"
							name="Question"
							id="Question"
							className="p-2 rounded-lg text-black text-xl bg-white"
							required
						/>
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xl"
						>
							Create Survey
						</button>
					</form>
				</div>
				<NavLink
					to={"/"}
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xl min-w-[140px] text-center"
				>
					Return to Forms
				</NavLink>
			</div>
		</main>
	);
}
