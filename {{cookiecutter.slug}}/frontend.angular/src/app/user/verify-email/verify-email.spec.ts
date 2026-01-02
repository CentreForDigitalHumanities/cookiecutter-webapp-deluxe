import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";
import { toSignal } from "@angular/core/rxjs-interop";
import { provideRouter } from "@angular/router";

import { VerifyEmail } from "./verify-email";
import { AuthApi } from "../../services/auth-api";
import { ToastStore } from "../../services/toast-store";

describe("VerifyEmail", () => {
    let component: VerifyEmail;
    let fixture: ComponentFixture<VerifyEmail>;
    let toastStore: ToastStore;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, provideRouter([]), provideHttpClientTesting()],
        });
        toastStore = TestBed.inject(ToastStore);
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(VerifyEmail);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should handle a key info error", () => {
        const req = httpTestingController.expectOne(
            "/users/registration/key-info/"
        );

        req.flush("Confirmation key does not exist.", {
            status: 400,
            statusText: "Bad request",
        });

        expect(toastStore.toasts.length).toBe(1);

        fixture.detectChanges();
        const element = fixture.debugElement;
        expect(element.query(By.css(".no-user-details"))).toBeTruthy();
    });

    it("should handle a successful email verification", () => {
        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$)
        );

        component.confirm();
        expect(loading()).toBe(true);

        const req = httpTestingController.expectOne(
            "/users/registration/verify-email/"
        );
        req.flush({ detail: "ok" });

        expect(toastStore.toasts.length).toBe(1);
        expect(toastStore.toasts[0].header).toBe("Email verified");
        expect(loading()).toBe(false);
    });

    it("should handle a failed email verification", () => {
        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.loading$)
        );

        component.confirm();
        expect(loading()).toBe(true);

        const req = httpTestingController.expectOne(
            "/users/registration/verify-email/"
        );
        req.flush(
            {
                detail: "Not found.",
            },
            { status: 404, statusText: "Not Found" }
        );

        expect(toastStore.toasts.length).toBe(1);
        expect(toastStore.toasts[0].header).toBe("Email verification failed");
        expect(loading()).toBe(false);
    });
});
