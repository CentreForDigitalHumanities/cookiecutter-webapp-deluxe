import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PasswordForgotten } from "./password-forgotten";
import {
    HttpClientTestingModule,
    HttpTestingController,
} from "@angular/common/http/testing";
import { toSignal } from "@angular/core/rxjs-interop";
import { ToastStore } from "../../services/toast-store";

describe("PasswordForgotten", () => {
    let component: PasswordForgotten;
    let fixture: ComponentFixture<PasswordForgotten>;
    let httpTestingController: HttpTestingController;
    let toastService: ToastStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        fixture = TestBed.createComponent(PasswordForgotten);
        httpTestingController = TestBed.inject(HttpTestingController);
        toastService = TestBed.inject(ToastStore);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check missing input", () => {
        component.submit();

        httpTestingController.expectNone("/users/password/reset/");

        expect(component.form.controls.email.invalid).toBeTrue();
        expect(component.form.controls.email.errors).toEqual({
            required: true,
        });
    });

    it("should check invalid email", () => {
        component.form.controls.email.setValue("test");
        component.submit();

        httpTestingController.expectNone("/users/password/reset/");

        expect(component.form.invalid).toBeTrue();
        expect(component.form.controls.email.errors).toEqual({ email: true });
    });

    it("should submit valid input", () => {
        component.form.controls.email.setValue("test@test.nl");

        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$)
        );

        component.submit();
        expect(loading()).toBeTrue();

        const req = httpTestingController.expectOne("/users/password/reset/");
        req.flush({ detail: "Password reset e-mail has been sent." });

        expect(loading()).toBeFalse();
        expect(toastService.toasts.length).toBe(1);
    });
});
