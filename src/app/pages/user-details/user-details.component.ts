import { Component, HostBinding, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { provideIcons } from "@ng-icons/core";
import { radixChevronLeft } from "@ng-icons/radix-icons";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { passwordMatchValidator } from "~/app/shared/directives/samePassword.directive";
import { AuthService } from "~/app/shared/services/auth.service";
import { HlmButtonModule } from "~/ui/ui-button-helm/src";
import { HlmCardModule } from "~/ui/ui-card-helm/src";
import { HlmIconModule } from "~/ui/ui-icon-helm/src";
import { HlmInputModule } from "~/ui/ui-input-helm/src";
import { HlmLabelModule } from "~/ui/ui-label-helm/src";
import { HlmSeparatorModule } from "~/ui/ui-separator-helm/src";

type DetailsForm = FormGroup<{
	firstName: FormControl<string>;
	lastName: FormControl<string>;
	email: FormControl<string>;
}>;

type PasswordForm = FormGroup<{
	password: FormControl<string>;
	confirmPassword: FormControl<string>;
}>;

@Component({
	selector: "app-user-details",
	standalone: true,
	imports: [
		HlmCardModule,
		HlmInputModule,
		HlmLabelModule,
		ReactiveFormsModule,
		HlmButtonModule,
		HlmSeparatorModule,
		HlmIconModule,
		RouterLink,
	],
	providers: [
		provideIcons({
			radixChevronLeft,
		}),
	],
	templateUrl: "./user-details.component.html",
})
export class UserDetailsComponent {
	@HostBinding("class") class =
		"flex flex-col flex-1 justify-center items-center";

	readonly #authService = inject(AuthService);

	readonly #changeUserDetailsMutation = injectMutation(() => ({
		mutationKey: ["userDetails"],
		mutationFn: ({ firstName, lastName, email }: DetailsForm["value"]) =>
			lastValueFrom(
				this.#authService.changeUserDetails(firstName!, lastName!, email!),
			),

		onSuccess: () => {
			const { firstName, lastName, email } = this.detailsForm.value;
			this.#authService.changeUser({
				firstName: firstName!,
				lastName: lastName!,
				email: email!,
			});
		},
	}));

	readonly detailsForm = new FormGroup({
		firstName: new FormControl(
			this.#authService.getAuthStore().user()?.firstName,
			{
				nonNullable: true,
				validators: [Validators.required],
			},
		),
		lastName: new FormControl(
			this.#authService.getAuthStore().user()?.lastName,
			{
				nonNullable: true,
				validators: [Validators.required],
			},
		),
		email: new FormControl(this.#authService.getAuthStore().user()?.email, {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
	});

	submitChangeDetails(values: DetailsForm["value"]) {
		this.#changeUserDetailsMutation().mutate(values);
	}

	readonly #changePasswordMutation = injectMutation(() => ({
		mutationKey: ["userPassword"],
		mutationFn: ({ password, confirmPassword }: PasswordForm["value"]) =>
			lastValueFrom(
				this.#authService.changePassword(password!, confirmPassword!),
			),
	}));

	readonly changePasswordForm = new FormGroup(
		{
			password: new FormControl("", {
				nonNullable: true,
				validators: [Validators.required],
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

	submitChangePassword(values: PasswordForm["value"]) {
		this.#changePasswordMutation().mutate(values);
	}
}
