import { DatePipe, DecimalPipe, TitleCasePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
	Component,
	HostBinding,
	OnInit,
	TrackByFunction,
	computed,
	inject,
	signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import {
	radixCaretSort,
	radixCheck,
	radixChevronDown,
	radixCross2,
	radixDotsHorizontal,
} from "@ng-icons/radix-icons";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { BrnCheckboxComponent } from "@spartan-ng/ui-checkbox-brain";
import {
	HlmCheckboxCheckIconComponent,
	HlmCheckboxDirective,
} from "@spartan-ng/ui-checkbox-helm";
import { HlmIconComponent, provideIcons } from "@spartan-ng/ui-icon-helm";
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { BrnMenuTriggerDirective } from "@spartan-ng/ui-menu-brain";
import { HlmMenuModule } from "@spartan-ng/ui-menu-helm";
import {
	BrnTableModule,
	PaginatorState,
	useBrnColumnManager,
} from "@spartan-ng/ui-table-brain";
import { HlmTableModule } from "@spartan-ng/ui-table-helm";
import { debounceTime } from "rxjs";

import { SnakeCaseToSeparateCapitalizedPipe } from "~/app/shared/pipes/snakeCaseToSeparateCapitalized";
import { Country } from "~/app/shared/types/Country.interface";
import { environment } from "~/environments/environment";
import { HlmLabelDirective } from "~/ui/ui-label-helm/src";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [
		FormsModule,

		BrnMenuTriggerDirective,
		HlmMenuModule,

		BrnTableModule,
		HlmTableModule,

		HlmButtonModule,

		DecimalPipe,
		DatePipe,
		TitleCasePipe,

		HlmIconComponent,

		HlmLabelDirective,
		HlmInputDirective,

		SnakeCaseToSeparateCapitalizedPipe,

		BrnCheckboxComponent,
		HlmCheckboxCheckIconComponent,
		HlmCheckboxDirective,
	],
	providers: [
		provideIcons({
			radixChevronDown,
			radixDotsHorizontal,
			radixCaretSort,
			radixCheck,
			radixCross2,
		}),
	],
	templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
	@HostBinding("class") class = "flex flex-1 justify-center items-center";

	readonly #httpClient = inject(HttpClient);

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

	readonly #countries = signal<Country[]>([]);
	readonly #filteredCountries = computed(() => {
		const nameFilter = this._nameFilter().trim().toLowerCase();
		const inEuropeCheckbox = this._inEuropeCheckbox();

		const filteredByName =
			nameFilter.length > 0
				? this.#countries().filter((country) =>
						country.name.toLowerCase().includes(nameFilter),
				  )
				: this.#countries();

		if (inEuropeCheckbox)
			return filteredByName.filter((country) => country.isInEurope);

		return filteredByName;
	});

	ngOnInit(): void {
		this.#httpClient
			.get<Country[]>(`${environment.apiUrl}/api/countries`)
			.subscribe((value) => {
				this.#countries.set(value);
			});
	}

	readonly #nameSort = signal<"ASC" | "DESC" | null>("ASC");
	readonly #gdpSort = signal<"ASC" | "DESC" | null>(null);
	readonly #formationYearSort = signal<"ASC" | "DESC" | null>(null);
	readonly _filteredSortedPaginatedCountries = computed(() => {
		const nameSort = this.#nameSort();
		const gdpSort = this.#gdpSort();
		const formationYearSort = this.#formationYearSort();

		const start = this.#displayedIndices().start;
		const end = this.#displayedIndices().end + 1;
		const countries = this.#filteredCountries();

		let result: Country[];
		if (this.#nameSort()) {
			result = [...countries].sort(
				(c1, c2) =>
					(nameSort === "ASC" ? 1 : -1) * c1.name.localeCompare(c2.name),
			);
		} else if (this.#gdpSort()) {
			result = [...countries].sort(
				(c1, c2) => (gdpSort === "ASC" ? 1 : -1) * (c1.gdp - c2.gdp),
			);
		} else if (this.#formationYearSort()) {
			result = [...countries].sort(
				(c1, c2) =>
					(formationYearSort === "ASC" ? 1 : -1) *
					(parseInt(c1.formationYear) - parseInt(c2.formationYear)),
			);
		} else result = countries;

		return result.slice(start, end);
	});

	readonly _trackBy: TrackByFunction<Country> = (_: number, c: Country) => c.id;
	readonly _totalElements = computed(() => this.#filteredCountries().length);
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
