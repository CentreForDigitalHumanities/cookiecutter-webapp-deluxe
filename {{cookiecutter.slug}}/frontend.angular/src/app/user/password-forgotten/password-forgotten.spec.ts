import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { toSignal } from "@angular/core/rxjs-interop";

import { PasswordForgotten } from "./password-forgotten";
import { ToastStore } from "../../services/toast-store";

describe("PasswordForgotten", () => {
    let component: PasswordForgotten;
    let fixture: ComponentFixture<PasswordForgotten>;
    let httpTestingController: HttpTestingController;
    let toastStore: ToastStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(PasswordForgotten);
        httpTestingController = TestBed.inject(HttpTestingController);
        toastStore = TestBed.inject(ToastStore);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check missing input", () => {
        component.submit();

        httpTestingController.expectNone("/users/password/reset/");

        expect(component.form.controls.email.invalid).toBe(true);
        expect(component.form.controls.email.errors).toEqual({
            required: true,
        });
    });

    it("should check invalid email", () => {
        component.form.controls.email.setValue("test");
        component.submit();

        httpTestingController.expectNone("/users/password/reset/");

        expect(component.form.invalid).toBe(true);
        expect(component.form.controls.email.errors).toEqual({ email: true });
    });

    it("should submit valid input", () => {
        component.form.controls.email.setValue("test@test.nl");

        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$)
        );

        component.submit();
        expect(loading()).toBe(true);

        const req = httpTestingController.expectOne("/users/password/reset/");
        req.flush({ detail: "Password reset e-mail has been sent." });

        expect(loading()).toBe(false);
        expect(toastStore.toasts.length).toBe(1);
    });
});
