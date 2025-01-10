import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private sessionExpiredSubject = new Subject<void>();
    public expired = this.sessionExpiredSubject.asObservable();

    public markExpired() {
        this.sessionExpiredSubject.next();
    }
}
