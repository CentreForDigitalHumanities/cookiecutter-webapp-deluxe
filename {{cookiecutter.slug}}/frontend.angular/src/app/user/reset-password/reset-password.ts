import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResetPasswordData } from "../models/user";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { identicalPasswordsValidator, passwordValidators } from "../validation";
import {
    controlErrorMessages$,
    formErrorMessages$,
    setErrors,
    updateFormValidity,
} from "../utils";
import { combineLatest, map } from "rxjs";
import { AuthApi } from "../../services/auth-api";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { ToastStore } from "../../services/toast-store";

type ResetPasswordForm = {
    [key in keyof ResetPasswordData]: FormControl<ResetPasswordData[key]>;
};

@Component({
    selector: "{{cookiecutter.app_prefix}}-reset-password",
    templateUrl: "./reset-password.html",
    styleUrls: ["./reset-password.scss"],
    imports: [CommonModule, ReactiveFormsModule],
})
export class ResetPassword implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private authApi = inject(AuthApi);
    private toastStore = inject(ToastStore);
    private destroyRef = inject(DestroyRef);

    private uid = this.activatedRoute.snapshot.params["uid"];
    private token = this.activatedRoute.snapshot.params["token"];

    public form = new FormGroup<ResetPasswordForm>(
        {
            uid: new FormControl<string>(this.uid, {
                nonNullable: true,
            }),
            token: new FormControl<string>(this.token, {
                nonNullable: true,
            }),
            new_password1: new FormControl<string>("", {
                nonNullable: true,
                validators: [Validators.required, ...passwordValidators],
            }),
            new_password2: new FormControl<string>("", {
                nonNullable: true,
                validators: [Validators.required, ...passwordValidators],
            }),
        },
        {
            validators: identicalPasswordsValidator<keyof ResetPasswordData>(
                "new_password1",
                "new_password2"
            ),
        }
    );

    public password1Errors$ = controlErrorMessages$(
        this.form,
        "new_password1",
        "password"
    );
    public password2Errors$ = controlErrorMessages$(
        this.form,
        "new_password2",
        "password"
    );
    public formErrors$ = combineLatest([
        formErrorMessages$(this.form),
        controlErrorMessages$(this.form, "token"),
        controlErrorMessages$(this.form, "uid"),
    ]).pipe(map((errorLists) => errorLists.flat(1)));

    public loading$ = this.authApi.resetPassword.loading$;

    ngOnInit(): void {
        this.authApi.resetPassword.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));

        this.authApi.resetPassword.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastStore.show({
                    header: $localize`Password reset`,
                    body: $localize`Your password has been successfully reset.`,
                    type: "success",
                });
            });
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authApi.resetPassword.subject.next(this.form.getRawValue());
    }
}
