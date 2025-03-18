import { Component, DestroyRef, OnInit } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { UserResponse, UserSettings } from "../models/user";
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
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { ToastService } from "../../services/toast.service";

type UserSettingsForm = {
    [key in keyof UserSettings]: FormControl<UserSettings[key]>;
};

@Component({
    selector: "{{cookiecutter.app_prefix}}-user-settings",
    templateUrl: "./user-settings.component.html",
    styleUrls: ["./user-settings.component.scss"],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
})
export class UserSettingsComponent implements OnInit {
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

    public updateSettingsLoading$ = this.authService.updateSettings.loading$;
    public requestResetLoading$ = this.authService.passwordForgotten.loading$;
    public deleteUserLoading$ = this.authService.deleteUser.loading$;

    constructor(
        private router: Router,
        private authService: AuthService,
        private toastService: ToastService,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.authService.currentUser$
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

        this.authService.passwordForgotten.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: $localize`Password reset email sent`,
                    body: $localize`An email has been sent to you with instructions on how to reset your password.`,
                    type: "success",
                });
            });

        this.authService.deleteUser.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: $localize`Error deleting account`,
                    body: $localize`An error occurred while deleting your account. Please try again later.`,
                    type: "danger",
                });
            });

        this.authService.deleteUser.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: $localize`Account deleted`,
                    body: $localize`Your account has been successfully deleted.`,
                    type: "success",
                });
                this.router.navigate(["/"]);
            });

        this.authService.updateSettings.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));

        this.authService.updateSettings.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(this.onSuccess.bind(this));
    }

    public requestPasswordReset(): void {
        this.authService.passwordForgotten.subject.next({
            email: this.form.getRawValue().email,
        });
    }

    public deleteAccount(): void {
        if (
            confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        ) {
            this.authService.deleteUser.subject.next();
        }
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (this.form.invalid) {
            return;
        }
        const userSettings = this.form.getRawValue();
        this.authService.newUserSettings(userSettings);
    }

    private onSuccess(user: UserResponse) {
        this.toastService.show({
            header: $localize`Settings updated`,
            body: $localize`Your settings have been successfully updated.`,
            type: "success",
        });
    }
}
