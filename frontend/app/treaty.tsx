import { treaty } from "@elysiajs/eden";
import type { App } from "../../index";

export const client = treaty<App>(
	process.env.RAILWAY_PUBLIC_DOMAIN ?? "localhost:3000",
);
