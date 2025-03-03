import { Injectable } from "@angular/core";

export type ToastType = "success" | "info" | "warning" | "danger";

export interface Toast {
    header: string;
    body: string;
    className: string;
    delay: number;
}

export interface ToastInput {
    header: string;
    body: string;
    type?: ToastType;
    delay?: number;
}

export const TOAST_STYLES: Record<ToastType, string> = {
    success: "text-bg-success",
    info: "text-bg-info",
    warning: "text-bg-warning",
    danger: "text-bg-danger",
};

@Injectable({
    providedIn: "root",
})
export class ToastService {
    public toasts: Toast[] = [];

    public show(toastInput: ToastInput): Toast {
        const type = toastInput.type || "info";
        const toast: Toast = {
            className: TOAST_STYLES[type],
            header: toastInput.header,
            body: toastInput.body,
            delay: toastInput.delay || 5000,
        };
        this.toasts.push(toast);
        return toast;
    }

    public remove(toast: Toast): void {
        this.toasts = this.toasts.filter((t) => t !== toast);
    }

    public clear(): void {
        this.toasts = [];
    }
}
