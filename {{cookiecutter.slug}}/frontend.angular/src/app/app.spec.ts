import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
    });


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
