import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
	createActionGroup,
	createFeature,
	createReducer,
	emptyProps,
	on,
	props,
} from "@ngrx/store";
import { catchError, map, of, switchMap } from "rxjs";

import { AuthService } from "~/app/services/auth.service";

export type CurrentUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	acessToken: string;
};

export type RegisterRequest = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type LoginRequest = Pick<RegisterRequest, "email" | "password">;

export const authAcitons = createActionGroup({
	source: "auth",
	events: {
		Register: props<{ request: RegisterRequest }>(),
		"Register success": props<{ currentUser: CurrentUser }>(),
		"Register failure": emptyProps(),
		Login: props<{ request: LoginRequest }>(),
		"Login success": props<{ currentUser: CurrentUser }>(),
		"Login failure": emptyProps(),
	},
});

export const registerEffect = createEffect(
	(actions$ = inject(Actions), authService = inject(AuthService)) => {
		return actions$.pipe(
			ofType(authAcitons.register),
			switchMap(({ request }) => {
				return authService.register(request).pipe(
					map((currentUser: CurrentUser) => {
						return authAcitons.registerSuccess({ currentUser });
					}),
					catchError(() => {
						return of(authAcitons.registerFailure());
					}),
				);
			}),
		);
	},
	{ functional: true },
);

export const loginEffect = createEffect(
	(actions$ = inject(Actions), authService = inject(AuthService)) => {
		return actions$.pipe(
			ofType(authAcitons.login),
			switchMap(({ request }) => {
				return authService.login(request).pipe(
					map((currentUser: CurrentUser) => {
						return authAcitons.registerSuccess({ currentUser });
					}),
					catchError(() => {
						return of(authAcitons.registerFailure());
					}),
				);
			}),
		);
	},
	{ functional: true },
);

export type AuthState = {
	isSubmitting: boolean;
};

const authFeature = createFeature({
	name: "auth",
	reducer: createReducer<AuthState>(
		{ isSubmitting: false },
		on(authAcitons.login, (state) => ({ ...state, isSubmitting: true })),
		on(authAcitons.register, (state) => ({ ...state, isSubmitting: true })),
	),
});

export const {
	name: authFeatureKey,
	reducer: authReducer,
	selectIsSubmitting,
} = authFeature;
