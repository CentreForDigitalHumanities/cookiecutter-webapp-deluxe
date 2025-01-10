import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserSettingsComponent } from "./user-settings.component";
import { ToastService } from "@services/toast.service";
import { AuthService } from "@services/auth.service";
import { HttpTestingController } from "@angular/common/http/testing";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { User } from "../models/user";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

const fakeUser: User = {
    id: 1,
    email: 'frodo@shire.me',
    firstName: 'Frodo',
    lastName: 'Baggins',
    username: 'frodo',
    isStaff: false
}

@Injectable({ providedIn: 'root' })
class AuthServiceMock extends AuthService {
    public override currentUser$: Observable<User | null | undefined> = of(fakeUser);
}

describe("UserSettingsComponent", () => {
    let component: UserSettingsComponent;
    let fixture: ComponentFixture<UserSettingsComponent>;
    let toastService: ToastService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserSettingsComponent],
            providers: [{
                provide: AuthService,
                useClass: AuthServiceMock
            }],
            imports: [SharedTestingModule]
        });
        toastService = TestBed.inject(ToastService);
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(UserSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // Initial request to get the user data in AuthService
        httpTestingController.expectOne("/users/user/").flush(fakeUser);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should patch the form with existing user data during OnInit", () => {
        expect(component.form.value).toEqual({
            id: 1,
            email: 'frodo@shire.me',
            username: 'frodo',
            firstName: 'Frodo',
            lastName: 'Baggins'
        });
    });

    it("should check missing input", () => {
        component.form.controls.username?.setValue('');
        component.submit();

        httpTestingController.expectNone("/users/user/");

        expect(component.form.controls.username?.invalid).toBeTrue();
        expect(component.form.controls.username?.errors).toEqual({
            required: true
        });
    });

    it("should handle an invalid username", () => {
        component.form.controls.username?.setValue('fb');
        component.submit();

        httpTestingController.expectNone("/users/user/");

        expect(component.form.controls.username?.invalid).toBeTrue();
        expect(component.form.controls.username?.errors).toEqual({
            minlength: {requiredLength: 3, actualLength: 2}
        });
    });

    it("should handle a username that is already taken", () => {
        component.form.controls.username?.setValue('frodo');
        component.submit();

        const req = httpTestingController.expectOne("/users/user/");
        req.flush({
            username: ["A user with that username already exists." ]
        }, {
            status: 400, statusText: "Bad request"
        });

        expect(component.form.invalid).toBeTrue();
        expect(component.form.controls.username?.errors).toEqual({
            'invalid': 'A user with that username already exists.'
        });
    });

    it("should handle a password reset request", () => {
        const loading = TestBed.runInInjectionContext(() => toSignal(component.requestResetLoading$));

        component.requestPasswordReset();
        expect(loading()).toBeTrue()

        const req = httpTestingController.expectOne("/users/password/reset/");
        req.flush({
            detail: "Password reset e-mail has been sent."
        });

        expect(loading()).toBeFalse();
        expect(toastService.toasts.length).toBe(1);
    });

    it("should handle a user settings update", () => {
        const loading = TestBed.runInInjectionContext(() => toSignal(component.updateSettingsLoading$));

        component.form.controls.firstName.setValue('Bilbo');

        component.submit();
        expect(loading()).toBeTrue()

        const req = httpTestingController.expectOne("/users/user/");
        req.flush({
            "id": 1,
            "username": "frodo",
            "email": "frodo@shire.me",
            "first_name": "Bilbo",
            "last_name": "Baggins",
            "is_staff": false
        });

        expect(loading()).toBeFalse();
        expect(toastService.toasts.length).toBe(1);
        expect(component.form.controls.firstName.value).toBe('Bilbo');
    });

    it("should handle a username change", () => {
        const loading = TestBed.runInInjectionContext(() => toSignal(component.updateSettingsLoading$));

        component.form.controls.username?.setValue('Samwise');

        component.submit();
        expect(loading()).toBeTrue();

        const req = httpTestingController.expectOne("/users/user/");
        req.flush({
            "id": 1,
            "username": "Samwise",
            "email": "frodo@shire.me",
            "first_name": "Frodo",
            "last_name": "Baggins",
            "is_staff": false
        });

        expect(loading()).toBeFalse();
        expect(toastService.toasts.length).toBe(1);
        expect(component.form.controls.username?.value).toBe('Samwise');
    });

    it("should remove the username from the input if it's the same as the current username", () => {
        const loading = TestBed.runInInjectionContext(() => toSignal(component.updateSettingsLoading$));

        component.submit();
        expect(loading()).toBeTrue();

        const req = httpTestingController.expectOne("/users/user/").request;
        expect(req.method).toBe('PATCH');
        expect(req.body).not.toContain('username');
    });
});
