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

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

	constructor(
		private messageService: MessageService
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Response>> {
		return next.handle(req).pipe(
			retry(1),
			catchError((errorResponse: HttpErrorResponse) => {
				const error = errorResponse.error;
				let response: Response;
				let message = '';
				if (error instanceof Event) {
					message = 'Erro na conexão com o servidor';
					response = {
						status: null,
						data: null,
						message: errorResponse.message
					};
				} else {
					message = error.message;
					response = error;
					if (response.status === HttpStatusCode.InternalServerError) {
						message = 'Erro no servidor';
					}
				}
				if (!environment.production) {
					console.log(error);
				}
				this.messageService.add({ severity: 'error', summary: '', detail: message });
				return throwError(response);
			})
		)
	}
}
