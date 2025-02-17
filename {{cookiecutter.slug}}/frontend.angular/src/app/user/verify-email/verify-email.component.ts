import { AfterViewInit, Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { map, share } from "rxjs";
import { KeyInfo } from "../models/user";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "lc-verify-email",
    templateUrl: "./verify-email.component.html",
    styleUrls: ["./verify-email.component.scss"],
    standalone: true,
    imports: [CommonModule],
})
export class VerifyEmailComponent implements OnInit, AfterViewInit {
    private key: KeyInfo = { key: this.activatedRoute.snapshot.params["key"] };

    public userDetails$ = this.authService.keyInfo.result$.pipe(
        map((results) => ("error" in results ? null : results)),
        share()
    );

    public loading$ = this.authService.verifyEmail.loading$;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.authService.keyInfo.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                alert("Failed to verify email address.");
            });

        this.authService.verifyEmail.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => alert("Failed to verify email address."));

        this.authService.verifyEmail.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                alert("Email address has been verified.");
                this.router.navigate(["/"]);
            });
    }

    // We are subscribing to results of this call in the template, so we should
    // only start listening after the view has been initialized.
    ngAfterViewInit(): void {
        this.authService.keyInfo.subject.next(this.key);
    }

    public confirm(): void {
        this.authService.verifyEmail.subject.next(this.key);
    }
}
