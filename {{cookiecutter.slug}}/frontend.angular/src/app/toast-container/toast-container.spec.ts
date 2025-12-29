import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ToastContainer } from "./toast-container";

describe("ToastContainer", () => {
    let component: ToastContainer;
    let fixture: ComponentFixture<ToastContainer>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        fixture = TestBed.createComponent(ToastContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
