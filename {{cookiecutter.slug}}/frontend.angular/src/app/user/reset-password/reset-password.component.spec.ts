import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ResetPasswordComponent } from "./reset-password.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { ToastService } from "@services/toast.service";
import { HttpTestingController } from "@angular/common/http/testing";
import { toSignal } from "@angular/core/rxjs-interop";

describe("ResetPasswordComponent", () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    let toastService: ToastService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResetPasswordComponent],
            imports: [SharedTestingModule]
        });
        toastService = TestBed.inject(ToastService);
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check missing input", () => {
        component.submit();
        expect(component.form.controls.new_password1.invalid).toBeTrue();
        expect(component.form.controls.new_password1.errors).toEqual({
            required: true
        });
        expect(component.form.controls.new_password2.invalid).toBeTrue();
        expect(component.form.controls.new_password2.errors).toEqual({
            required: true
        });
    });

    it("should handle an invalid UID", () => {
        component.form.setValue({
            uid: "abcdefg",
            token: "hijklm",
            new_password1: "balrogofmorgoth",
            new_password2: "balrogofmorgoth"
        })
        component.submit();

        const req = httpTestingController.expectOne("/users/password/reset/confirm/");
        req.flush({
            uid: ["Invalid value"]
        }, {
            status: 400, statusText: "Bad request"
        });

        expect(component.form.invalid).toBeTrue();
        expect(component.form.controls.uid.errors).toEqual({
            'invalid': 'Invalid value'
        });
    });

    it("should handle an invalid token", () => {
        component.form.setValue({
            uid: "abcdefg",
            token: "hijklm",
            new_password1: "balrogofmorgoth",
            new_password2: "balrogofmorgoth"
        })
        component.submit();

        const req = httpTestingController.expectOne("/users/password/reset/confirm/");
        req.flush({
            token: ["Invalid value"]
        }, {
            status: 400, statusText: "Bad request"
        });

        expect(component.form.invalid).toBeTrue();
        expect(component.form.controls.token.errors).toEqual({
            'invalid': 'Invalid value'
        });
    });

    it("should handle a password mismatch", () => {
        component.form.setValue({
            uid: "valid",
            token: "valid",
            new_password1: "balrogofmorgoth",
            new_password2: "frodooftheshire"
        });
        component.submit();

        httpTestingController.expectNone("/users/password/reset/confirm/");

        expect(component.form.invalid).toBeTrue();
        expect(component.form.errors).toEqual({
            'passwords': true
        });
    });

    it("should handle a successful password reset", () => {
        component.form.setValue({
            uid: "valid",
            token: "valid",
            new_password1: "balrogofmorgoth",
            new_password2: "balrogofmorgoth"
        });

        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$)
        );

        component.submit();
        expect(loading()).toBeTrue();
        expect(component.form.valid).toBeTrue();

        const req = httpTestingController.expectOne("/users/password/reset/confirm/");
        req.flush({
            detail: "Password has been reset with the new password."
        });

        expect(loading()).toBeFalse();
        expect(toastService.toasts.length).toBe(1);
    });
});
