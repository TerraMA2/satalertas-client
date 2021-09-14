import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor,HttpRequest,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Response } from '../models/response.model';
import { Event } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

	constructor(
		private messageService: MessageService
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			retry(1),
			catchError((errorResponse: HttpErrorResponse) => {
				let status = errorResponse.status;
				const statusText = errorResponse.statusText;
				const error = errorResponse.error;
				const message = errorResponse.message;
				let errorMessage = `${status} - ${statusText} - ${message}`;
				if (error instanceof Event) {
					status = null;
					errorMessage = message;
				}
				if (!environment.production) {
					console.log(errorResponse);
				}
				const response: Response = {
					status,
					data: null,
					message: errorMessage
				}
				this.messageService.add({ severity: 'error', summary: 'Erro de acesso', detail: `Ocorreu um erro ao acessar o servidor` });
				return throwError(response);
			})
		)
	}
}
