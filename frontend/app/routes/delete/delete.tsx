// TODO: Add delete survey functionality
import { client } from "../../treaty";
import type { Route } from "../../+types/root";
import { redirect } from "react-router";

export async function action({ params }: Route.ActionArgs) {
	if (!params.id) {
		throw new Error("Survey ID is required");
	}

	const survey = await client.surveys({ id: params.id }).delete();

	if (survey.error) {
		throw new Error("Failed to delete survey");
	}

	if (survey.data) {
		console.log("Survey deleted successfully");
	}

	return redirect("/");
}

export default function Delete() {
	return null;
}
