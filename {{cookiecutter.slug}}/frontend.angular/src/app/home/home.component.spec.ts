import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendService } from '../services/backend.service';

import { HomeComponent } from './home.component';

type BackendServiceInterface = {
    [key in keyof BackendService]: BackendService[key];
};

class BackendServiceMock implements BackendServiceInterface {
    get(objectUrl: string): Promise<any> {
        return new Promise<string>(() => 'UNIT_TEST');
    }
    getApiUrl(): Promise<string> {
        return new Promise<string>(() => 'UNIT_TEST');
    }
}

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent],
            providers: [{
                provide: BackendService,
                useClass: BackendServiceMock
            }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
