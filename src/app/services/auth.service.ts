import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import type {
	CurrentUser,
	LoginRequest,
	RegisterRequest,
} from "~/app/auth/store/auth.store";
import { environment } from "~/environments/environment";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	#http = inject(HttpClient);

	login(data: LoginRequest): Observable<CurrentUser> {
		return this.#http.post<CurrentUser>(
			`${environment.apiUrl}/api/authenticate`,
			data,
		);
	}

	register(data: RegisterRequest): Observable<CurrentUser> {
		return this.#http.post<CurrentUser>(
			`${environment.apiUrl}/api/register`,
			data,
		);
	}
}
