import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { catchError, of } from "rxjs";

import { RulerService } from "../services/ruler.service";
import { Ruler } from "../types/Ruler.interface";

export const rulerResolver: ResolveFn<Ruler | null> = (route) => {
	const rulerService = inject(RulerService);
	const id = route.paramMap.get("id");

	return rulerService.getByCountryId(parseInt(id ?? "-1")).pipe(
		catchError((err: HttpErrorResponse) => {
			if (err.status === HttpStatusCode.NotFound.valueOf()) return of(null);

			console.error(err);
			return of(null);
		}),
	);
};
