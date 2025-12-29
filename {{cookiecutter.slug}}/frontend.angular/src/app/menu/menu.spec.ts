import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Menu } from './menu';

describe('Menu', () => {
    let component: Menu;
    let fixture: ComponentFixture<Menu>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                Menu,
                NoopAnimationsModule,
                RouterTestingModule,
                HttpClientTestingModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Menu);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
