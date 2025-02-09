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
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex-1 flex flex-col items-center gap-16 min-h-0">
				<h1 className="text-6xl">Survey Application</h1>
				{survey.map((item) => (
					<div
						className="bg-gray-200 dark:bg-gray-500 rounded-2xl shadow-md p-6 text-2xl dark:text-black flex flex-col justify-between"
						key={item.id}
					>
						<p className="flex-grow">{item.question}</p>
						<div className="flex justify-center gap-4 mt-4">
							<NavLink
								to={`/surveys/${item.id}/run`}
								className={({ isActive }) =>
									`${isActive ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded-xl text-xl min-w-[140px] text-center`
								}
							>
								Run Survey
							</NavLink>
							<NavLink
								to={`/surveys/${item.id}/results`}
								className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xl min-w-[140px] text-center"
							>
								See Results
							</NavLink>
							<NavLink
								to={`/surveys/${item.id}/update`}
								className={({ isActive }) =>
									`${isActive ? "bg-orange-600" : "bg-orange-500 hover:bg-orange-600"} text-white px-4 py-2 rounded-xl text-xl min-w-[140px] text-center`
								}
							>
								Update Questions
							</NavLink>
							{/* TODO: Add delete survey functionality */}
							{/* <form
								method="post"
								action="/surveys/delete"
								className="flex justify-center"
							>
								<input type="hidden" name="intent" value="delete" />
								<input type="hidden" name="surveyId" value={item.id} />
								<button
									type="submit"
									className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xl min-w-[140px] text-center appearance-none"
								>
									Delete Survey
								</button>
							</form> */}
						</div>
					</div>
				))}
				<NavLink
					to={"/surveys/new"}
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xl min-w-[140px] text-center"
				>
					Create a new Survey
				</NavLink>
			</div>
		</main>
	);
}
