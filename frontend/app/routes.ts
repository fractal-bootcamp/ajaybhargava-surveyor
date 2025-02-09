import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";


export default [
    index("routes/home.tsx"),
    ...prefix("/surveys", [
        route(":id/run", "routes/run/run.tsx"),
        route("/new", "routes/new/new.tsx"),
        route(":id/update", "routes/update/update.tsx"),
        route(":id/delete", "routes/delete/delete.tsx"),
        route(":id/results", "routes/results/results.tsx"),
    ])
] satisfies RouteConfig;


