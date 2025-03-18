import { TestBed } from "@angular/core/testing";

import { TOAST_STYLES, ToastInput, ToastService } from "./toast.service";

describe("ToastService", () => {
    let service: ToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToastService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should show a toast", () => {
        const toastInput: ToastInput = {
            header: "Test Header",
            body: "Test Body",
            type: "success",
            delay: 3000,
        };

        const toast = service.show(toastInput);

        expect(service.toasts.length).toBe(1);
        expect(service.toasts[0]).toEqual({
            className: TOAST_STYLES["success"],
            header: "Test Header",
            body: "Test Body",
            delay: 3000,
        });
        expect(toast).toEqual(service.toasts[0]);
    });

    it("should remove a toast", () => {
        const toastInput: ToastInput = {
            header: "Test Header",
            body: "Test Body",
            type: "info",
            delay: 5000,
        };

        const toast = service.show(toastInput);
        service.remove(toast);

        expect(service.toasts.length).toBe(0);
    });

    it("should clear all toasts", () => {
        const toastInput1: ToastInput = {
            header: "Test Header 1",
            body: "Test Body 1",
            type: "warning",
            delay: 2000,
        };

        const toastInput2: ToastInput = {
            header: "Test Header 2",
            body: "Test Body 2",
            type: "danger",
            delay: 4000,
        };

        service.show(toastInput1);
        service.show(toastInput2);
        service.clear();

        expect(service.toasts.length).toBe(0);
    });
});
