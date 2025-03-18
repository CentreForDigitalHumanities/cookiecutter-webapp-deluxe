import { Component } from "@angular/core";
import { ToastService } from "../services/toast.service";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "{{cookiecutter.app_prefix}}-toast-container",
    templateUrl: "./toast-container.component.html",
    styleUrls: ["./toast-container.component.scss"],
    standalone: true,
    imports: [NgbToastModule]
})
export class ToastContainerComponent {
    constructor(public toastService: ToastService) {}
}
