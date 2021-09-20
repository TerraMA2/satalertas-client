import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpErrorResponse, HttpStatusCode
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';
import { Event } from '@angular/router';
import { Response } from '../models/response.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

	constructor(
		private messageService: MessageService,
		private translateService: TranslateService,
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Response>> {
		return next.handle(req).pipe(
			retry(1),
			catchError((httpErrorResponse: HttpErrorResponse) => {
				const error = httpErrorResponse.error;
				let response: Response;
				let message = '';
				if (error instanceof Event) {
					message = 'Server connection error';
					response = {
						status: null,
						data: null,
						message: httpErrorResponse.message
					};
				} else {
					message = error.message;
					response = error;
					if (response.status === HttpStatusCode.InternalServerError) {
						message = 'Server error';
					}
				}
				this.translateService.get(message).subscribe(translatedString => {
					this.messageService.add({ severity: 'error', summary: '', detail: translatedString });
				});
				return throwError(response);
			})
		)
	}
}
