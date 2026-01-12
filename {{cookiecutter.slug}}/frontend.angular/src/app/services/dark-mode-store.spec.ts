import { TestBed } from '@angular/core/testing';

import { DarkModeStore } from './dark-mode-store';

describe('DarkModeStore', () => {
    let store: DarkModeStore;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        store = TestBed.inject(DarkModeStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });
});
