import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VerifyEmailComponent } from "./verify-email.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { AuthService } from "@services/auth.service";
import { ToastService } from "@services/toast.service";
import { HttpTestingController } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";
import { toSignal } from "@angular/core/rxjs-interop";

describe("VerifyEmailComponent", () => {
    let component: VerifyEmailComponent;
    let fixture: ComponentFixture<VerifyEmailComponent>;
    let toastService: ToastService;
    let httpTestingController: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VerifyEmailComponent],
            providers: [AuthService],
            imports: [SharedTestingModule],
        });
        toastService = TestBed.inject(ToastService);
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(VerifyEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should handle a key info error", () => {
        const req = httpTestingController.expectOne('/users/registration/key-info/');

        req.flush('Confirmation key does not exist.', { status: 400, statusText: 'Bad request' });

        expect(toastService.toasts.length).toBe(1);

        fixture.detectChanges();
        const element = fixture.debugElement;
        expect(element.query(By.css('.no-user-details'))).toBeTruthy();
    });

    it("should handle a successful email verification", () => {
        const loading = TestBed.runInInjectionContext(() => toSignal(component.loading$));

        component.confirm();
        expect(loading()).toBeTrue();

        const req = httpTestingController.expectOne('/users/registration/verify-email/');
        req.flush({ detail: "ok" });

        expect(toastService.toasts.length).toBe(1);
        expect(toastService.toasts[0].header).toBe('Email verified');
        expect(loading()).toBeFalse();
    });

    it("should handle a failed email verification", () => {
        const loading = TestBed.runInInjectionContext(() => toSignal(component.loading$));

        component.confirm();
        expect(loading()).toBeTrue();

        const req = httpTestingController.expectOne('/users/registration/verify-email/');
        req.flush({
            detail: "Not found."
        }, { status: 404, statusText: "Not Found" });

        expect(toastService.toasts.length).toBe(1);
        expect(toastService.toasts[0].header).toBe('Email verification failed');
        expect(loading()).toBeFalse();
    });
});
