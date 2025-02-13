import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { map } from "rxjs";

@Component({
    selector: "{{cookiecutter.app_prefix}}-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
    standalone: true,
})
export class HomeComponent implements OnInit {
    public hooray?: string;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        // This call is executed on the server and in the browser.
        this.http
            .get<{ message: string }[]>(`/api/example/`)
            .pipe(map((hoorays) => hoorays[0].message))
            .subscribe((hooray) => {
                if (!this.hooray) {
                    this.hooray = hooray;
                }
            });
    }
}
