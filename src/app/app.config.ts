import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig, isDevMode } from "@angular/core";
import { provideClientHydration } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";

import { loginEffect, registerEffect } from "~/app/auth/store/auth.store";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideClientHydration(),
		provideStore(),
		provideEffects({ registerEffect, loginEffect }),
		provideHttpClient(withFetch()),
		provideStoreDevtools({
			maxAge: 25,
			logOnly: !isDevMode(),
			autoPause: true,
			trace: false,
			traceLimit: 75,
		}),
	],
};
