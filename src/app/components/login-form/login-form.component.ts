import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { provideIcons } from "@ng-icons/core";
import { radixSymbol } from "@ng-icons/radix-icons";
import { Store } from "@ngrx/store";
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from "@spartan-ng/ui-card-helm";
import { HlmIconComponent } from "@spartan-ng/ui-icon-helm";
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { HlmLabelDirective } from "@spartan-ng/ui-label-helm";

import {
	LoginRequest,
	authAcitons,
	selectIsSubmitting,
} from "~/app/auth/store/auth.store";

@Component({
	selector: "app-login-form",
	standalone: true,
	imports: [
		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,
		HlmIconComponent,

		HlmInputDirective,
		HlmLabelDirective,
		HlmButtonDirective,

		ReactiveFormsModule,
		CommonModule,
	],
	providers: [provideIcons({ radixSymbol })],
	templateUrl: "./login-form.component.html",
})
export class LoginFormComponent {
	#store = inject(Store);
	isSubmitting$ = this.#store.select(selectIsSubmitting);

	loginForm = new FormGroup({
		email: new FormControl("", {
			nonNullable: true,
			updateOn: "submit",
			validators: [Validators.email],
		}),
		password: new FormControl("", {
			nonNullable: true,
			updateOn: "submit",
			validators: [Validators.required],
		}),
	});

	onSubmit() {
		this.#store.dispatch(
			authAcitons.login({ request: this.loginForm.value as LoginRequest }),
		);
	}
}
