import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { AuthApi } from "./auth-api";

describe("AuthApi", () => {
    let authApi: AuthApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
        authApi = TestBed.inject(AuthApi);
    });

    it("should be created", () => {
        expect(authApi).toBeTruthy();
    });
});
