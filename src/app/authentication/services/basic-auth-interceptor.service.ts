import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { catchError } from 'rxjs/operators';
import { Observable, EMPTY, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const URL_Server: string = 'http://localhost:8080';
    if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
      req = req.clone({
        url: URL_Server + req.url,
        setHeaders: {
          Authorization: sessionStorage.getItem('token')
        }

      })
    } else req = req.clone({ url: URL_Server + req.url });
    return next.handle(req)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.log(error)
        //todo
        let messageErr: string;
        switch (error.status) {
          case 404:
            messageErr = 'Запрашиваемый ресурс по адресу:\n' + error.url + '\n' + 'НЕ ДОСТУПЕН!';
            break;
          case 0:
            if (!this.authService.isUserLoggedIn()) return throwError(error);
            else {
              messageErr = 'Ваша сессия завершена \n Авторизируйтесь заново.';
              this.authService.logOut('start');
            }
            break;
          case 400:
              messageErr = 'Ошибка в параметрах запроса\n' + error.url
            break;
          default:
            return throwError(error);
        }
        alert('Ошибка: ' + error.status + '\n' + messageErr);
        return EMPTY;
      }));

  }
}
