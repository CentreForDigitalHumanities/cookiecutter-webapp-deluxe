import { Component, DestroyRef, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@services/auth.service";
import { UserResponse, UserSettings } from "../models/user";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";
import {
    controlErrorMessages$,
    formErrorMessages$,
    setErrors,
    updateFormValidity,
} from "../utils";
import { ToastService } from "@services/toast.service";
import { usernameValidators } from "../validation";
import { Apollo } from "apollo-angular";
import { Router } from "@angular/router";
import { ModalService } from "@services/modal.service";

type UserSettingsForm = {
    [key in keyof UserSettings]: FormControl<UserSettings[key]>;
};

@Component({
    selector: "lc-user-settings",
    templateUrl: "./user-settings.component.html",
    styleUrls: ["./user-settings.component.scss"],
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
        private modalService: ModalService,
        private destroyRef: DestroyRef,
        private apollo: Apollo
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
                    header: "Password reset email sent",
                    body: "An email has been sent to you with instructions on how to reset your password.",
                    type: "success",
                });
            });

        this.authService.deleteUser.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.toastService.show({
                header: "Error deleting account",
                body: "An error occurred while deleting your account. Please try again later.",
                type: "danger",
            }));

        this.authService.deleteUser.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: "Account deleted",
                    body: "Your account has been successfully deleted.",
                    type: "success",
                });
                this.router.navigate(["/"]);
            });

        this.authService.updateSettings.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(result => setErrors(result.error, this.form));

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
        this.modalService
            .openConfirmationModal({
                title: "Delete account",
                message:
                    "Are you sure you want to delete your account? This action cannot be undone.",
            })
            .then(() => {
                this.authService.deleteUser.subject.next();
            })
            .catch(() => {
                // Do nothing on cancel / dismissal.
            });
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
            header: "Settings updated",
            body: "Your settings have been successfully updated.",
            type: "success",
        });
        this.updateCache(user.id);
    }

    private updateCache(id: number) {
        const cache = this.apollo.client.cache;
        const identified = cache.identify({ __typename: 'UserType', id });
        cache.evict({ id: identified, fieldName: 'firstName' });
        cache.evict({ id: identified, fieldName: 'lastName' });
        cache.evict({ id: identified, fieldName: 'fullName' });
        cache.gc();
    }
}
