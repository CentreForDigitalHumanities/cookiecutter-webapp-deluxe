import { TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { App } from './app';

describe('App', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                App, NoopAnimationsModule, RouterTestingModule, HttpClientTestingModule]
        }).compileComponents();
    }));


    it('should create the app', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title '{{cookiecutter.project_title}}'`, () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual(`{{cookiecutter.project_title}}`);
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(App);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.navbar-brand').textContent).toContain('{{cookiecutter.project_title}}');
    });
});
