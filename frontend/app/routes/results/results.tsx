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
		<main className="container mx-auto px-4 py-8 md:py-16">
			<div className="flex flex-col items-center gap-8 md:gap-16">
				<h1 className="text-3xl md:text-5xl lg:text-6xl text-center text-gray-900 dark:text-white">
					Survey Results
				</h1>

				<div className="w-full max-w-2xl space-y-6">
					{Object.entries(data).map(([question, answers]) => (
						<div
							key={question}
							className="bg-gray-100 dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-md p-4 md:p-6"
						>
							<h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
								{question}
							</h2>
							<div className="space-y-3">
								{answers.length > 0 ? (
									answers.map((answer) => (
										<div
											key={`${question}-${answer}`}
											className="bg-white dark:bg-gray-700 rounded-lg p-3 text-base md:text-lg text-gray-900 dark:text-white"
										>
											{answer}
										</div>
									))
								) : (
									<p className="text-gray-600 dark:text-gray-400 italic text-base md:text-lg">
										No answers yet
									</p>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="flex flex-col sm:flex-row gap-4">
					<NavLink
						to="/"
						className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-base md:text-lg font-medium text-center transition-colors"
					>
						Back to Surveys
					</NavLink>
				</div>
			</div>
		</main>
	);
}
