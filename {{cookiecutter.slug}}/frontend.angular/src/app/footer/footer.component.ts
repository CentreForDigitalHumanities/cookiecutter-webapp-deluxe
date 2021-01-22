import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
    selector: '{{cookiecutter.app_prefix}}-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    environment = environment;

    constructor() { }

    ngOnInit(): void {
    }

}
