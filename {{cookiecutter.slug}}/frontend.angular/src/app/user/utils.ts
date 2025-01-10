import { AbstractControl, FormGroup } from "@angular/forms";
import { User, UserResponse } from "./models/user";
import { Observable, map } from "rxjs";
import { RequestError } from "./Request";

/**
 * Transforms backend user response to User object
 *
 * @param result User response data
 * @returns User object
 */
export const parseUserData = (result: UserResponse | null): User | null => {
    if (!result) {
        return null;
    }
    return new User(
        result.id,
        result.username,
        result.email,
        result.first_name,
        result.last_name,
        result.is_staff,
    );
};

/**
 * Transfroms User data to backend UserResponse object
 *
 * Because this is used for patching, the data can be partial
 *
 * @param data (partial) User object
 * @returns UserResponse object
 */
export const encodeUserData = (data: Partial<User>): Partial<UserResponse> => {
    const encoded: Partial<UserResponse> = {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        is_staff: data.isStaff,
    };
    // Remove undefined values from object.
    return Object.fromEntries(Object.entries(encoded).filter(([_key, value]) => value !== undefined));
};

/**
 * Interprets backend validation errors and adds errors to their associated controls.
 *
 * Others are not tied to specific controls. These are added to the form itself with a generic 'invalid' key.
 *
 * @param errorObject - The error object containing the control names as keys and the corresponding error messages as values.
 * @param form - The form to which the errors should be added.
 */
export function setErrors(
    errorObject: RequestError["error"],
    form: FormGroup,
): void {
    for (const errorKey in errorObject) {
        const control = form.get(errorKey);
        const error = errorObject[errorKey];
        const errorMessage = Array.isArray(error) ? error.join("; ") : error;
        if (control) {
            control.setErrors({ invalid: errorMessage });
        } else {
            form.setErrors({ invalid: errorMessage });
        }
    }
}

export const ERROR_MAP: Record<string, Record<string, string>> = {
    username: {
        required: "Username is required.",
        minlength: "Username must be at least 3 characters long.",
        maxlength: "Username must be at most 150 characters long.",
    },
    email: {
        required: "Email is required.",
        email: "Email is invalid.",
    },
    password: {
        required: "Password is required.",
        minlength: "Password must be at least 8 characters long.",
    },
    token: {
        invalid: "The URL is invalid. Please request a new one.",
    },
    uid: {
        invalid: "The URL is invalid. Please request a new one.",
    },
    form: {
        passwords: "Passwords must be identical.",
    },
    firstName: {
        required: "First name is required.",
    },
    lastName: {
        required: "Last name is required.",
    },
};

/**
 * Watches a FormControl and returns an Observable that yields an array of error messages.
 *
 * Uses the optional parameter `lookup` to determine which error messages from `ERROR_MAP` to use. If no `lookup` is
 * provided, `controlName` is used. If no error messages are found using either `lookup` or `controlName`, `ERROR_MAP['form']` is used.
 *
 * @param form - The FormGroup instance.
 * @param controlName - The name of the form control.
 * @param lookup - The key to use in the error map. Defaults to the control name.
 * @returns An Observable that emits an array of error messages every time the control's status changes.
 */
export function controlErrorMessages$<
    F extends FormGroup,
    K extends string & keyof F["controls"],
>(form: F, controlName: K, lookup?: string): Observable<string[]> {
    const control = form.controls[controlName];
    // Get a subset of error messages based on the lookup key, if provided, or the control name.
    const messagesForControl = lookup
        ? ERROR_MAP[lookup]
        : ERROR_MAP[controlName] ?? ERROR_MAP["form"];
    return control.statusChanges.pipe(
        map(() => mapErrorsToMessages(control, messagesForControl)),
    );
}

/**
 * Watches a FormGroup and turns its errors into an array of string messages.
 *
 * Uses the optional parameter `lookup` to determine which error messages from `ERROR_MAP` to use. If no `lookup` is
 * provided, or if no error messages are found, `ERROR_MAP['form']` is used.
 *
 * @param form The form group to check for errors.
 * @param lookup Optional parameter to specify a specific error lookup key.
 * @returns An observable that emits an array of error messages.
 */
export function formErrorMessages$<F extends FormGroup>(
    form: F,
    lookup?: string,
): Observable<string[]> {
    const messagesForForm = lookup ? ERROR_MAP[lookup] : ERROR_MAP["form"];
    return form.statusChanges.pipe(
        map(() => mapErrorsToMessages(form, messagesForForm)),
    );
}

/**
 * Maps control errors to error messages using the provided error map.
 *
 * If no message is specified for an error key, the error value itself is used as the message.
 *
 * @param control - The control containing the errors.
 * @param errorMap - The map of error keys to error messages.
 * @returns An array of error messages.
 */
function mapErrorsToMessages(
    control: AbstractControl,
    errorMap: Record<string, string>,
): string[] {
    const errors = control.errors ?? {};
    return Object.keys(errors).map((errorKey) =>
        errorKey in errorMap ? errorMap[errorKey] : errors[errorKey],
    );
}

/**
 * Updates the validity of all controls in the given form and the form itself.
 *
 * @param form - The form group to update.
 */
export function updateFormValidity(form: FormGroup): void {
    Object.values(form.controls).forEach((control) => {
        control.updateValueAndValidity();
    });
    form.updateValueAndValidity();
}
