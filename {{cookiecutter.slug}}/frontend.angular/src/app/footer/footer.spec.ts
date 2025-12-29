import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Footer } from './footer';

describe('Footer', () => {
    let component: Footer;
    let fixture: ComponentFixture<Footer>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [Footer, HttpClientTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Footer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
