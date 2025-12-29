import { Component, inject } from "@angular/core";
import { ToastService } from "../services/toast.service";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "{{cookiecutter.app_prefix}}-toast-container",
    templateUrl: "./toast-container.html",
    styleUrls: ["./toast-container.scss"],
    imports: [NgbToastModule]
})
export class ToastContainer {
    private toastService = inject(ToastService);
}
