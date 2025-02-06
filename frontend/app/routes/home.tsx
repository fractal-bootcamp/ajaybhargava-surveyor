import type { Route } from "../+types/root";
import { treaty } from "@elysiajs/eden";
import type { App } from "../../../src/server";
import { useLoaderData } from "react-router";
const client = treaty<App>("localhost:3000");

export async function loader() {
	const { data } = await client.surveys.get();
	return { data1: data, data2: "more data" };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
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
	const { data1, data2 } = useLoaderData<typeof loader>();

	return (
		<div>
			{JSON.stringify(data1)}, {data2}
		</div>
	);
}
