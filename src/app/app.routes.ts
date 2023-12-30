import { Routes } from "@angular/router";

import { AuthComponent } from "./pages/auth/auth.component";
import { CreateCountryComponent } from "./pages/create-country/create-country.component";
import { DetailsComponent } from "./pages/details/details.component";
import { HomeComponent } from "./pages/home/home.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { countryResolver } from "./shared/resolvers/country.resolver";
import { rulerResolver } from "./shared/resolvers/ruler.resolver";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "countries",
		pathMatch: "full",
	},
	{
		path: "auth",
		component: AuthComponent,
	},
	{
		path: "countries",
		component: HomeComponent,
	},
	{
		path: "countries/create",
		component: CreateCountryComponent,
	},
	{
		path: "countries/:id",
		resolve: {
			country: countryResolver,
			ruler: rulerResolver,
		},
		component: DetailsComponent,
	},
	{
		path: "**",
		component: PageNotFoundComponent,
	},
];
