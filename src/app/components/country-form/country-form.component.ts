import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { bootstrapArrowClockwise } from "@ng-icons/bootstrap-icons";
import { provideIcons } from "@ng-icons/core";
import { BrnCheckboxComponent } from "@spartan-ng/ui-checkbox-brain";
import { BrnSeparatorComponent } from "@spartan-ng/ui-separator-brain";

import { AuthService } from "~/app/shared/services/auth.service";
import { Country } from "~/app/shared/types/Country.interface";
import { Ruler } from "~/app/shared/types/Ruler.interface";
import { HlmButtonModule } from "~/ui/ui-button-helm/src";
import { HlmCardModule } from "~/ui/ui-card-helm/src";
import { HlmCheckboxModule } from "~/ui/ui-checkbox-helm/src";
import { HlmIconModule } from "~/ui/ui-icon-helm/src";
import { HlmInputDirective } from "~/ui/ui-input-helm/src";
import { HlmLabelDirective } from "~/ui/ui-label-helm/src";
import { HlmSeparatorModule } from "~/ui/ui-separator-helm/src";

export type CountryForm = FormGroup<{
	name: FormControl<string>;
	gdp: FormControl<number>;
	isInEurope: FormControl<boolean>;
	formationYear: FormControl<string | number>;

	ruler: FormGroup<{
		name: FormControl<string>;
		surname: FormControl<string>;
		officeStartDate: FormControl<string>;
	}>;
}>;

@Component({
	selector: "app-country-form",
	standalone: true,
	imports: [
		HlmCardModule,

		HlmLabelDirective,

		HlmInputDirective,

		HlmButtonModule,

		BrnCheckboxComponent,
		HlmCheckboxModule,

		HlmSeparatorModule,
		BrnSeparatorComponent,

		ReactiveFormsModule,

		HlmIconModule,
		CommonModule,
	],
	providers: [
		provideIcons({
			bootstrapArrowClockwise,
		}),
	],
	templateUrl: "./country-form.component.html",
})
export class CountryFormComponent implements OnInit {
	@Input({ required: false }) isEditForm = false;
	@Input({ required: false }) initialCountryData: Country | null = null;
	@Input({ required: false }) initialRulerData: Ruler | null = null;
	@Input({ required: true }) onSubmit!: (values: CountryForm["value"]) => void;
	@Input({ required: true }) pending!: boolean;

	readonly authService = inject(AuthService);

	countryForm!: CountryForm;

	ngOnInit(): void {
		this.countryForm = new FormGroup({
			name: new FormControl(this.initialCountryData?.name ?? "", {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.minLength(3),
					Validators.pattern(/^[a-zA-Z]+$/),
				],
			}),
			gdp: new FormControl(this.initialCountryData?.gdp ?? 0, {
				nonNullable: true,
				validators: [Validators.required, Validators.min(0)],
			}),
			isInEurope: new FormControl(
				this.initialCountryData?.isInEurope ?? false,
				{
					nonNullable: true,
				},
			),
			formationYear: new FormControl(
				this.initialCountryData?.formationYear ?? 0,
				{
					nonNullable: true,
					validators: [Validators.required, Validators.pattern(/^[\d]+$/)],
				},
			),

			ruler: new FormGroup({
				name: new FormControl(this.initialRulerData?.name ?? "", {
					nonNullable: true,
					validators: [Validators.required],
				}),
				surname: new FormControl(this.initialRulerData?.surname ?? "", {
					nonNullable: true,
					validators: [Validators.required],
				}),
				officeStartDate: new FormControl(
					this.initialRulerData?.officeStartDate ??
						new Date().toJSON().split("T")[0],
					{ nonNullable: true },
				),
			}),
		});

		if (this.isEditForm) this.countryForm.disable();
	}

	toggleEditMode() {
		this.countryForm.disabled
			? this.countryForm.enable()
			: this.countryForm.disable();
	}
}
