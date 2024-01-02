import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { environment } from "~/environments/environment";

import { AuthStore } from "../store/AuthStore";
import { type Ruler } from "../types/Ruler.interface";

@Injectable({
	providedIn: "root",
})
export class RulerService {
	readonly #httpClient = inject(HttpClient);
	readonly #authStore = inject(AuthStore);

	getByCountryId(countrId: number) {
		return this.#httpClient.get<Ruler | null>(
			`${environment.apiUrl}/api/rulers/${countrId}`,
		);
	}

	add(countrId: number, ruler: Omit<Ruler, "id" | "countryId">) {
		console.log(this.#authStore.access_token());

		return this.#httpClient.post<Ruler>(
			`${environment.apiUrl}/api/rulers/${countrId}`,
			ruler,

			{
				headers: {
					Authorization: `Bearer ${this.#authStore.access_token()}`,
				},
			},
		);
	}

	put(rulerId: number, ruler: Omit<Ruler, "id" | "countryId">) {
		return this.#httpClient.put<Ruler>(
			`${environment.apiUrl}/api/rulers/${rulerId}`,
			ruler,
			{
				headers: {
					Authorization: `Bearer ${this.#authStore.access_token()}`,
				},
			},
		);
	}
}
