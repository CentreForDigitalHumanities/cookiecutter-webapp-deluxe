import { Component, OnInit } from '@angular/core';
import { BackendService } from './../services/backend.service';

@Component({
  selector: '{{cookiecutter.app_prefix}}-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    hooray: string;

    constructor(private backend: BackendService) { }

    ngOnInit() {
        // This is just an example call to /api/whatever
        // Note that the backend service doesn't call the backend yet
        // and simply returns some mock data
        this.backend.get('whatever').then(hoorays => {
            if (hoorays.length) {
                this.hooray = hoorays[0].message;
            }
        });
    }

}
