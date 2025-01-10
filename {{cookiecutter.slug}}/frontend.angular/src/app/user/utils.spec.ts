import { TestBed } from "@angular/core/testing";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User, UserResponse } from "./models/user";
import {
    parseUserData,
    encodeUserData,
    setErrors,
    controlErrorMessages$,
    formErrorMessages$,
    updateFormValidity,
} from "./utils";
import { toSignal } from "@angular/core/rxjs-interop";

describe("User utils", () => {
    let form: FormGroup;
    beforeEach(() => {
        form = new FormGroup({
            username: new FormControl<string>("", {
                validators: [Validators.required],
            }),
            email: new FormControl<string>("", {
                validators: [Validators.required, Validators.email],
            }),
        });
    });

    describe("parseUserData", () => {
        it("should return null if result is null", () => {
            const result: UserResponse | null = null;
            const user = parseUserData(result);
            expect(user).toBeNull();
        });

        it("should return a User object if result is not null", () => {
            const result: UserResponse = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                first_name: "Test",
                last_name: "User",
                is_staff: true,
            };
            const user = parseUserData(result);
            expect(user).toBeInstanceOf(User);
            expect(user?.id).toBe(1);
            expect(user?.username).toBe("testuser");
            expect(user?.email).toBe("test@example.com");
            expect(user?.firstName).toBe("Test");
            expect(user?.lastName).toBe("User");
            expect(user?.isStaff).toBe(true);
        });
    });

    describe("encodeUserData", () => {
        it("should encode partial User data to UserResponse object", () => {
            const data: Partial<User> = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                firstName: "Test",
                lastName: "User",
                isStaff: true,
            };
            const encoded = encodeUserData(data);
            expect(encoded).toEqual({
                id: 1,
                username: "testuser",
                email: "test@example.com",
                first_name: "Test",
                last_name: "User",
                is_staff: true,
            });
        });
    });

    describe("setErrors", () => {
        it("should set errors on associated controls", () => {
            const errorObject = {
                username: "Username is required.",
                email: "Email is invalid.",
            };
            setErrors(errorObject, form);
            expect(form.get("username")?.errors).toEqual({
                invalid: "Username is required.",
            });
            expect(form.get("email")?.errors).toEqual({
                invalid: "Email is invalid.",
            });
        });

        it("should set errors on the form itself for non-associated controls", () => {
            const errorObject = {
                random: "Passwords must be identical.",
            };
            setErrors(errorObject, form);
            expect(form.errors).toEqual({
                invalid: "Passwords must be identical.",
            });
        });
    });

    describe("controlErrorMessages$", () => {
        it("should return an Observable of error messages for a specific control", () => {
            const usernameMessages = TestBed.runInInjectionContext(() =>
                toSignal(controlErrorMessages$(form, "username")),
            );

            form.get("username")?.updateValueAndValidity();

            expect(usernameMessages()).toEqual(["Username is required."]);
        });

        it("should use errors based on a provided lookup name", () => {
            const usernameMessages = TestBed.runInInjectionContext(() =>
                toSignal(controlErrorMessages$(form, "username", "email")),
            );

            form.get("username")?.updateValueAndValidity();

            expect(usernameMessages()).toEqual(["Email is required."]);
        });
    });

    describe("formErrorMessages$", () => {
        it("should return an Observable of error messages for the form", () => {
            const formMessages = TestBed.runInInjectionContext(() =>
                toSignal(formErrorMessages$(form)),
            );

            form.updateValueAndValidity();

            expect(formMessages()?.length).toBe(0);

            form.setErrors({ random: "This is a random error." });

            expect(formMessages()).toEqual(["This is a random error."]);
        });
    });

    describe("updateFormValidity", () => {
        it("should update the validity of all controls in the form", () => {
            form.controls["username"].setErrors({
                invalid: "Username is required.",
            });
            form.controls["email"].setErrors({ invalid: "Email is invalid." });
            updateFormValidity(form);
            expect(form.controls["username"].valid).toBe(false);
            expect(form.controls["email"].valid).toBe(false);
            expect(form.valid).toBe(false);
        });
    });
});
