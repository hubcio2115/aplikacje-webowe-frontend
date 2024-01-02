import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { environment } from "~/environments/environment";

import { AuthStore } from "../store/AuthStore";
import { type Country } from "../types/Country.interface";

@Injectable({
	providedIn: "root",
})
export class CountryService {
	readonly #httpClient = inject(HttpClient);
	readonly #authStore = inject(AuthStore);

	getAll() {
		return this.#httpClient.get<Country[]>(
			`${environment.apiUrl}/api/countries`,
		);
	}

	getById(id: number) {
		return this.#httpClient.get<Country>(
			`${environment.apiUrl}/api/countries/${id}`,
		);
	}

	add(country: Omit<Country, "id">) {
		return this.#httpClient.post<Country>(
			`${environment.apiUrl}/api/countries`,
			country,
			{
				headers: {
					Authorization: `Bearer ${this.#authStore.access_token()}`,
				},
			},
		);
	}

	delete(countryId: number) {
		console.log(this.#authStore.access_token());

		return this.#httpClient.delete<Country>(
			`${environment.apiUrl}/api/countries/${countryId}`,
			{
				headers: {
					Authorization: `Bearer ${this.#authStore.access_token()}`,
				},
			},
		);
	}

	put(countryId: number, country: Omit<Country, "id" | "rulerId">) {
		return this.#httpClient.put<Country>(
			`${environment.apiUrl}/api/countries/${countryId}`,
			country,
			{
				headers: {
					Authorization: `Bearer ${this.#authStore.access_token()}`,
				},
			},
		);
	}
}
