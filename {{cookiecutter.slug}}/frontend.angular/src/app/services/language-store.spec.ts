import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LanguageStore } from './language-store';

describe('LanguageStore', () => {
    let store: LanguageStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        store = TestBed.inject(LanguageStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });
});
