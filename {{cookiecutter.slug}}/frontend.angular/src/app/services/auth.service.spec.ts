import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth.service';
import { SessionService } from './session.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [SessionService],
        });
        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
