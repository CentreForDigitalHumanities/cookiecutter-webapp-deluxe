import { Component, DestroyRef, OnInit } from "@angular/core";
import { UserRegistration } from "../models/user";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
    usernameValidators,
    passwordValidators,
    identicalPasswordsValidator,
} from "../validation";
import { AuthService } from "@services/auth.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    controlErrorMessages$,
    formErrorMessages$,
    setErrors,
    updateFormValidity,
} from "../utils";
import { ToastService } from "@services/toast.service";
import { Router } from "@angular/router";

type RegisterForm = {
    [key in keyof UserRegistration]: FormControl<UserRegistration[key]>;
};

@Component({
    selector: "lc-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
    public form = new FormGroup<RegisterForm>(
        {
            username: new FormControl<string>("", {
                nonNullable: true,
                validators: [Validators.required, ...usernameValidators],
            }),
            email: new FormControl<string>("", {
                nonNullable: true,
                validators: [Validators.required, Validators.email],
            }),
            password1: new FormControl<string>("", {
                nonNullable: true,
                validators: [Validators.required, ...passwordValidators],
            }),
            password2: new FormControl<string>("", {
                nonNullable: true,
                validators: [Validators.required, ...passwordValidators],
            }),
        },
        {
            validators: identicalPasswordsValidator<keyof RegisterForm>(
                "password1",
                "password2",
            ),
        },
    );

    public usernameErrors$ = controlErrorMessages$(this.form, "username");
    public emailErrors$ = controlErrorMessages$(this.form, "email");
    public password1Errors$ = controlErrorMessages$(
        this.form,
        "password1",
        "password",
    );
    public password2Errors$ = controlErrorMessages$(
        this.form,
        "password2",
        "password",
    );
    public formErrors$ = formErrorMessages$(this.form);

    public loading$ = this.authService.registration.loading$;

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private destroyRef: DestroyRef,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.authService.registration.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));

        this.authService.registration.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: "Registration successful",
                    body: "You have been successfully registered. Please check your email for a confirmation link.",
                    type: "success",
                });
                this.router.navigate(["/"]);
            });
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authService.registration.subject.next(this.form.getRawValue());
    }
}
