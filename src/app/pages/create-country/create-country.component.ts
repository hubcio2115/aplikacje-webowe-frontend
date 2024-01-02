import { Location } from "@angular/common";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Component, HostBinding, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { provideIcons } from "@ng-icons/core";
import { radixChevronLeft } from "@ng-icons/radix-icons";
import {
	BrnDialogContentDirective,
	BrnDialogTriggerDirective,
} from "@spartan-ng/ui-dialog-brain";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom, of, switchMap } from "rxjs";

import {
	type CountryForm,
	CountryFormComponent,
} from "~/app/components/country-form/country-form.component";
import { CountryService } from "~/app/shared/services/country.service";
import { RulerService } from "~/app/shared/services/ruler.service";
import { Country } from "~/app/shared/types/Country.interface";
import { Ruler } from "~/app/shared/types/Ruler.interface";
import { HlmButtonDirective } from "~/ui/ui-button-helm/src";
import { HlmDialogModule } from "~/ui/ui-dialog-helm/src";
import { HlmIconModule } from "~/ui/ui-icon-helm/src";
import { HlmInputDirective } from "~/ui/ui-input-helm/src";
import { HlmLabelDirective } from "~/ui/ui-label-helm/src";

@Component({
	selector: "app-create-country",
	standalone: true,
	imports: [
		CountryFormComponent,
		HlmIconModule,
		RouterLink,

		BrnDialogTriggerDirective,
		BrnDialogContentDirective,
		HlmDialogModule,

		HlmLabelDirective,
		HlmInputDirective,
		HlmButtonDirective,
	],
	providers: [
		provideIcons({
			radixChevronLeft,
		}),
	],
	templateUrl: "./create-country.component.html",
})
export class CreateCountryComponent {
	@HostBinding("class") class =
		"flex flex-col w-full justify-center items-center flex-1";

	readonly router = inject(Router);
	readonly location = inject(Location);
	readonly #countryService = inject(CountryService);
	readonly #rulerService = inject(RulerService);
	readonly errorMessage = signal("");

	readonly createCountryMutation = injectMutation<
		Country,
		HttpErrorResponse,
		[Omit<Country, "id" | "rulerId">, Omit<Ruler, "id" | "countryId">]
	>(() => ({
		mutationKey: ["createCountry"],

		mutationFn: ([country, ruler]: [
			Omit<Country, "id">,
			Omit<Ruler, "id" | "countryId">,
		]) =>
			lastValueFrom(
				this.#countryService
					.add(country)
					.pipe(
						switchMap((country) =>
							this.#rulerService
								.add(country.id, ruler)
								.pipe(switchMap(() => of(country))),
						),
					),
			),

		onSuccess: (country) => {
			void this.router.navigate(["countries", country.id]);
		},

		onError: (err) => {
			switch (err.status) {
				case HttpStatusCode.Unauthorized.valueOf():
				case HttpStatusCode.Forbidden.valueOf():
					this.errorMessage.set("You are unauthorized to do this. >:(");
					break;
				default:
					this.errorMessage.set(err.message);
			}

			document.getElementById("errorTrigger")?.click();
		},
	}));

	onSubmit = (values: CountryForm["value"]) => {
		const { name, gdp, isInEurope, formationYear, ruler } = values as Required<
			CountryForm["value"]
		>;

		this.createCountryMutation().mutate([
			{
				name,
				gdp,
				isInEurope,
				formationYear:
					typeof formationYear === "number"
						? formationYear.toString()
						: formationYear,
			},
			ruler as Required<Omit<Ruler, "id" | "countryId">>,
		]);
	};
}
