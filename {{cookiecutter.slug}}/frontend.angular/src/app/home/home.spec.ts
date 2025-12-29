import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Home } from './home';

describe('Home', () => {
    let component: Home;
    let fixture: ComponentFixture<Home>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [Home, HttpClientTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Home);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
