import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { catchError, of } from "rxjs";

import { CountryService } from "../services/country.service";
import { Country } from "../types/Country.interface";

export const countryResolver: ResolveFn<Country | null> = (route) => {
	const router = inject(Router);
	const countryService = inject(CountryService);
	const id = route.paramMap.get("id");

	return countryService.getById(parseInt(id ?? "-1")).pipe(
		catchError((err: HttpErrorResponse) => {
			if (err.status === HttpStatusCode.NotFound.valueOf()) {
				void router.navigate(["404"]);
				return of(null);
			}

			console.error(err);
			return of(null);
		}),
	);
};
