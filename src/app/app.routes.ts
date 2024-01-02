import { Routes } from "@angular/router";

import { NavbarComponent } from "./layouts/navbar/navbar.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { CreateCountryComponent } from "./pages/create-country/create-country.component";
import { DetailsComponent } from "./pages/details/details.component";
import { HomeComponent } from "./pages/home/home.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { UserDetailsComponent } from "./pages/user-details/user-details.component";
import { isAuthedGuard } from "./shared/guards/is-authed.guard";
import { isNotAuthedGuard } from "./shared/guards/is-not-authed.guards";
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
		canActivate: [isNotAuthedGuard],
	},
	{
		path: "countries",
		component: NavbarComponent,
		children: [
			{
				path: "",
				component: HomeComponent,
			},
			{
				path: "create",
				component: CreateCountryComponent,
				canActivate: [isAuthedGuard],
			},
			{
				path: ":id",
				resolve: {
					country: countryResolver,
					ruler: rulerResolver,
				},
				component: DetailsComponent,
			},
		],
	},
	{
		path: "user-details",
		component: UserDetailsComponent,
	},
	{
		path: "**",
		component: PageNotFoundComponent,
	},
];
