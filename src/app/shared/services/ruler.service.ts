import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { environment } from "~/environments/environment";

import { Ruler } from "../types/Ruler.interface";

@Injectable({
	providedIn: "root",
})
export class RulerService {
	readonly #httpClient = inject(HttpClient);

	getByCountryId(countrId: number) {
		return this.#httpClient.get<Ruler | null>(
			`${environment.apiUrl}/api/rulers/${countrId}`,
		);
	}

	add(countrId: number, ruler: Omit<Ruler, "id" | "countryId">) {
		return this.#httpClient.post<Ruler>(
			`${environment.apiUrl}/api/rulers/${countrId}`,
			ruler,
		);
	}

	put(rulerId: number, ruler: Omit<Ruler, "id" | "countryId">) {
		return this.#httpClient.put<Ruler>(
			`${environment.apiUrl}/api/rulers/${rulerId}`,
			ruler,
		);
	}
}
