import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable, Injector, ErrorHandler } from '@angular/core';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError = (error: Error | HttpErrorResponse) => {
        const router = this.injector.get(Router);
        let errorString = '';

        if (error instanceof HttpErrorResponse) {
            if (!navigator.onLine) {
                errorString = `No internet connection`;
            }
            if (error.error.message) {
                errorString = `${error.error.message}`;
            }
            console.error(errorString);
        } else {
            console.error(error);
            router.navigate(['/error'], { queryParams: { error } });
        }
    }
}
