type Survey = {
	id: number;
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
				<h1 className="text-6xl">Hello</h1>
				{survey.map((item) => (
					<div key={item.id}>
						<p>{item.id}</p>
						<p>{item.question}</p>
					</div>
				))}
			</div>
		</main>
	);
}
