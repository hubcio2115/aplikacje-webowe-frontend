import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

import { User } from "../types/User.interface";

type AuthState = {
	access_token: string | null;
	refresh_token: string | null;
	user: User | null;
	counter: number;
};

export const AuthStore = signalStore(
	{ providedIn: "root" },

	withState<AuthState>({
		access_token: null,
		refresh_token: null,
		user: null,
		counter: 0,
	}),

	withMethods((store) => ({
		login(user: User, access_token: string, refresh_token: string) {
			patchState(store, {
				user,
				refresh_token,
				access_token,
			});
		},

		logout() {
			patchState(store, {
				user: null,
				refresh_token: null,
				access_token: null,
			});
		},

		changeUser(newUser: Omit<User, "id">) {
			patchState(store, {
				user: { id: store.user()!.id, ...newUser },
			});
		},
	})),
);
