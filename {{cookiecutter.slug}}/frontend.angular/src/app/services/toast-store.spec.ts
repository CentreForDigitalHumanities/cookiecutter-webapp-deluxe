import { TestBed } from "@angular/core/testing";

import { TOAST_STYLES, ToastInput, ToastStore } from "./toast-store";

describe("ToastStore", () => {
    let store: ToastStore;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        store = TestBed.inject(ToastStore);
    });

    it("should be created", () => {
        expect(store).toBeTruthy();
    });

    it("should show a toast", () => {
        const toastInput: ToastInput = {
            header: "Test Header",
            body: "Test Body",
            type: "success",
            delay: 3000,
        };

        const toast = store.show(toastInput);

        expect(store.toasts.length).toBe(1);
        expect(store.toasts[0]).toEqual({
            className: TOAST_STYLES["success"],
            header: "Test Header",
            body: "Test Body",
            delay: 3000,
        });
        expect(toast).toEqual(store.toasts[0]);
    });

    it("should remove a toast", () => {
        const toastInput: ToastInput = {
            header: "Test Header",
            body: "Test Body",
            type: "info",
            delay: 5000,
        };

        const toast = store.show(toastInput);
        store.remove(toast);

        expect(store.toasts.length).toBe(0);
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

        store.show(toastInput1);
        store.show(toastInput2);
        store.clear();

        expect(store.toasts.length).toBe(0);
    });
});
