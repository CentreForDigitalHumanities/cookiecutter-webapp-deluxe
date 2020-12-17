import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {
                provide: HttpClient,
                useValue: {}
            }
        ]
    }));

    it('should be created', () => {
        const service = TestBed.inject(ConfigService);
        expect(service).toBeTruthy();
    });
});
