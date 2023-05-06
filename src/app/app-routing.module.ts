import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { AppComponent } from './app.component';
import { StorageConstants } from './core/static/storage_constants';

const getUserType = () => {
  return localStorage.getItem(StorageConstants.USER_TYPE);
}
// console.log("getUserType")
// console.log(getUserType())

const getPortalType = () => {
  return localStorage.getItem(StorageConstants.PORTAL_TYPE);
}

const USER_TYPE_LIST = () => {
  return localStorage.getItem(StorageConstants.USER_TYPE_LIST);
}
// console.log("getPortalType")
// console.log(getPortalType())

const routes: Routes = [
  {
    path: '',
    // redirectTo: getUserType() == 'OWNER' || "SUBOPERATOR" ? '/pos/inventory/products' : '/warehouse/inventory/products',
    redirectTo: getPortalType() == 'w' && USER_TYPE_LIST().includes("19") ? '/warehouse/inventory/products' : '/pos/inventory/products',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  // { path: 'unauth', component: SharedUnauthPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
