import { inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthApi } from "../services/auth-api";
import { filter, map } from "rxjs";
import { ToastStore } from "../services/toast-store";
import { isPlatformBrowser } from "@angular/common";

export const LoggedOnGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authApi = inject(AuthApi);
    const toastStore = inject(ToastStore);
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);

    return authApi.currentUser$.pipe(
        filter((user) => user !== undefined),
        map((user) => {
            if (user === null) {
                if (isPlatformBrowser(platformId)) {
                    toastStore.show({
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
