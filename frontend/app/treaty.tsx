import { treaty } from "@elysiajs/eden";
import type { App } from "../../index";

export const client = treaty<App>(
	process.env.VITE_RAILWAY_PUBLIC_URL ?? "localhost:3000",
);
