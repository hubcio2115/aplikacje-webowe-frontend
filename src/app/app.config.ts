import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import {
	QueryClient,
	provideAngularQuery,
} from "@tanstack/angular-query-experimental";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [provideRouter(routes), provideAngularQuery(new QueryClient())],
};
