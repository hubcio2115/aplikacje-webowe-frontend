import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** An actor's name can't match the given regular expression */
export const passwordMatchValidator: ValidatorFn = (
	control: AbstractControl,
): ValidationErrors | null => {
	const password = control.get("password");
	const confirmPassword = control.get("confirmPassword");

	if (
		!password ||
		!confirmPassword ||
		password.value == confirmPassword.value
	) {
		return null;
	} else {
		return { passwordMismatch: true };
	}
};
