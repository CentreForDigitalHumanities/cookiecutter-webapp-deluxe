import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { ConfigService } from './config.service';

describe('BackendService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            ConfigService,
            {
                provide: HttpClient,
                useValue: {}
            }
        ]
    }));

    it('should be created', () => {
        const service = TestBed.inject(BackendService);
        expect(service).toBeTruthy();
    });
});
