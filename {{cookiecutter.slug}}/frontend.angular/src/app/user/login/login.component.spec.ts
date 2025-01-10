import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { AuthService } from "@services/auth.service";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { Router } from "@angular/router";
import { HttpTestingController } from "@angular/common/http/testing";
import { ToastService } from "@services/toast.service";
import { toSignal } from "@angular/core/rxjs-interop";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let toastService: ToastService;
    let router: Router;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [ToastService, AuthService],
            imports: [SharedTestingModule],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        toastService = TestBed.inject(ToastService);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check missing input", () => {
        component.submit();
        expect(component.form.controls.username.invalid).toBeTrue();
        expect(component.form.controls.username.errors).toEqual({
            required: true,
        });
        expect(component.form.controls.password.invalid).toBeTrue();
        expect(component.form.controls.password.errors).toEqual({
            required: true,
        });
    });

    it("should check invalid login details", () => {
        component.form.controls.username.setValue("te$t");
        component.form.controls.password.setValue("secretpassword");
        component.submit();

        const req = httpTestingController.expectOne("/users/login/");
        req.flush(
            {
                non_field_errors: [
                    "Unable to log in with provided credentials.",
                ],
            },
            { status: 400, statusText: "Bad request" },
        );

        expect(component.form.invalid).toBeTrue();
        expect(component.form.errors).toEqual({
            invalid: "Unable to log in with provided credentials.",
        });
    });

    it("should accept valid input", () => {
        component.form.controls.username.setValue("user");
        component.form.controls.password.setValue("secretpassword");

        const routerSpy = spyOn(router, "navigate");

        // toSignal lets us inspect the latest value of an Observable.
        // It basically turns it into a BehaviorSubject.
        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$),
        );

        component.submit();
        expect(loading()).toBeTrue();
        expect(component.form.valid).toBeTrue();

        const req = httpTestingController.expectOne("/users/login/");
        req.flush({ key: "abcdefghijklmnopqrstuvwxyz" });

        expect(loading()).toBeFalse();
        expect(toastService.toasts.length).toBe(1);
        expect(routerSpy).toHaveBeenCalledWith(["/"]);
    });
});
