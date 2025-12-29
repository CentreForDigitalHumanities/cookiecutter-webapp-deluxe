import { TestBed } from "@angular/core/testing";
import { SessionStore } from "./session-store";

describe("SessionStore", () => {
    let store: SessionStore;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        store = TestBed.inject(SessionStore);
    });

    it("should be created", () => {
        expect(store).toBeTruthy();
    });
});
