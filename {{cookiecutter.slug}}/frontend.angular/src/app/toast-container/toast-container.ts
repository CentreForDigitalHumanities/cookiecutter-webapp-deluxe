import { Component, inject } from "@angular/core";
import { ToastStore, Toast } from "../services/toast-store";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "{{cookiecutter.app_prefix}}-toast-container",
    templateUrl: "./toast-container.html",
    styleUrl: "./toast-container.scss",
    imports: [NgbToastModule]
})
export class ToastContainer {
    private toastStore = inject(ToastStore);

    public toasts = this.toastStore.toasts;

    public removeToast(toast: Toast): void {
        this.toastStore.remove(toast);
    }
}
