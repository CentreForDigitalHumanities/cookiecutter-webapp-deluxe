import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

import { ResetPassword } from "./reset-password";
import { ToastStore } from "../../services/toast-store";

describe("ResetPassword", () => {
    let component: ResetPassword;
    let fixture: ComponentFixture<ResetPassword>;
    let toastService: ToastStore;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([]), provideHttpClientTesting()],
        });
        toastService = TestBed.inject(ToastStore);
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(ResetPassword);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check missing input", () => {
        component.submit();
        expect(component.form.controls.new_password1.invalid).toBe(true);
        expect(component.form.controls.new_password1.errors).toEqual({
            required: true,
        });
        expect(component.form.controls.new_password2.invalid).toBe(true);
        expect(component.form.controls.new_password2.errors).toEqual({
            required: true,
        });
    });

    it("should handle an invalid UID", () => {
        component.form.setValue({
            uid: "abcdefg",
            token: "hijklm",
            new_password1: "balrogofmorgoth",
            new_password2: "balrogofmorgoth",
        });
        component.submit();

        const req = httpTestingController.expectOne(
            "/users/password/reset/confirm/"
        );
        req.flush(
            {
                uid: ["Invalid value"],
            },
            {
                status: 400,
                statusText: "Bad request",
            }
        );

        expect(component.form.invalid).toBe(true);
        expect(component.form.controls.uid.errors).toEqual({
            invalid: "Invalid value",
        });
    });

    it("should handle an invalid token", () => {
        component.form.setValue({
            uid: "abcdefg",
            token: "hijklm",
            new_password1: "balrogofmorgoth",
            new_password2: "balrogofmorgoth",
        });
        component.submit();

        const req = httpTestingController.expectOne(
            "/users/password/reset/confirm/"
        );
        req.flush(
            {
                token: ["Invalid value"],
            },
            {
                status: 400,
                statusText: "Bad request",
            }
        );

        expect(component.form.invalid).toBe(true);
        expect(component.form.controls.token.errors).toEqual({
            invalid: "Invalid value",
        });
    });

    it("should handle a password mismatch", () => {
        component.form.setValue({
            uid: "valid",
            token: "valid",
            new_password1: "balrogofmorgoth",
            new_password2: "frodooftheshire",
        });
        component.submit();

        httpTestingController.expectNone("/users/password/reset/confirm/");

        expect(component.form.invalid).toBe(true);
        expect(component.form.errors).toEqual({
            passwords: true,
        });
    });

    it("should handle a successful password reset", () => {
        component.form.setValue({
            uid: "valid",
            token: "valid",
            new_password1: "balrogofmorgoth",
            new_password2: "balrogofmorgoth",
        });

        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$)
        );

        component.submit();
        expect(loading()).toBe(true);
        expect(component.form.valid).toBe(true);

        const req = httpTestingController.expectOne(
            "/users/password/reset/confirm/"
        );
        req.flush({
            detail: "Password has been reset with the new password.",
        });

        expect(loading()).toBe(false);
        expect(toastService.toasts.length).toBe(1);
    });
});
