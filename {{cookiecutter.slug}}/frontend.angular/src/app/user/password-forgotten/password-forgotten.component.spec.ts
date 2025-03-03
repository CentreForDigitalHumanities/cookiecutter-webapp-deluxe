import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PasswordForgottenComponent } from "./password-forgotten.component";
import {
    HttpClientTestingModule,
    HttpTestingController,
} from "@angular/common/http/testing";
import { toSignal } from "@angular/core/rxjs-interop";
import { ToastService } from "../../services/toast.service";

describe("PasswordForgottenComponent", () => {
    let component: PasswordForgottenComponent;
    let fixture: ComponentFixture<PasswordForgottenComponent>;
    let httpTestingController: HttpTestingController;
    let toastService: ToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        fixture = TestBed.createComponent(PasswordForgottenComponent);
        httpTestingController = TestBed.inject(HttpTestingController);
        toastService = TestBed.inject(ToastService);
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
