import { Component, DestroyRef, OnInit } from "@angular/core";
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
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { ToastService } from "../../services/toast.service";

type LoginForm = {
    [key in keyof UserLogin]: FormControl<string>;
};

@Component({
    selector: "{{cookiecutter.app_prefix}}-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
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

    public loading$ = this.authService.login.loading$;

    private nextParam$ = this.route.queryParamMap.pipe(
        map((params) => params.get("next"))
    );

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.authService.login.success$
            .pipe(
                withLatestFrom(this.nextParam$),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(([, next]) => {
                this.toastService.show({
                    header: "Sign in successful",
                    body: "You have been successfully signed in.",
                    type: "success",
                });
                this.router.navigate([next || "/"]);
            });

        this.authService.login.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authService.login.subject.next(this.form.getRawValue());
    }
}
