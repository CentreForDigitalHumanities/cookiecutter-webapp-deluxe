import { Component, inject } from "@angular/core";
import { ToastStore } from "../services/toast-store";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "{{cookiecutter.app_prefix}}-toast-container",
    templateUrl: "./toast-container.html",
    styleUrls: ["./toast-container.scss"],
    imports: [NgbToastModule]
})
export class ToastContainer {
    private toastStore = inject(ToastStore);

    public toasts = this.toastStore.toasts;
}
