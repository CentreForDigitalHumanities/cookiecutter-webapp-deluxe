import { TestBed } from '@angular/core/testing';

import { LanguageStore } from './language-store';

describe('LanguageStore', () => {
    let store: LanguageStore;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        store = TestBed.inject(LanguageStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });
});
