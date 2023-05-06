import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { ServiceAuth } from '../services/auth.service';
import { StorageConstants } from '../static/storage_constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: ServiceAuth,
    private router: Router,
  ) { }

  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  // canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   let url = childRoute.pathFromRoot
  //     .map(v => v.url.map(segment => segment.toString()).join('/'))
  //     .join('/');
  //   let menus: string[] = JSON.parse(localStorage.getItem(StorageConstants.ALLOWED_MENU_ROUTES));
  //   if (!menus.includes(url)) {
  //     this.router.navigate(['unauth']);
  //     return false; 
  //   }
  //   return true;
  // }

}