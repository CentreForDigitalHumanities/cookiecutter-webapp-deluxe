import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { PLATFORM_ID, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { isPlatformServer } from "@angular/common";

/**
 * Intercepts HTTP requests and modifies the request URL based on the platform.
 *
 * This interceptor checks if the code is running on the server side. If it is,
 * it prepends the API base URL to the request URL.
 *
 * If the code is running in the browser, the request is passed as is. In dev
 * mode, the request will be proxied by proxy.conf.json.
 *
 * This is a workaround for the Angular CLI not supporting proxying in the SSR
 * dev server. A fix is currently in developer preview (Jan 2025):
 * https://github.com/angular/angular-cli/issues/27144
 *
 * @param req - The outgoing HTTP request.
 * @param next - The next handler in the HTTP request chain.
 * @returns An observable of the HTTP event stream.
 */
export function platformInterceptor(
    req: HttpRequest<any>,
    next: HttpHandlerFn
) {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
        const apiReq = req.clone({
            url: `${environment.baseUrl}${req.url}`,
        });
        return next(apiReq);
    }

    return next(req);
}
