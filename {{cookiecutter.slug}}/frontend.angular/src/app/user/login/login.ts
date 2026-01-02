import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { UserLogin } from "../models/user";
import {
    controlErrorMessages$,
    formErrorMessages$,
    setErrors,
    updateFormValidity,
} from "../utils";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { map, withLatestFrom } from "rxjs";
import { AuthApi } from "../../services/auth-api";
import { CommonModule } from "@angular/common";
import { ToastStore } from "../../services/toast-store";

type LoginForm = {
    [key in keyof UserLogin]: FormControl<string>;
};

@Component({
    selector: "{{cookiecutter.app_prefix}}-login",
    templateUrl: "./login.html",
    styleUrls: ["./login.scss"],
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class Login implements OnInit {
    private authApi = inject(AuthApi);
    private toastStore = inject(ToastStore);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);

    public form = new FormGroup<LoginForm>({
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        password: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    public usernameErrors$ = controlErrorMessages$(this.form, "username");
    public passwordErrors$ = controlErrorMessages$(this.form, "password");
    public formErrors$ = formErrorMessages$(this.form);

    public loading$ = this.authApi.login.loading$;

    private nextParam$ = this.route.queryParamMap.pipe(
        map((params) => params.get("next"))
    );

    ngOnInit(): void {
        this.authApi.login.success$
            .pipe(
                withLatestFrom(this.nextParam$),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(([, next]) => {
                this.toastStore.show({
                    header: $localize`Sign in successful`,
                    body: $localize`You have been successfully signed in.`,
                    type: "success",
                });
                this.router.navigate([next || "/"]);
            });

        this.authApi.login.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authApi.login.subject.next(this.form.getRawValue());
    }
}
