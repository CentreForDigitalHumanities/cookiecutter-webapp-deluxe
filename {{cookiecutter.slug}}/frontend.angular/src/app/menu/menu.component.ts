import { Component, NgZone } from '@angular/core';
import { animations, showState } from '../animations';

@Component({
    animations,
    selector: '{{cookiecutter.app_prefix}}-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    burgerShow: showState;
    burgerActive = false;

    constructor(private ngZone: NgZone) {
        const isDesktop = window.matchMedia("screen and (min-width: 1024px)").matches
        this.burgerShow = isDesktop ? 'show' : 'hide';
    }

    toggleBurger() {
        this.burgerActive = !this.burgerActive;

        if (this.burgerActive) {
            // immediately hide it
            this.burgerShow = 'hide';
            setTimeout(() => {
                this.ngZone.run(() => {
                    // trigger the transition
                    this.burgerShow = 'show';
                });
            });
            return;
        }

        this.burgerShow = this.burgerShow === 'show' ? 'hide' : 'show';
    }
}
