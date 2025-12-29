import { Component, DestroyRef, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResetPassword } from "../models/user";
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
import { ToastService } from "../../services/toast.service";

type ResetPasswordForm = {
    [key in keyof ResetPassword]: FormControl<ResetPassword[key]>;
};

@Component({
    selector: "{{cookiecutter.app_prefix}}-reset-password",
    templateUrl: "./reset-password.component.html",
    styleUrls: ["./reset-password.component.scss"],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
})
export class ResetPasswordComponent implements OnInit {
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
            validators: identicalPasswordsValidator<keyof ResetPassword>(
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

    public loading$ = this.authService.resetPassword.loading$;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthApi,
        private toastService: ToastService,
        private destroyRef: DestroyRef
    ) { }

    ngOnInit(): void {
        this.authService.resetPassword.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));

        this.authService.resetPassword.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
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
        this.authService.resetPassword.subject.next(this.form.getRawValue());
    }
}
