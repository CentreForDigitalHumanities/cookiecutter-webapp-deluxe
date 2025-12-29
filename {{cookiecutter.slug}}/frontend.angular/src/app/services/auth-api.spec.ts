import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AuthApi } from "./auth-api";
import { SessionStore } from "./session-store";

describe("AuthApi", () => {
    let authApi: AuthApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [SessionStore],
        });
        authApi = TestBed.inject(AuthApi);
    });

    it("should be created", () => {
        expect(authApi).toBeTruthy();
    });
});
