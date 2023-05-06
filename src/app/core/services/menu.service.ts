import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { StorageConstants } from '../static/storage_constants';
import { ApiConstants } from '../static/api_constants';
import { RespMenu, DtMenu, DtListMenu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class ServiceMenu {

  constructor(
    private http: HttpClient
  ) { }

  getNavigationMenus() {
    return this.http.get(AppConstants.SERVER_READONLY_URL + ApiConstants._MENU.GET.MENU_LIST);
  } 

  setAllowedRoutes(data: RespMenu[]){
    let routes: string[] = [];
    data.forEach(
      (data) => {
        if (data.viewrights == true){
          routes.push('/smarty/' + data.menu.link);
        }
      }
    );
    localStorage.setItem(StorageConstants.ALLOWED_MENU_ROUTES, JSON.stringify(routes));
  }

  setNavigationMenus(data: RespMenu[]) {

    data = data.filter(
      (item) => {
        return item.viewrights;
      }
    );

    let menus: DtMenu[] = data.map(
      (item) => {
        return {
          id: item.menu.id,
          name: item.menu.displayName,
          link: item.menu.link,
          parentId: item.menu.parentID ? item.menu.parentID.id : null,
          iconClass: item.menu.iconClass,
          portalType: item.menu.portalType
        }
      }
    );

    let listMenus: DtListMenu[] = [];

    //Push Parent Menus.
    menus.forEach(
      (menu) => {
        if (menu.parentId == null) {
          listMenus.push({
            id: menu.id,
            name: menu.name,
            link: menu.link,
            imageClass: menu.iconClass,
            subMenus: [],
            portalType: menu.portalType
          });
        }
      }
    );

    //Push Child Menus.
    for (let i = 0; i < listMenus.length; i++) {
      let menuId = listMenus[i].id;
      menus.forEach(
        (subMenu) => {
          if (subMenu.parentId == menuId) {
            listMenus[i].subMenus.push(
              {
                id: subMenu.id,
                name: subMenu.name,
                link: subMenu.link
              }
            );
          }
        }
      );
    }

    this.saveMenusInLocalStorage(listMenus);

  }

  saveMenusInLocalStorage(menus: DtListMenu[]) {
    localStorage.setItem(StorageConstants.MENU_ROUTES, JSON.stringify(menus));
  }

  getMenusFromLocalStorage(): DtListMenu[] {
    return JSON.parse(localStorage.getItem(StorageConstants.MENU_ROUTES));
  }

  getListOfMenus(){
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._MENU.GET.ALL_MENUS_LIST
    )
  }

  getMenuRightsByProfileId(id: number){
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._MENU.GET.MENU_RIGHTS_BY_ID + id
    );
  }

} 
