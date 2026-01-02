import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { controlErrorMessages$, updateFormValidity } from "../utils";
import { PasswordForgottenData } from "../models/user";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthApi } from "../../services/auth-api";
import { CommonModule } from "@angular/common";
import { ToastStore } from "../../services/toast-store";

type PasswordForgottenForm = {
    [key in keyof PasswordForgottenData]: FormControl<string>;
};

@Component({
    selector: "{{cookiecutter.app_prefix}}-password-forgotten",
    templateUrl: "./password-forgotten.html",
    styleUrls: ["./password-forgotten.scss"],
    imports: [CommonModule, ReactiveFormsModule],
})
export class PasswordForgotten implements OnInit {
    private authApi = inject(AuthApi);
    private toastStore = inject(ToastStore);
    private destroyRef = inject(DestroyRef);

    form = new FormGroup<PasswordForgottenForm>({
        email: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
    });

    public emailErrors$ = controlErrorMessages$(this.form, "email");

    public loading$ = this.authApi.passwordForgotten.loading$;

    ngOnInit(): void {
        this.authApi.passwordForgotten.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastStore.show({
                    header: $localize`Password reset request successful`,
                    body: $localize`If your email address is known to us, an email has been sent containing a link to a page where you may reset your password.`,
                    type: "success",
                    // This is a long message, so we show it for 10 seconds.
                    delay: 10000,
                });
            });

        this.authApi.passwordForgotten.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastStore.show({
                    header: $localize`Reset request failed`,
                    body: $localize`Request to send password reset email failed. Please try again.`,
                    type: "danger",
                });
            });
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authApi.passwordForgotten.subject.next(
            this.form.getRawValue()
        );
    }
}
