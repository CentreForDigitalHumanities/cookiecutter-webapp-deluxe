import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from "@angular/forms";

/**
 * Validation for usernames
 *
 * Also enforced in the backend:
 * - max 150 characters
 * - letters, digits and `@.+-_` only
 */
export const usernameValidators = [
    Validators.minLength(3),
    Validators.maxLength(150),
    Validators.pattern(/^[\w@+-]+$/),
];

/**
 * Validation for passwords
 */
export const passwordValidators = [Validators.minLength(8)];

/**
 * Form-level validator that checks whether two password fields have identical values.
 *
 * @param password1ControlName - The name of the first password control field on the form.
 * @param password2ControlName - The name of the second password control field on the form.
 * @returns A `ValidationErrors` object if the passwords do not match, otherwise `null`.
 */
export function identicalPasswordsValidator<T>(
    password1ControlName: string & T,
    password2ControlName: string & T,
): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
        const password1 = form.get(password1ControlName);
        const password2 = form.get(password2ControlName);

        if (!password1?.value || !password2?.value) {
            return null;
        }

        return password1.value === password2.value
            ? null
            : { passwords: true };
    };
}
