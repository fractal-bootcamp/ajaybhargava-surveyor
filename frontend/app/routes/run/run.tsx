import type { Route } from "../../+types/root";
import { useLoaderData, useParams, redirect, NavLink } from "react-router";
import { client } from "../../treaty";

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
	return redirect("/");
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
		<main className="container mx-auto px-4 py-8 md:py-16">
			<div className="flex flex-col items-center gap-8 md:gap-16">
				<h1 className="text-3xl md:text-5xl lg:text-6xl text-center text-gray-900 dark:text-white">
					Take Survey
				</h1>

				<form method="post" className="w-full max-w-2xl space-y-6">
					{data.map((question) => (
						<div
							key={question.id}
							className="bg-gray-100 dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-md p-4 md:p-6"
						>
							<label
								htmlFor={question.id}
								className="block text-lg md:text-xl mb-3 font-medium text-gray-900 dark:text-white"
							>
								{question.subquestion}
							</label>
							<input
								type="text"
								name={question.id}
								id={question.id}
								className="w-full p-3 rounded-lg text-gray-900 text-base md:text-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
								required
								placeholder="Type your answer here..."
							/>
						</div>
					))}

					<div className="flex flex-col sm:flex-row gap-4 pt-4">
						<button
							type="submit"
							className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-base md:text-lg font-medium transition-colors"
						>
							Submit Survey
						</button>

						<NavLink
							to={"/"}
							className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-base md:text-lg font-medium text-center transition-colors"
						>
							Cancel
						</NavLink>
					</div>
				</form>
			</div>
		</main>
	);
}
