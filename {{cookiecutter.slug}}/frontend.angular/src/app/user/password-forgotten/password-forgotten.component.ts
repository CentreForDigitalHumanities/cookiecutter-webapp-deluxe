import { Component, DestroyRef, OnInit } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { controlErrorMessages$, updateFormValidity } from "../utils";
import { PasswordForgotten } from "../models/user";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

type PasswordForgottenForm = {
    [key in keyof PasswordForgotten]: FormControl<string>;
};

@Component({
    selector: "lc-password-forgotten",
    templateUrl: "./password-forgotten.component.html",
    styleUrls: ["./password-forgotten.component.scss"],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
})
export class PasswordForgottenComponent implements OnInit {
    form = new FormGroup<PasswordForgottenForm>({
        email: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
    });

    public emailErrors$ = controlErrorMessages$(this.form, "email");

    public loading$ = this.authService.passwordForgotten.loading$;

    constructor(
        private authService: AuthService,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.authService.passwordForgotten.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                alert(
                    "If your email address is known to us, an email has been sent containing a link to a page where you may reset your password."
                );
            });

        this.authService.passwordForgotten.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
                alert(
                    "Request to send password reset email failed. Please try again."
                )
            );
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authService.passwordForgotten.subject.next(
            this.form.getRawValue()
        );
    }
}
