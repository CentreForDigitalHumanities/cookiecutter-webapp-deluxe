import { Component, OnInit, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";

@Component({
    selector: "{{cookiecutter.app_prefix}}-home",
    templateUrl: "./home.html",
    styleUrl: "./home.scss",
})
export class Home implements OnInit {
    private http = inject(HttpClient);

    public hooray?: string;

    ngOnInit(): void {
        this.http
            .get<{ message: string; }[]>(`/api/example/`)
            .pipe(map((hoorays) => hoorays[0].message))
            .subscribe((hooray) => {
                if (!this.hooray) {
                    this.hooray = hooray;
                }
            });
    }
}
