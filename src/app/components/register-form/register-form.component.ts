import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from "@spartan-ng/ui-card-helm";
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { HlmLabelDirective } from "@spartan-ng/ui-label-helm";

import { passwordMatchValidator } from "~/app/shared/directives/samePassword.directive";

@Component({
	selector: "app-register-form",
	standalone: true,
	imports: [
		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,

		HlmInputDirective,
		HlmLabelDirective,
		HlmButtonDirective,

		ReactiveFormsModule,
		CommonModule,
	],
	templateUrl: "./register-form.component.html",
})
export class RegisterFormComponent {
	registerForm = new FormGroup(
		{
			firstName: new FormControl("", {
				nonNullable: true,
				validators: [Validators.required],
			}),
			lastName: new FormControl("", {
				nonNullable: true,
				validators: [Validators.required],
			}),
			email: new FormControl("", {
				nonNullable: true,
				validators: [Validators.required, Validators.email],
			}),
			password: new FormControl("", {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
				],
			}),
			confirmPassword: new FormControl("", {
				nonNullable: true,
				validators: [Validators.required],
			}),
		},
		{
			validators: [passwordMatchValidator],
		},
	);

	onSubmit() {}
}
