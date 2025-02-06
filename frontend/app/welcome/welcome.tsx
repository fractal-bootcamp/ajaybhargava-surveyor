interface Data {
	text?: string;
}

export function Welcome({ text }: Data) {
	return (
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex-1 flex flex-col items-center gap-16 min-h-0">
				<h1>Hello</h1>
				<p>{text}</p>
			</div>
		</main>
	);
}
