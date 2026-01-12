import { Component, computed } from "@angular/core";
import { httpResource } from "@angular/common/http";

@Component({
    selector: "dh-home",
    templateUrl: "./home.html",
    styleUrl: "./home.scss",
})
export class Home {
    private hooraySource = httpResource<{ message: string; }[]>(() => '/api/example/');

    public hooray = computed(() => {
        const hoorayResult = this.hooraySource.value();
        return hoorayResult ? hoorayResult[0].message : '';
    });
}
