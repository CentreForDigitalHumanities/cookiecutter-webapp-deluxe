import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

import { Register } from "./register";
import { ToastStore } from "../../services/toast-store";

describe("Register", () => {
    let component: Register;
    let fixture: ComponentFixture<Register>;
    let httpTestingController: HttpTestingController;
    let router: Router;
    let toastStore: ToastStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClientTesting()],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        toastStore = TestBed.inject(ToastStore);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(Register);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check missing input", () => {
        component.submit();

        httpTestingController.expectNone("/users/registration/");

        expect(component.form.controls.username.invalid).toBe(true);
        expect(component.form.controls.username.errors).toEqual({
            required: true,
        });

        expect(component.form.controls.email.invalid).toBe(true);
        expect(component.form.controls.email.errors).toEqual({
            required: true,
        });

        expect(component.form.controls.password1.invalid).toBe(true);
        expect(component.form.controls.password1.errors).toEqual({
            required: true,
        });

        expect(component.form.controls.password2.invalid).toBe(true);
        expect(component.form.controls.password2.errors).toEqual({
            required: true,
        });
    });

    it("should check whether a username has the required length", () => {
        const control = component.form.controls.username;
        control.setValue("a");
        control.updateValueAndValidity();
        expect(control.errors).toEqual({
            minlength: { requiredLength: 3, actualLength: 1 },
        });

        control.setValue("ThisNameIsTooLong".repeat(10));
        control.updateValueAndValidity();
        expect(control.errors).toEqual({
            maxlength: { requiredLength: 150, actualLength: 170 },
        });
    });

    it("should check whether an email is valid", () => {
        const control = component.form.controls.email;
        control.setValue("invalid");
        control.updateValueAndValidity();
        expect(control.errors).toEqual({
            email: true,
        });
    });

    it("should check whether a password has the required length", () => {
        const control = component.form.controls.password1;
        control.setValue("a");
        control.updateValueAndValidity();
        expect(control.errors).toEqual({
            minlength: { requiredLength: 8, actualLength: 1 },
        });
    });

    it("should check whether passwords are identical", () => {
        component.form.controls.password1.setValue("password");
        component.form.controls.password2.setValue("password1");
        component.submit();

        expect(component.form.invalid).toBe(true);
        expect(component.form.errors).toEqual({
            passwords: true,
        });
    });

    it("should handle valid input", () => {
        component.form.controls.username.setValue("frodo");
        component.form.controls.email.setValue("frodo@shire.me");
        component.form.controls.password1.setValue("theonering");
        component.form.controls.password2.setValue("theonering");

        const routerSpy = vi.spyOn(router, "navigate");

        const loading = TestBed.runInInjectionContext(() => toSignal(component.loading$));

        component.submit();
        expect(loading()).toBe(true);
        expect(component.form.valid).toBe(true);

        const req = httpTestingController.expectOne("/users/registration/");
        req.flush(null);

        expect(loading()).toBe(false);
        expect(toastStore.toasts.length).toBe(1);
        expect(routerSpy).toHaveBeenCalledWith(["/"]);
    });

    it("should handle trying to register with an existing username", () => {
        component.form.controls.username.setValue("frodo");
        component.form.controls.email.setValue("frodo@shire.me");
        component.form.controls.password1.setValue("theonering");
        component.form.controls.password2.setValue("theonering");

        const routerSpy = vi.spyOn(router, "navigate");

        const loading = TestBed.runInInjectionContext(() => toSignal(component.loading$));

        component.submit();
        expect(loading()).toBe(true);
        expect(component.form.valid).toBe(true);

        const req = httpTestingController.expectOne("/users/registration/");
        req.flush(
            { username: ["A user with that username already exists."] },
            { status: 400, statusText: "Bad request" }
        );

        expect(loading()).toBe(false);
        expect(toastStore.toasts.length).toBe(0);
        expect(routerSpy).not.toHaveBeenCalled();
        expect(component.form.controls.username.errors).toEqual({
            invalid: "A user with that username already exists.",
        });
    });
});
