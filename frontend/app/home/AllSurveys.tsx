import { NavLink } from "react-router";

type Survey = {
	id: string;
	question: string;
	createdAt: Date;
	updatedAt: Date;
};

export interface SurveyProps {
	survey: Survey[];
}

export function Surveys({ survey }: SurveyProps) {
	return (
		<main className="container mx-auto px-4 py-8 md:py-16">
			<div className="flex flex-col items-center gap-8 md:gap-16">
				<h1 className="text-3xl md:text-5xl lg:text-6xl text-center text-gray-900 dark:text-white">
					Survey Application
				</h1>

				<div className="w-full max-w-4xl space-y-6">
					{survey.map((item) => (
						<div
							key={item.id}
							className="bg-gray-100 dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-md p-4 md:p-6"
						>
							<p className="mb-6 text-gray-900 dark:text-white">
								{item.question}
							</p>
							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap justify-center">
								<NavLink
									to={`/surveys/${item.id}/run`}
									className={({ isActive }) =>
										`${isActive ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded-lg text-base md:text-lg w-full sm:w-auto text-center transition-colors`
									}
								>
									Run Survey
								</NavLink>
								<NavLink
									to={`/surveys/${item.id}/results`}
									className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-base md:text-lg w-full sm:w-auto text-center transition-colors"
								>
									See Results
								</NavLink>
								<NavLink
									to={`/surveys/${item.id}/update`}
									className={({ isActive }) =>
										`${isActive ? "bg-orange-600" : "bg-orange-500 hover:bg-orange-600"} text-white px-4 py-2 rounded-lg text-base md:text-lg w-full sm:w-auto text-center transition-colors`
									}
								>
									Update
								</NavLink>
								<form
									method="post"
									action={`/surveys/${item.id}/delete`}
									className="w-full sm:w-auto"
								>
									<input type="hidden" name="intent" value="delete" />
									<input type="hidden" name="surveyId" value={item.id} />
									<button
										type="submit"
										className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-base md:text-lg w-full transition-colors"
									>
										Delete
									</button>
								</form>
							</div>
						</div>
					))}
				</div>

				<NavLink
					to={"/surveys/new"}
					className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg md:text-xl text-center transition-colors fixed bottom-6 right-6 shadow-lg"
				>
					+ New Survey
				</NavLink>
			</div>
		</main>
	);
}
