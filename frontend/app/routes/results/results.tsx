import { client } from "~/treaty";
import type { Route } from "../../+types/root";
import { useLoaderData } from "react-router";

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
		<div>
			<h1>Results</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
