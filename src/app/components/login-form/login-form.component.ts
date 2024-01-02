import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { HlmInputModule } from "@spartan-ng/ui-input-helm";

import { AuthService } from "~/app/shared/services/auth.service";
import { AuthStore } from "~/app/shared/store/AuthStore";
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
	readonly #authService = inject(AuthService);
	readonly #authStore = inject(AuthStore);
	readonly #router = inject(Router);

	loginForm = new FormGroup({
		email: new FormControl("", {
			nonNullable: true,
			updateOn: "submit",
			validators: [Validators.required, Validators.email],
		}),
		password: new FormControl("", {
			nonNullable: true,
			updateOn: "submit",
			validators: [Validators.required, Validators.minLength(8)],
		}),
	});

	onSubmit() {
		const { email, password } = this.loginForm.value;

		this.#authService.login(email!, password!);
	}
}
