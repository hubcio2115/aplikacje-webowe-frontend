import { inject } from "@angular/core";
import { type CanActivateFn, Router } from "@angular/router";

export const isAuthedGuard: CanActivateFn = () => {
	const user = localStorage.getItem("user");
	const router = inject(Router);

	if (user === null) {
		void router.navigate(["/"]);
		return false;
	}

	return true;
};
