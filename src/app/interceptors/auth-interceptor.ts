import { HttpClient, HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment'
import { Login } from '../Services/login';
import { Router } from '@angular/router';
export const authInterceptor: HttpInterceptorFn = (req:HttpRequest<any>, next:HttpHandlerFn) => {
  const http=inject(HttpClient)
  const authService=inject(Login)
  const router= inject(Router)

  const excludedPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/check_code',
    '/public/'
  ];
  
  // Check if the current request should be excluded
  const isExcluded = excludedPaths.some(path => req.url.includes(path));
  
  // If excluded, pass the request through without modification
  if (isExcluded) {
    return next(req);
  }

  const token=localStorage.getItem('token')
  const refreshTk=localStorage.getItem('refreshToken')
  let newReq = req;
  if(token && refreshTk){
    newReq=req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`,
        "Refresh-Token":refreshTk
      }
    })
  }
 return next(newReq).pipe(
  catchError((error: HttpErrorResponse) => {
    // Only handle actual error responses
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 && token) {
        console.warn('⚠️ Token expired — trying to refresh...');
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`,
              },
            });
            console.log('✅ Token refreshed. Retrying original request...');
            return next(newAuthReq);
          }),
          catchError(refreshError => {
            console.error('🚫 Refresh failed. Logging out...');
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      } else if (error.status === 401) {
        // Only navigate to login on 401 Unauthorized
        authService.logout();
        router.navigate(['auth/login']);
      }
    }
    return throwError(() => error);
  })
);
};