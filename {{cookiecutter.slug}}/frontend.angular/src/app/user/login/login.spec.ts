import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

import { Login } from "./login";
import { AuthApi } from "../../services/auth-api";
import { ToastStore } from "../../services/toast-store";

describe("Login", () => {
    let component: Login;
    let fixture: ComponentFixture<Login>;
    let toastService: ToastStore;
    let router: Router;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ToastStore,
                AuthApi,
                provideHttpClientTesting(),
                provideRouter([]),
            ],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        toastService = TestBed.inject(ToastStore);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check missing input", () => {
        component.submit();
        expect(component.form.controls.username.invalid).toBe(true);
        expect(component.form.controls.username.errors).toEqual({
            required: true,
        });
        expect(component.form.controls.password.invalid).toBe(true);
        expect(component.form.controls.password.errors).toEqual({
            required: true,
        });
    });

    it("should check invalid login details", () => {
        component.form.controls.username.setValue("te$t");
        component.form.controls.password.setValue("secretpassword");
        component.submit();

        const req = httpTestingController.expectOne("/users/login/");
        req.flush({
            non_field_errors: [
                "Unable to log in with provided credentials.",
            ],
        }, { status: 400, statusText: "Bad request" });

        expect(component.form.invalid).toBe(true);
        expect(component.form.errors).toEqual({
            invalid: "Unable to log in with provided credentials.",
        });
    });

    it("should accept valid input", () => {
        component.form.controls.username.setValue("user");
        component.form.controls.password.setValue("secretpassword");

        const routerSpy = vi.spyOn(router, "navigate");

        // toSignal lets us inspect the latest value of an Observable.
        // It basically turns it into a BehaviorSubject.
        const loading = TestBed.runInInjectionContext(() => toSignal(component.loading$));

        component.submit();
        expect(loading()).toBe(true);
        expect(component.form.valid).toBe(true);

        const req = httpTestingController.expectOne("/users/login/");
        req.flush({ key: "abcdefghijklmnopqrstuvwxyz" });

        expect(loading()).toBe(false);
        expect(toastService.toasts.length).toBe(1);
        expect(routerSpy).toHaveBeenCalledWith(["/"]);
    });
});
