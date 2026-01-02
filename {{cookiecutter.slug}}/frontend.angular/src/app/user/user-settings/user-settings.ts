import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { UserResponse, UserSettingsData } from "../models/user";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";
import {
    controlErrorMessages$,
    formErrorMessages$,
    setErrors,
    updateFormValidity,
} from "../utils";
import { usernameValidators } from "../validation";
import { Router } from "@angular/router";
import { AuthApi } from "../../services/auth-api";
import { CommonModule } from "@angular/common";
import { ToastStore } from "../../services/toast-store";

type UserSettingsForm = {
    [key in keyof UserSettingsData]: FormControl<UserSettingsData[key]>;
};

@Component({
    selector: "{{cookiecutter.app_prefix}}-user-settings",
    templateUrl: "./user-settings.html",
    styleUrls: ["./user-settings.scss"],
    imports: [CommonModule, ReactiveFormsModule],
})
export class UserSettings implements OnInit {
    private router = inject(Router);
    private authApi = inject(AuthApi);
    private toastStore = inject(ToastStore);
    private destroyRef = inject(DestroyRef);

    public form = new FormGroup<UserSettingsForm>({
        id: new FormControl<number>(-1, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        // dj-rest-auth does not let you change your email address, so we don't need to validate it.
        email: new FormControl<string>("", {
            nonNullable: true,
        }),
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, ...usernameValidators],
        }),
        firstName: new FormControl<string>("", {
            nonNullable: true,
        }),
        lastName: new FormControl<string>("", {
            nonNullable: true,
        }),
    });

    public usernameErrors$ = controlErrorMessages$(this.form, "username");
    public formErrors$ = formErrorMessages$(this.form);

    public updateSettingsLoading$ = this.authApi.updateSettings.loading$;
    public requestResetLoading$ = this.authApi.passwordForgotten.loading$;
    public deleteUserLoading$ = this.authApi.deleteUser.loading$;

    ngOnInit(): void {
        this.authApi.currentUser$
            .pipe(
                filter((user) => !!user),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((user) => {
                if (!user) {
                    return;
                }
                this.form.patchValue(user);
            });

        this.authApi.passwordForgotten.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastStore.show({
                    header: $localize`Password reset email sent`,
                    body: $localize`An email has been sent to you with instructions on how to reset your password.`,
                    type: "success",
                });
            });

        this.authApi.deleteUser.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastStore.show({
                    header: $localize`Error deleting account`,
                    body: $localize`An error occurred while deleting your account. Please try again later.`,
                    type: "danger",
                });
            });

        this.authApi.deleteUser.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastStore.show({
                    header: $localize`Account deleted`,
                    body: $localize`Your account has been successfully deleted.`,
                    type: "success",
                });
                this.router.navigate(["/"]);
            });

        this.authApi.updateSettings.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));

        this.authApi.updateSettings.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(this.onSuccess.bind(this));
    }

    public requestPasswordReset(): void {
        this.authApi.passwordForgotten.subject.next({
            email: this.form.getRawValue().email,
        });
    }

    public deleteAccount(): void {
        if (
            confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        ) {
            this.authApi.deleteUser.subject.next();
        }
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (this.form.invalid) {
            return;
        }
        const userSettings = this.form.getRawValue();
        this.authApi.newUserSettings(userSettings);
    }

    private onSuccess(user: UserResponse) {
        this.toastStore.show({
            header: $localize`Settings updated`,
            body: $localize`Your settings have been successfully updated.`,
            type: "success",
        });
    }
}
