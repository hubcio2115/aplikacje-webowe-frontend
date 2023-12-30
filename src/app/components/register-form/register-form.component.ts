import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { HlmInputModule } from "@spartan-ng/ui-input-helm";

import { passwordMatchValidator } from "~/app/shared/directives/samePassword.directive";
import { HlmCardModule } from "~/ui/ui-card-helm/src";
import { HlmLabelModule } from "~/ui/ui-label-helm/src";

@Component({
	selector: "app-register-form",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,

		HlmCardModule,
		HlmInputModule,
		HlmLabelModule,
		HlmButtonModule,
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
