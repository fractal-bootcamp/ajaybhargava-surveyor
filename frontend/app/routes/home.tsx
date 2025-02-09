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
		{ title: "Ajay's Survey App" },
		{ name: "description", content: "Just a simple Survey V7 Router App!" },
	];
}

export default function Home({ actionData }: Route.ComponentProps) {
	const data = useLoaderData<typeof loader>();
	return <Surveys survey={data || []} />;
}
