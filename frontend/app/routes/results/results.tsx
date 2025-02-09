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
	if (!params.id) {
		throw new Error("Missing required id parameter");
	}
	const results = await client.answers({ id: params.id }).get();
	if (!results.data) {
		throw new Error("Failed to load survey results");
	}
	return results.data;
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
