import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterComponent } from "./register.component";
import { HttpTestingController } from "@angular/common/http/testing";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { Router } from "@angular/router";
import { ToastService } from "@services/toast.service";
import { toSignal } from "@angular/core/rxjs-interop";

describe("RegisterComponent", () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let httpTestingController: HttpTestingController;
    let router: Router;
    let toastService: ToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [SharedTestingModule]
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        toastService = TestBed.inject(ToastService);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check missing input", () => {
        component.submit();

        httpTestingController.expectNone("/users/registration/");

        expect(component.form.controls.username.invalid).toBeTrue();
        expect(component.form.controls.username.errors).toEqual({
            required: true,
        });

        expect(component.form.controls.email.invalid).toBeTrue();
        expect(component.form.controls.email.errors).toEqual({
            required: true,
        });

        expect(component.form.controls.password1.invalid).toBeTrue();
        expect(component.form.controls.password1.errors).toEqual({
            required: true,
        });

        expect(component.form.controls.password2.invalid).toBeTrue();
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

        expect(component.form.invalid).toBeTrue();
        expect(component.form.errors).toEqual({
            passwords: true,
        });
    });

    it("should handle valid input", () => {
        component.form.controls.username.setValue("frodo");
        component.form.controls.email.setValue("frodo@shire.me");
        component.form.controls.password1.setValue("theonering");
        component.form.controls.password2.setValue("theonering");

        const routerSpy = spyOn(router, "navigate");

        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$),
        );

        component.submit();
        expect(loading()).toBeTrue();
        expect(component.form.valid).toBeTrue();

        const req = httpTestingController.expectOne("/users/registration/");
        req.flush(null);

        expect(loading()).toBeFalse();
        expect(toastService.toasts.length).toBe(1);
        expect(routerSpy).toHaveBeenCalledWith(["/"]);
    });

    it("should handle trying to register with an existing username", () => {
        component.form.controls.username.setValue("frodo");
        component.form.controls.email.setValue("frodo@shire.me");
        component.form.controls.password1.setValue("theonering");
        component.form.controls.password2.setValue("theonering");

        const routerSpy = spyOn(router, "navigate");

        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$),
        );

        component.submit();
        expect(loading()).toBeTrue();
        expect(component.form.valid).toBeTrue();

        const req = httpTestingController.expectOne("/users/registration/");
        req.flush({"username":["A user with that username already exists."]}, { status: 400, statusText: "Bad request" });

        expect(loading()).toBeFalse();
        expect(toastService.toasts.length).toBe(0);
        expect(routerSpy).not.toHaveBeenCalled();
        expect(component.form.controls.username.errors).toEqual({ invalid: 'A user with that username already exists.' });
    });
});
