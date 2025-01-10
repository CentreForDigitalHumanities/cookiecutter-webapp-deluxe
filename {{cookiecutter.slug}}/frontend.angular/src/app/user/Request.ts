import { HttpClient } from "@angular/common/http";
import { Observable, OperatorFunction, Subject, catchError, filter, map, merge, of, share, startWith, switchMap, throttleTime } from "rxjs";


export type HttpVerb = 'get' | 'post' | 'patch' | 'delete';
export type RequestError = { error: Record<string, string | string[]>; };


/**
 * Represents a HTTP request made to the application backend.
 *
 * Contains the following properties:
 * - `subject`: The subject used to emit input values for the request.
 * - `result$`: Emits the raw result or error of the request.
 * - `error$`: Emits the error of the request.
 * - `success$`: Emits when the request is successful.
 *
 * @template Input The type of the request input.
 * @template Result The type of the request result.
 */
export class Request<Input, Result extends object | never> {
    public subject: Subject<Input>;
    public result$: Observable<Result | RequestError>;
    public error$: Observable<RequestError>;
    public success$: Observable<Result>;
    public loading$: Observable<boolean>;

    /**
     * Creates an instance of AuthRequest.
     * @param http The HttpClient instance used to make the HTTP request.
     * @param route The route for the request.
     * @param verb The HTTP verb for the request.
     */
    constructor(
        private http: HttpClient,
        private route: string,
        private verb: HttpVerb
    ) {
        this.subject = new Subject<Input>();

        // Catches errors and returns them as a RequestError object.
        const catchToError: OperatorFunction<Result, Result | RequestError> = catchError(error => of<RequestError>({ error: error.error }));

        this.result$ = this.subject.pipe(
            throttleTime(500),
            switchMap(input => {
                switch (this.verb) {
                    case "get":
                        return this.http.get<Result>(this.route).pipe(catchToError);
                    case "post":
                        return this.http.post<Result>(this.route, input).pipe(catchToError);
                    case "patch":
                        return this.http.patch<Result>(this.route, input).pipe(catchToError);
                    case "delete":
                        return this.http.delete<Result>(this.route).pipe(catchToError);
                }
            }),
            share()
        );

        this.success$ = this.result$.pipe(
            filter((result): result is Result => result ? !('error' in result) : true)
        );

        this.error$ = this.result$.pipe(
            filter((result): result is RequestError => result && 'error' in result)
        );

        this.loading$ = merge(
            this.subject.pipe(map(() => true)),
            this.result$.pipe(map(() => false))
        ).pipe(
            startWith(false),
        );
    }
}
