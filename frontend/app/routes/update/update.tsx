import { useLoaderData, useParams, redirect, NavLink } from "react-router";
import { client } from "../../treaty";
import type { Route } from "../../+types/root";
import { X } from "lucide-react";

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
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex-1 flex flex-col items-center gap-16 min-h-0">
				<h1 className="text-6xl">Survey Application</h1>
				{data[0].subquestion !== null &&
					data.map((question) => (
						<div
							key={question.id}
							className="bg-gray-200 dark:bg-gray-500 rounded-2xl shadow-md p-6 text-2xl dark:text-black flex flex-col justify-between min-w-[600px]"
						>
							<div>{question.subquestion}</div>
							<form method="post" className="flex justify-end gap-4 mt-4">
								<input type="hidden" name="intent" value="delete" />
								<input
									type="hidden"
									name="questionId"
									value={question.id?.toString()}
								/>
								<button
									type="submit"
									className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-xl appearance-none"
								>
									Delete Question
								</button>
							</form>
						</div>
					))}
				<div className="bg-gray-200 dark:bg-gray-500 rounded-2xl shadow-md p-6 text-2xl dark:text-black flex flex-col justify-between">
					<form method="post" className="flex flex-col gap-4 min-w-[550px]">
						<input type="hidden" name="intent" value="add" />
						<label htmlFor="AddQuestion" className="text-xl">
							Add a Question
						</label>
						<input
							type="text"
							name={surveyId?.toString()}
							id={surveyId?.toString()}
							className="p-2 rounded-lg text-black text-xl bg-white"
							required
						/>
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xl"
						>
							Add Question
						</button>
					</form>
				</div>
				<NavLink
					to={"/"}
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-4 rounded-xl text-xl min-w-[140px] text-center mb-10"
				>
					Return to Forms
				</NavLink>
			</div>
		</main>
	);
}
