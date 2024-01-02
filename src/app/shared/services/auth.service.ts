import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "~/environments/environment";

import { AuthStore } from "../store/AuthStore";
import { type User } from "../types/User.interface";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	readonly #httpClient = inject(HttpClient);
	readonly #authStore = inject(AuthStore);
	readonly #router = inject(Router);

	initialUser = localStorage.getItem("user");
	initialAccessToken = localStorage.getItem("access_token");
	initialRefreshToken = localStorage.getItem("refresh_token");

	constructor() {
		if (this.initialUser && this.initialAccessToken && this.initialRefreshToken)
			this.#authStore.login(
				JSON.parse(this.initialUser) as User,
				this.initialAccessToken,
				this.initialRefreshToken,
			);
	}

	getAuthStore() {
		return this.#authStore;
	}

	changeUser(newUser: Omit<User, "id">) {
		this.#authStore.changeUser(newUser);

		localStorage.setItem("user", JSON.stringify(this.#authStore.user()));
	}

	changeUserDetails(
		firstName: User["firstName"],
		lastName: User["lastName"],
		email: User["email"],
	) {
		return this.#httpClient.patch(
			`${environment.apiUrl}/api/users/details`,
			{
				firstName,
				lastName,
				email,
			},
			{
				headers: {
					Authorization: `Bearer ${this.#authStore.access_token()}`,
				},
			},
		);
	}

	changePassword(password: string, confirmPassword: string) {
		return this.#httpClient.patch(
			`${environment.apiUrl}/api/users/password`,
			{
				newPassword: password,
				confirmationPassword: confirmPassword,
			},
			{
				headers: {
					Authorization: `Bearer ${this.#authStore.access_token()}`,
				},
			},
		);
	}

	login(email: string, password: string) {
		return this.#httpClient
			.post<{
				user: User;
				refresh_token: string;
				access_token: string;
			}>(`${environment.apiUrl}/api/auth/authenticate`, {
				email,
				password,
			})
			.subscribe(({ user, access_token, refresh_token }) => {
				this.#authStore.login(user, access_token, refresh_token);

				localStorage.setItem("user", JSON.stringify(user));
				localStorage.setItem("access_token", access_token);
				localStorage.setItem("refresh_token", refresh_token);

				void this.#router.navigate(["/"]);
			});
	}

	register(
		firstName: User["firstName"],
		lastName: User["lastName"],
		email: User["email"],
		password: string,
	) {
		return this.#httpClient
			.post<{
				user: User;
				refresh_token: string;
				access_token: string;
			}>(`${environment.apiUrl}/api/auth/register`, {
				firstName,
				lastName,
				email,
				password,
			})
			.subscribe(({ user, access_token, refresh_token }) => {
				this.#authStore.login(user, access_token, refresh_token);

				localStorage.setItem("user", JSON.stringify(user));
				localStorage.setItem("access_token", access_token);
				localStorage.setItem("refresh_token", refresh_token);

				void this.#router.navigate(["/"]);
			});
	}

	logout() {
		return this.#httpClient
			.post(`${environment.apiUrl}/api/auth/logout`, null)
			.subscribe(() => {
				this.#authStore.logout();

				localStorage.removeItem("user");
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");

				void this.#router.navigate(["/"]);
			});
	}
}
