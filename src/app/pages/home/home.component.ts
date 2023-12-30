import { DatePipe, DecimalPipe, TitleCasePipe } from "@angular/common";
import {
	Component,
	HostBinding,
	TrackByFunction,
	computed,
	inject,
	signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
	radixCaretSort,
	radixCheck,
	radixChevronDown,
	radixCross2,
	radixFilePlus,
	radixFileText,
} from "@ng-icons/radix-icons";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { BrnCheckboxComponent } from "@spartan-ng/ui-checkbox-brain";
import { HlmInputModule } from "@spartan-ng/ui-input-helm";
import { BrnMenuModule } from "@spartan-ng/ui-menu-brain";
import {
	BrnTableModule,
	PaginatorState,
	useBrnColumnManager,
} from "@spartan-ng/ui-table-brain";
import { BrnTooltipContentDirective } from "@spartan-ng/ui-tooltip-brain";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { debounceTime, lastValueFrom } from "rxjs";

import { SnakeCaseToSeparateCapitalizedPipe } from "~/app/shared/pipes/snakeCaseToSeparateCapitalized";
import { CountryService } from "~/app/shared/services/country.service";
import { Country } from "~/app/shared/types/Country.interface";
import { HlmCheckboxModule } from "~/ui/ui-checkbox-helm/src";
import { HlmIconModule, provideIcons } from "~/ui/ui-icon-helm/src";
import { HlmLabelModule } from "~/ui/ui-label-helm/src";
import { HlmMenuModule } from "~/ui/ui-menu-helm/src";
import { HlmTableModule } from "~/ui/ui-table-helm/src";
import { HlmTooltipModule } from "~/ui/ui-tooltip-helm/src";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [
		FormsModule,

		BrnMenuModule,
		HlmMenuModule,

		BrnTableModule,
		HlmTableModule,

		HlmButtonModule,

		DecimalPipe,
		DatePipe,
		TitleCasePipe,

		HlmIconModule,

		HlmLabelModule,
		HlmInputModule,

		SnakeCaseToSeparateCapitalizedPipe,

		BrnCheckboxComponent,
		HlmCheckboxModule,

		BrnTooltipContentDirective,
		HlmTooltipModule,

		RouterLink,
	],
	providers: [
		provideIcons({
			radixChevronDown,
			radixFileText,
			radixCaretSort,
			radixCheck,
			radixCross2,
			radixFilePlus,
		}),
	],
	templateUrl: "./home.component.html",
})
export class HomeComponent {
	@HostBinding("class") class = "flex flex-1 justify-center items-center";

	readonly #countryService = inject(CountryService);

	readonly _rawFilterInput = signal("");
	readonly #debouncedFilter = toSignal(
		toObservable(this._rawFilterInput).pipe(debounceTime(300)),
	);
	readonly _nameFilter = computed(() => this.#debouncedFilter() ?? "");

	readonly _inEuropeCheckbox = signal(false);

	readonly #displayedIndices = signal({ start: 0, end: 0 });
	readonly _availablePageSizes = [5, 10, 20, 10_000];
	readonly _pageSize = signal(this._availablePageSizes[0]);

	readonly _brnColumnManager = useBrnColumnManager({
		name: true,
		gdp: true,
		is_in_europe: true,
		formation_year: true,
	});
	readonly _allDisplayedColumns = computed(() => [
		...this._brnColumnManager.displayedColumns(),
		"actions",
	]);

	readonly countries = injectQuery(() => ({
		queryKey: ["countries"],
		queryFn: () => lastValueFrom(this.#countryService.getAll()),
	}));
	readonly #filteredCountries = computed(() => {
		const nameFilter = this._nameFilter().trim().toLowerCase();
		const inEuropeCheckbox = this._inEuropeCheckbox();

		if (!this.countries.data()) return [];

		const filteredByName =
			nameFilter.length > 0
				? this.countries
						.data()!
						.filter((country) =>
							country.name.toLowerCase().includes(nameFilter),
						)
				: this.countries.data()!;

		if (inEuropeCheckbox)
			return filteredByName.filter((country) => country.isInEurope);

		return filteredByName;
	});

	readonly #nameSort = signal<"ASC" | "DESC" | null>("ASC");
	readonly #gdpSort = signal<"ASC" | "DESC" | null>(null);
	readonly #formationYearSort = signal<"ASC" | "DESC" | null>(null);
	readonly _filteredSortedPaginatedCountries = computed(() => {
		const nameSort = this.#nameSort();
		const gdpSort = this.#gdpSort();
		const formationYearSort = this.#formationYearSort();

		const start = this.#displayedIndices().start;
		const end = this.#displayedIndices().end + 1;
		const result = this.#filteredCountries();

		switch (true) {
			case !!this.#nameSort():
				result.sort(
					(c1, c2) =>
						(nameSort === "ASC" ? 1 : -1) * c1.name.localeCompare(c2.name),
				);
				break;

			case !!this.#gdpSort():
				result.sort(
					(c1, c2) => (gdpSort === "ASC" ? 1 : -1) * (c1.gdp - c2.gdp),
				);
				break;

			case !!this.#formationYearSort():
				result.sort(
					(c1, c2) =>
						(formationYearSort === "ASC" ? 1 : -1) *
						(parseInt(c1.formationYear) - parseInt(c2.formationYear)),
				);
				break;
		}

		return result.slice(start, end);
	});

	readonly _trackBy: TrackByFunction<Country> = (_: number, c: Country) => c.id;
	readonly _totalCountries = computed(() => this.#filteredCountries().length);
	readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) => {
		this.#displayedIndices.set({ start: startIndex, end: endIndex });
	};

	handleFormationYearSortChange() {
		switch (this.#formationYearSort()) {
			case "ASC":
				this.#formationYearSort.set("DESC");
				break;
			case "DESC":
				this.#formationYearSort.set(null);
				break;
			default:
				this.#formationYearSort.set("ASC");
				break;
		}

		if (this.#gdpSort() !== null) this.#gdpSort.set(null);
		if (this.#nameSort() !== null) this.#nameSort.set(null);
	}

	handleGdpSortChange() {
		switch (this.#gdpSort()) {
			case "ASC":
				this.#gdpSort.set("DESC");
				break;
			case "DESC":
				this.#gdpSort.set(null);
				break;
			default:
				this.#gdpSort.set("ASC");
				break;
		}

		if (this.#formationYearSort() !== null) this.#formationYearSort.set(null);
		if (this.#nameSort() !== null) this.#nameSort.set(null);
	}

	handleToggleInEuropeCheckbox() {
		this._inEuropeCheckbox.set(!this._inEuropeCheckbox());
	}

	handleNameSortChange() {
		switch (this.#nameSort()) {
			case "ASC":
				this.#nameSort.set("DESC");
				break;
			case "DESC":
				this.#nameSort.set(null);
				break;
			default:
				this.#nameSort.set("ASC");
				break;
		}

		if (this.#formationYearSort() !== null) this.#formationYearSort.set(null);
		if (this.#gdpSort() !== null) this.#gdpSort.set(null);
	}
}
