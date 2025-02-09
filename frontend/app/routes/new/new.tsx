import type { Route } from "../../+types/root";
import { randomUUID } from "node:crypto";
import { redirect, NavLink } from "react-router";
import { client } from "../../treaty";

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

	return redirect("/");
}

export default function New({ actionData }: Route.ComponentProps) {
	return (
		<main className="container mx-auto px-4 py-8 md:py-16">
			<div className="flex flex-col items-center gap-8 md:gap-16">
				<h1 className="text-3xl md:text-5xl lg:text-6xl text-center">
					Create New Survey
				</h1>

				<div className="w-full max-w-2xl bg-gray-200 dark:bg-gray-500 rounded-lg md:rounded-2xl shadow-md p-4 md:p-6 dark:text-black">
					<form method="post" className="flex flex-col gap-6">
						<div className="space-y-2">
							<label
								htmlFor="Question"
								className="text-lg md:text-xl font-medium block"
							>
								Enter a Survey Title
							</label>
							<input
								type="text"
								name="Question"
								id="Question"
								className="w-full p-3 rounded-lg text-black text-base md:text-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
								required
								placeholder="Type your survey question here..."
							/>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<button
								type="submit"
								className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-base md:text-lg font-medium transition-colors"
							>
								Create Survey
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
			</div>
		</main>
	);
}
