import type { Route } from "../../+types/root";
import { useLoaderData, useParams } from "react-router";
import { treaty } from "@elysiajs/eden";
import { redirect, NavLink } from "react-router";
import type { App } from "../../../../src/server";

const client = treaty<App>("localhost:3000");

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.id) throw new Error("Survey ID is required");
	const response = await client.questions({ id: params.id }).get();
	if (!response.data) {
		throw new Error("Failed to load survey");
	}
	return response.data;
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const answers = Object.fromEntries(formData);
	if (!answers) {
		throw new Error("Answers must be provided.");
	}
	const response = await Promise.all(
		Object.entries(answers).map(([subquestionId, answer]) =>
			client.answers.post({
				subquestionId,
				answer: answer.toString(),
			}),
		),
	);
	if (!response.every((r) => r.data?.success)) {
		throw new Error("Failed to Create Survey!");
	}
}

export function meta() {
	return [
		{ title: "Run a survey" },
		{ name: "description", content: "Run a survey." },
	];
}

export default function New({ actionData }: Route.ComponentProps) {
	const data = useLoaderData<typeof loader>();
	const { id } = useParams<{ id: string }>();

	return (
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex-1 flex flex-col items-center gap-16 min-h-0">
				<h1 className="text-6xl">Survey Application</h1>
				<form
					method="post"
					className="flex flex-col gap-8 w-full max-w-[800px]"
				>
					{data.map((question) => (
						<div
							key={question.id}
							className="bg-gray-200 dark:bg-gray-500 rounded-2xl shadow-md p-6 text-2xl dark:text-black flex flex-col justify-between min-w-[600px]"
						>
							<label htmlFor={question.id} className="text-xl">
								{question.subquestion}
							</label>
							<input
								type="text"
								name={question.id}
								id={question.id}
								className="p-2 rounded-lg text-black text-xl bg-white"
								required
							/>
						</div>
					))}
					<button
						type="submit"
						className="bg-blue-500 text-white py-3 px-6 rounded-lg text-xl hover:bg-blue-600 transition-colors"
					>
						Submit Survey
					</button>
				</form>
			</div>
		</main>
	);
}
