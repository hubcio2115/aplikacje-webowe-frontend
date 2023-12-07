import { Routes } from "@angular/router";

import { AuthComponent } from "./pages/login/auth.component";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: "auth",
	},
	{
		path: "auth",
		component: AuthComponent,
	},
];
