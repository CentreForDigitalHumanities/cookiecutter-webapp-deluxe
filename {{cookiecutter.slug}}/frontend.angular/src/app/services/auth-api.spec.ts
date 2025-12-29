import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AuthApi } from "./auth-api";
import { SessionService } from "./session.service";

describe("AuthApi", () => {
    let authApi: AuthApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [SessionService],
        });
        authApi = TestBed.inject(AuthApi);
    });

    it("should be created", () => {
        expect(authApi).toBeTruthy();
    });
});
