import { client } from "~/treaty";
import type { Route } from "../../+types/root";
import { useLoaderData, NavLink } from "react-router";

export function meta() {
	return [
		{
			title: "Results",
		},
	];
}

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.id) throw new Error("Survey ID is required");
	const response = await client.questions({ id: params.id }).get();
	if (!response.data) {
		throw new Error("Failed to load survey");
	}

	const questions = response.data;
	const result: Record<string, string[]> = {};

	await Promise.all(
		questions.map(async (question) => {
			const answersResponse = await client.answers({ id: question.id }).get();
			if (!answersResponse.data) {
				throw new Error("Failed to load survey results");
			}
			if (!question.subquestion)
				throw new Error("Subquestion text is required");
			result[question.subquestion] = answersResponse.data
				.map((a) => a.answer)
				.filter((a): a is string => a !== null);
		}),
	);

	return result;
}

export default function Results({ actionData }: Route.ComponentProps) {
	const data = useLoaderData<typeof loader>();

	return (
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex-1 flex flex-col items-center gap-16 min-h-0">
				<h1 className="text-6xl">Survey Results</h1>

				{/* Existing answers section */}
				{Object.entries(data).map(([question, answers]) => (
					<div
						key={question}
						className="bg-gray-200 dark:bg-gray-500 rounded-2xl shadow-md p-6 text-2xl dark:text-black flex flex-col gap-4 w-full max-w-[800px]"
					>
						<h2 className="font-semibold">{question}</h2>
						<div className="flex flex-col gap-2">
							{answers.length > 0 ? (
								answers.map((answer) => (
									<div
										key={`${question}-${answer}`}
										className="bg-white rounded-lg p-3 text-xl text-black"
									>
										{answer}
									</div>
								))
							) : (
								<p className="text-gray-600 dark:text-gray-300 italic">
									No answers yet
								</p>
							)}
						</div>
					</div>
				))}

				<NavLink
					to="/"
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xl min-w-[140px] text-center transition-colors"
				>
					Return to Surveys
				</NavLink>
			</div>
		</main>
	);
}
