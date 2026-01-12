import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Observable, of } from "rxjs";

import { UserSettings } from "./user-settings";
import { ToastStore } from "../../services/toast-store";
import { AuthApi } from "../../services/auth-api";
import { User } from "../models/user";

const fakeUser: User = {
    id: 1,
    email: "frodo@shire.me",
    firstName: "Frodo",
    lastName: "Baggins",
    username: "frodo",
    isStaff: false,
};

@Injectable({ providedIn: "root" })
class AuthApiMock extends AuthApi {
    public override currentUser$: Observable<User | null | undefined> =
        of(fakeUser);
}

describe("UserSettings", () => {
    let component: UserSettings;
    let fixture: ComponentFixture<UserSettings>;
    let toastStore: ToastStore;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: AuthApi,
                    useClass: AuthApiMock,
                },
                provideHttpClientTesting(),
            ],
        });
        toastStore = TestBed.inject(ToastStore);
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(UserSettings);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // Initial request to get the user data in AuthApi
        httpTestingController.expectOne("/users/user/").flush(fakeUser);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should patch the form with existing user data during OnInit", () => {
        expect(component.form.value).toEqual({
            id: 1,
            email: "frodo@shire.me",
            username: "frodo",
            firstName: "Frodo",
            lastName: "Baggins",
        });
    });

    it("should check missing input", () => {
        component.form.controls.username?.setValue("");
        component.submit();

        httpTestingController.expectNone("/users/user/");

        expect(component.form.controls.username?.invalid).toBe(true);
        expect(component.form.controls.username?.errors).toEqual({
            required: true,
        });
    });

    it("should handle an invalid username", () => {
        component.form.controls.username?.setValue("fb");
        component.submit();

        httpTestingController.expectNone("/users/user/");

        expect(component.form.controls.username?.invalid).toBe(true);
        expect(component.form.controls.username?.errors).toEqual({
            minlength: { requiredLength: 3, actualLength: 2 },
        });
    });

    it("should handle a username that is already taken", () => {
        component.form.controls.username?.setValue("frodo");
        component.submit();

        const req = httpTestingController.expectOne("/users/user/");
        req.flush(
            {
                username: ["A user with that username already exists."],
            },
            {
                status: 400,
                statusText: "Bad request",
            }
        );

        expect(component.form.invalid).toBe(true);
        expect(component.form.controls.username?.errors).toEqual({
            invalid: "A user with that username already exists.",
        });
    });

    it("should handle a password reset request", () => {
        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.requestResetLoading$)
        );

        component.requestPasswordReset();
        expect(loading()).toBe(true);

        const req = httpTestingController.expectOne("/users/password/reset/");
        req.flush({
            detail: "Password reset e-mail has been sent.",
        });

        expect(loading()).toBe(false);
        expect(toastStore.toasts.length).toBe(1);
    });

    it("should handle a user settings update", () => {
        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.updateSettingsLoading$)
        );

        component.form.controls.firstName.setValue("Bilbo");

        component.submit();
        expect(loading()).toBe(true);

        const req = httpTestingController.expectOne("/users/user/");
        req.flush({
            id: 1,
            username: "frodo",
            email: "frodo@shire.me",
            first_name: "Bilbo",
            last_name: "Baggins",
            is_staff: false,
        });

        expect(loading()).toBe(false);
        expect(toastStore.toasts.length).toBe(1);
        expect(component.form.controls.firstName.value).toBe("Bilbo");
    });

    it("should handle a username change", () => {
        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.updateSettingsLoading$)
        );

        component.form.controls.username?.setValue("Samwise");

        component.submit();
        expect(loading()).toBe(true);

        const req = httpTestingController.expectOne("/users/user/");
        req.flush({
            id: 1,
            username: "Samwise",
            email: "frodo@shire.me",
            first_name: "Frodo",
            last_name: "Baggins",
            is_staff: false,
        });

        expect(loading()).toBe(false);
        expect(toastStore.toasts.length).toBe(1);
        expect(component.form.controls.username?.value).toBe("Samwise");
    });

    it("should remove the username from the input if it's the same as the current username", () => {
        const loading = TestBed.runInInjectionContext(() =>
            toSignal(component.updateSettingsLoading$)
        );

        component.submit();
        expect(loading()).toBe(true);

        const req = httpTestingController.expectOne("/users/user/").request;
        expect(req.method).toBe("PATCH");
        expect(req.body).not.toContain("username");
    });
});
