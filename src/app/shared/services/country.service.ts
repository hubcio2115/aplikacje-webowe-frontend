import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { environment } from "~/environments/environment";

import { Country } from "../types/Country.interface";

@Injectable({
	providedIn: "root",
})
export class CountryService {
	readonly #httpClient = inject(HttpClient);

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
		);
	}

	delete(countryId: number) {
		return this.#httpClient.delete<Country>(
			`${environment.apiUrl}/api/countries/${countryId}`,
		);
	}

	put(countryId: number, country: Omit<Country, "id" | "rulerId">) {
		return this.#httpClient.put<Country>(
			`${environment.apiUrl}/api/countries/${countryId}`,
			country,
		);
	}
}
