import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();
    console.log('jwt token ' + token);   if (token) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization",
          "Bearer " + token),
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(request);
    }
  }
}