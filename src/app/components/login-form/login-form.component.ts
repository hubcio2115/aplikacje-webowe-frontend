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

import { HlmCardModule } from "~/ui/ui-card-helm/src";
import { HlmLabelModule } from "~/ui/ui-label-helm/src";

@Component({
	selector: "app-login-form",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		HlmCardModule,
		HlmInputModule,
		HlmLabelModule,
		HlmButtonModule,
	],
	templateUrl: "./login-form.component.html",
})
export class LoginFormComponent {
	loginForm = new FormGroup({
		email: new FormControl("", {
			nonNullable: true,
			updateOn: "submit",
			validators: [Validators.required, Validators.email],
		}),
		password: new FormControl("", {
			nonNullable: true,
			updateOn: "submit",
			validators: [Validators.minLength(8)],
		}),
	});

	onSubmit() {}
}
