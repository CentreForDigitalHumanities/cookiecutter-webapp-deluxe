import { inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthApi } from "../services/auth-api";
import { filter, map } from "rxjs";
import { ToastService } from "../services/toast.service";
import { isPlatformBrowser } from "@angular/common";

export const LoggedOnGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthApi);
    const toastService = inject(ToastService);
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        filter((user) => user !== undefined),
        map((user) => {
            if (user === null) {
                if (isPlatformBrowser(platformId)) {
                    toastService.show({
                        header: $localize`Not signed in`,
                        body: $localize`You must be signed in to view this page.`,
                        type: "danger",
                    });
                }
                return router.createUrlTree(["/login"], {
                    queryParams: { next: route.url },
                });
            }
            return true;
        })
    );
};
