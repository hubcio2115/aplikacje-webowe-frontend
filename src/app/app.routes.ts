import { Routes } from "@angular/router";

import { AuthComponent } from "./pages/auth/auth.component";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: "auth?tab=login",
	},
	{
		path: "auth",
		component: AuthComponent,
	},
];
