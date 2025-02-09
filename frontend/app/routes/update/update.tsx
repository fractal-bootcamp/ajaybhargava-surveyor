import { useLoaderData, useParams, redirect, NavLink } from "react-router";
import { client } from "../../treaty";
import type { Route } from "../../+types/root";

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.id) throw new Error("Survey ID is required.");
	const response = await client.questions({ id: params.id }).get();
	if (!response.data) {
		throw new Error("Failed to load survey!");
	}
	// If empty, return array with just the surveyId object
	return response.data.length === 0
		? [{ surveyId: params.id, id: null, subquestion: null }]
		: response.data;
}

export async function action({ request }: Route.ActionArgs) {
	const FormData = await request.formData();
	const FormDataQuestion = Object.fromEntries(FormData);
	const intent = FormData.get("intent");

	// When the form intent is to add a question
	if (intent === "add") {
		// When there's a new question being added
		const response = await Promise.all(
			Object.entries(FormDataQuestion)
				.filter(([key]) => key !== "intent")
				.map(([surveyId, question]) =>
					client.update_questions.post({
						surveyId,
						question: question.toString(),
					}),
				),
		);
	}

	// When there's a delete request being made.
	if (intent === "delete") {
		const questionId = FormData.get("questionId");
		const response = await client.delete_question.delete({
			questionId: questionId?.toString() ?? "",
		});
		if (response.error) {
			console.error(response.error);
		}
		if (response.data) {
			console.log("Question deleted successfully.");
		}
	}
}

export function meta() {
	return [
		{ title: "Update Survey Questions" },
		{ name: "description", content: "Update Survey Questions." },
	];
}

export default function Update({ actionData }: Route.ComponentProps) {
	const data = useLoaderData<typeof loader>();
	const surveyId = data[0].surveyId;

	return (
		<main className="container mx-auto px-4 py-8 md:py-16">
			<div className="flex flex-col items-center gap-8 md:gap-16">
				<h1 className="text-3xl md:text-5xl lg:text-6xl text-center text-gray-900 dark:text-white">
					Update Survey
				</h1>

				<div className="w-full max-w-2xl space-y-6">
					{data[0].subquestion !== null &&
						data.map((question) => (
							<div
								key={question.id}
								className="bg-gray-100 dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-md p-4 md:p-6"
							>
								<div className="text-lg md:text-xl mb-4 text-gray-900 dark:text-white">
									{question.subquestion}
								</div>
								<form method="post" className="flex justify-end">
									<input type="hidden" name="intent" value="delete" />
									<input
										type="hidden"
										name="questionId"
										value={question.id?.toString()}
									/>
									<button
										type="submit"
										className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-base md:text-lg font-medium transition-colors"
									>
										Delete
									</button>
								</form>
							</div>
						))}

					<div className="bg-gray-100 dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-md p-4 md:p-6">
						<form method="post" className="space-y-4">
							<input type="hidden" name="intent" value="add" />
							<div className="space-y-2">
								<label
									htmlFor="AddQuestion"
									className="block text-lg md:text-xl font-medium text-gray-900 dark:text-white"
								>
									Add a Question
								</label>
								<input
									type="text"
									name={surveyId?.toString()}
									id={surveyId?.toString()}
									className="w-full p-3 rounded-lg text-gray-900 text-base md:text-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
									required
									placeholder="Type your question here..."
								/>
							</div>
							<div className="pt-2">
								<button
									type="submit"
									className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-base md:text-lg font-medium transition-colors"
								>
									Add Question
								</button>
							</div>
						</form>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-4">
					<NavLink
						to={"/"}
						className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-base md:text-lg font-medium text-center transition-colors"
					>
						Back to Surveys
					</NavLink>
				</div>
			</div>
		</main>
	);
}
