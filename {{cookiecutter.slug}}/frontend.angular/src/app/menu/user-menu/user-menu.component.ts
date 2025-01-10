import { Component, DestroyRef, OnInit } from '@angular/core';
import { filter, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: "{{cookiecutter.app_prefix}}-user-menu",
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
    imports: [RouterModule, CommonModule, FontAwesomeModule],
    standalone: true
})
export class UserMenuComponent implements OnInit {
    public authLoading$ = this.authService.currentUser$.pipe(
        map(user => user === undefined)
    );

    public user$ = this.authService.currentUser$;

    public showSignIn$ = this.authService.currentUser$.pipe(map(user => user === null));

    public logoutLoading$ = this.authService.logout.loading$;

    public currentPath$ = this.router.routerState.root.url.pipe(
        map((url) => url.pop() ?? null),
        filter(url => url?.toString() !== "")
    );

    public faUser = faUser;

    constructor(
        private authService: AuthService,
        private router: Router,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.authService.logout.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                window.alert('Sign out failed!');
            });

        this.authService.logout.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.router.navigate(['/']);
            });
    }

    public logout(): void {
        this.authService.logout.subject.next();
    }
}
