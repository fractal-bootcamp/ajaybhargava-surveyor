import type { Route } from "../+types/root";
import { client } from "../treaty";
import { useLoaderData } from "react-router";
import { Surveys } from "~/home/AllSurveys";

export async function loader() {
	const { data } = await client.surveys.get();
	return data;
}

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home({ actionData }: Route.ComponentProps) {
	const data = useLoaderData<typeof loader>();
	return <Surveys survey={data || []} />;
}
