import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { UserMenuComponent } from "./user-menu.component";
import { AuthService } from "../../services/auth.service";
import {
    HttpClientTestingModule,
    HttpTestingController,
} from "@angular/common/http/testing";
import { UserResponse } from "../../user/models/user";
import { provideRouter } from "@angular/router";

const fakeUserResponse: UserResponse = {
    id: 1,
    username: "frodo",
    email: "frodo@shire.me",
    first_name: "Frodo",
    last_name: "Baggins",
    is_staff: false,
};

const fakeAdminResponse: UserResponse = {
    id: 1,
    username: "gandalf",
    email: "gandalf@istari.me",
    first_name: "Gandalf",
    last_name: "The Grey",
    is_staff: true,
};

describe("UserMenuComponent", () => {
    let component: UserMenuComponent;
    let fixture: ComponentFixture<UserMenuComponent>;
    let httpTestingController: HttpTestingController;

    const spinner = () => fixture.debugElement.query(By.css(".spinner-border"));
    const signInLink = () =>
        fixture.debugElement.query(By.css('a[href="/login"]'));
    const userDropdownTrigger = () =>
        fixture.debugElement.query(By.css("#userDropdown"));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService, provideRouter([])],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(UserMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it("should create", () => {
        httpTestingController.expectOne("/users/user/");
        expect(component).toBeTruthy();
    });

    it("should show sign-in when not logged in", () => {
        const req = httpTestingController.expectOne("/users/user/");
        req.flush(null);
        fixture.detectChanges();

        expect(spinner()).toBeFalsy();
        expect(signInLink()).toBeTruthy();
        expect(userDropdownTrigger()).toBeFalsy();
    });

    it("should show a loading spinner", () => {
        httpTestingController.expectOne("/users/user/");
        expect(spinner()).toBeTruthy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeFalsy();
    });

    it("should show an admin menu when user is a staff member", () => {
        const req = httpTestingController.expectOne("/users/user/");
        req.flush(fakeAdminResponse);
        fixture.detectChanges();

        expect(spinner()).toBeFalsy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeTruthy();
        expect(userDropdownTrigger().nativeElement.textContent).toContain(
            "gandalf"
        );
    });

    it("should show a user menu when logged in", () => {
        const req = httpTestingController.expectOne("/users/user/");
        req.flush(fakeUserResponse);
        fixture.detectChanges();

        expect(spinner()).toBeFalsy();
        expect(signInLink()).toBeFalsy();
        expect(userDropdownTrigger()).toBeTruthy();
    });
});
