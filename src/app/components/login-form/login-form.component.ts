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

		HlmInputDirective,
		HlmLabelDirective,
		HlmButtonDirective,

		ReactiveFormsModule,
		CommonModule,
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
