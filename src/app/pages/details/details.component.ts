import { HttpErrorResponse } from "@angular/common/http";
import { Component, HostBinding, inject } from "@angular/core";
import "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { bootstrapArrowClockwise } from "@ng-icons/bootstrap-icons";
import { provideIcons } from "@ng-icons/core";
import { radixChevronLeft, radixTrash } from "@ng-icons/radix-icons";
import {
	BrnDialogContentDirective,
	BrnDialogTriggerDirective,
} from "@spartan-ng/ui-dialog-brain";
import {
	CreateMutationResult,
	DefinedCreateQueryResult,
	injectMutation,
	injectQuery,
} from "@tanstack/angular-query-experimental";
import { forkJoin, lastValueFrom } from "rxjs";

import {
	type CountryForm,
	CountryFormComponent,
} from "~/app/components/country-form/country-form.component";
import { AuthService } from "~/app/shared/services/auth.service";
import { CountryService } from "~/app/shared/services/country.service";
import { RulerService } from "~/app/shared/services/ruler.service";
import { Country } from "~/app/shared/types/Country.interface";
import { Ruler } from "~/app/shared/types/Ruler.interface";
import { HlmButtonModule } from "~/ui/ui-button-helm/src";
import { HlmDialogModule } from "~/ui/ui-dialog-helm/src";
import { HlmIconModule } from "~/ui/ui-icon-helm/src";

@Component({
	selector: "app-details",
	standalone: true,
	imports: [
		CountryFormComponent,
		HlmButtonModule,
		HlmIconModule,
		RouterLink,

		BrnDialogTriggerDirective,
		BrnDialogContentDirective,
		HlmDialogModule,
	],
	providers: [
		provideIcons({
			radixChevronLeft,
			radixTrash,
			bootstrapArrowClockwise,
		}),
	],
	templateUrl: "./details.template.html",
})
export class DetailsComponent {
	@HostBinding("class") class =
		"flex flex-col w-full justify-center items-center flex-1";

	readonly #countryService = inject(CountryService);
	readonly #rulerService = inject(RulerService);
	readonly #route = inject(ActivatedRoute);
	readonly authService = inject(AuthService);
	readonly #router = inject(Router);

	country!: DefinedCreateQueryResult<Country>;
	ruler!: DefinedCreateQueryResult<Ruler | null>;
	countryMutation!: CreateMutationResult<
		[Country, Ruler],
		HttpErrorResponse,
		[Omit<Country, "id" | "rulerId">, Omit<Ruler, "id" | "countryId">]
	>;
	deleteCountryMutation!: CreateMutationResult<Country, HttpErrorResponse>;

	constructor() {
		this.#route.paramMap.subscribe((params) => {
			const countryId = parseInt(params.get("id")!);

			this.country = injectQuery(() => ({
				queryKey: ["country", countryId],
				queryFn: () => lastValueFrom(this.#countryService.getById(countryId)),
				initialData: this.#route.snapshot.data["country"] as Country,
			}));

			this.ruler = injectQuery(() => ({
				queryKey: ["ruler", countryId],
				queryFn: () =>
					lastValueFrom(this.#rulerService.getByCountryId(countryId)),
				initialData: this.#route.snapshot.data["ruler"] as Ruler | null,
			}));

			this.deleteCountryMutation = injectMutation(() => ({
				mutationKey: ["deleteCountry", countryId],
				mutationFn: () => lastValueFrom(this.#countryService.delete(countryId)),
				onSuccess: () => {
					void this.#router.navigate(["/"]);
				},
				onError: (err) => {
					console.error(err);
				},
			}));

			this.countryMutation = injectMutation(() => ({
				mutationKey: ["editCountry", countryId],
				mutationFn: ([country, ruler]: [
					Omit<Country, "id" | "rulerId">,
					Omit<Ruler, "id" | "countryId">,
				]) =>
					lastValueFrom(
						forkJoin([
							this.#countryService.put(countryId, country),
							this.#rulerService.put(this.ruler.data()!.id, ruler),
						]),
					),

				onSuccess: (data) => {
					console.log(data);
				},

				onError: (err) => {
					console.error(err);
				},
			}));
		});
	}

	onSubmit = (values: CountryForm["value"]) => {
		const { name, gdp, isInEurope, formationYear, ruler } = values as Required<
			CountryForm["value"]
		>;

		this.countryMutation().mutate([
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
