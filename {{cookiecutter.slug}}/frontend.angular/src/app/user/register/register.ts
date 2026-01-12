import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { UserRegistration } from "../models/user";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import {
    usernameValidators,
    passwordValidators,
    identicalPasswordsValidator,
} from "../validation";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    controlErrorMessages$,
    formErrorMessages$,
    setErrors,
    updateFormValidity,
} from "../utils";
import { Router } from "@angular/router";
import { AuthApi } from "../../services/auth-api";
import { ToastStore } from "../../services/toast-store";
import { CommonModule } from "@angular/common";

type RegisterForm = {
    [key in keyof UserRegistration]: FormControl<UserRegistration[key]>;
};

@Component({
    selector: "{{cookiecutter.app_prefix}}-register",
    templateUrl: "./register.html",
    styleUrl: "./register.scss",
    imports: [CommonModule, ReactiveFormsModule],
})
export class Register implements OnInit {
    private authApi = inject(AuthApi);
    private toastStore = inject(ToastStore);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

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
                "password2"
            ),
        }
    );

    public usernameErrors$ = controlErrorMessages$(this.form, "username");
    public emailErrors$ = controlErrorMessages$(this.form, "email");
    public password1Errors$ = controlErrorMessages$(
        this.form,
        "password1",
        "password"
    );
    public password2Errors$ = controlErrorMessages$(
        this.form,
        "password2",
        "password"
    );
    public formErrors$ = formErrorMessages$(this.form);

    public loading$ = this.authApi.registration.loading$;


    ngOnInit(): void {
        this.authApi.registration.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));

        this.authApi.registration.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastStore.show({
                    header: $localize`Registration successful`,
                    body: $localize`You have been successfully registered. Please check your email for a confirmation link.`,
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
        this.authApi.registration.subject.next(this.form.getRawValue());
    }
}
