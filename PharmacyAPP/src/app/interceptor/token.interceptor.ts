import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { TokenApiModel } from '../models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private toast: NgToastService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const myToken = this.auth.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }
      })
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            /*this.toast.warning({ detail: 'Unauthorized. Please log in again.' });
            this.auth.signOut();
            this.router.navigate(['/login']);*/
            return this.handleUnAuthorizedError(request, next);

          }
        }
        return throwError(err);
      })
    );
  }
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokeApiModel = new TokenApiModel();
    tokeApiModel.accessToken = this.auth.getToken()!;
    tokeApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokeApiModel)
      .pipe(
        switchMap((data: TokenApiModel) => {
          this.auth.storeRefreshToken(data.refreshToken);
          this.auth.storeToken(data.accessToken);
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${data.accessToken}` }  // "Bearer "+myToken
          })
          return next.handle(req);
        }),
        catchError((err) => {
          return throwError(() => {
            this.toast.warning({ detail: "Warning", summary: "Token is expired, Please Login again" });
            this.router.navigate(['login'])
          })
        })
      )
  }
}







/*import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService,private toast:NgToastService,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const myToken = this.auth.getToken();

    // this.start.load();
    if (myToken) {
      const cloned = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` } // "Bearer "+myToken
      });
      return next.handle(cloned);
    } else {
      return next.handle(request).pipe(
        catchError((err: any) => {
          if (err instanceof HttpResponse) {
            if (err.status === 401) {
              this.toast.warning({ detail: "Warning", summary: "Token is expired, Please Login again" });
              this.router.navigate(['login'])
            }
          }
          return throwError(()=> new Error("Some other error occured"))
        })
      );
    }
  }
}*/


//if (myToken) {
//  const cloned = request.clone({
//    setHeaders: { Authorization: `Bearer ${myToken}` } // "Bearer "+myToken
//  });
//  return next.handle(cloned);
//} else {
//  return next.handle(request);
