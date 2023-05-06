import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../static/app-constants';
import { ServiceAuth } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: ServiceAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (
      request.url.includes('user/signin') || 
      request.url.includes('api/ipackage') || 
      request.url.includes('api/registerbranch') || 
      // request.url.includes('api/getstatus') || 
      request.url.includes('api/countries') || 
      request.url.includes('api/currency') || 
      request.url.includes('api/branch/signin') || 
      request.url.includes('api/checkuser') || 
      request.url.includes('api/checkstorename') || 
      request.url.includes('api/accountverification') || 
      request.url.includes('api/accountvalidation') ||
      request.url.includes('api/gethq') ||
      request.url.includes('api/portalaccountvalidation') ||
      request.url.includes('api/account/resetpassword') ||
      request.url.includes(AppConstants.AUDIT_URL)
    ) { 
      
      // FOR UNAUTHENTICATED END-POINTS.
      request = request.clone({ url: `${request.url}` });
    
    
    } else {
      
      // FOR AUTHORIZED END-POINTS.
      request = request.clone({
        setHeaders: {
          'Access-Control-Allow-Origin':'*',
          Authorization: `Bearer  ${this.getToken()}` 
        }
      });
    }

    return next.handle(request);
  
  }

  /* METHOD TO GET TOKEN FORM THE LOCALSTORAGE. */
  getToken() {
    return this.authService.getValidToken();
  }

}
