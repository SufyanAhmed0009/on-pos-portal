import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceMenu } from 'src/app/core/services/menu.service';
import { DtLanguage, RespLanguage } from 'src/app/core/models/language';
import { DtListSubMenu, DtListMenu, RespMenu } from 'src/app/core/models/menu';
import { Servers, AppConstants } from 'src/app/core/static/app-constants';
import { map, shareReplay } from 'rxjs/operators';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { MenuConstants } from 'src/app/core/static/menu_constants';
import { DtSelectItem } from 'src/app/core/models/select';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  /* OBSERVABLE FOR SWITCHING TO HANDSET MODE. */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  /* COLORS */
  colors: {
    TITLE_BAR: string,
    MENU_BAR: string
  }

  menus: DtListMenu[] = [];
  filteredMenus: DtListMenu[] = [];
  testMenus: DtListMenu[] = [];
  submenus: DtListSubMenu[] = [];

  panelTitle: string;
  currentUser: string;

  /* FOR LANGUAGES */
  currentLanguage: DtLanguage;
  currentLanguageTitle: string;
  languages: DtLanguage[];

  /* TESTING MODE */
  testMode: boolean;

  /* STORES (BRANCHES) */
  stores: DtSelectItem[];
  currentStoreId: number;
  currentWhId: number;

  /* LINK PREFIX */
  linkPrefix: string;

  /* WAREHOUSES */
  warehouses: DtSelectItem[];

  userTypeIds: number[] = [];
  currentUserTypeId: number;
  userTypeList: {
    id: number;
    title: string;
  }[];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private languageService: ServiceLanguage,
    private menuService: ServiceMenu,
    private authService: ServiceAuth,
    private router: Router,
  ) { }

  ngOnInit() {

    this.linkPrefix = this.authService.getUserType() == 'OWNER' || this.authService.getUserType() == 'SUBOPERATOR' ? '/pos/' : '/warehouse/';
    this.testMode = Servers.TEST_MODE;

    this.colors = {
      MENU_BAR:
        this.authService.getUserType() == 'WAREHOUSE' ?
          AppConstants.COLORS.WH_MENU_BAR : AppConstants.COLORS.MENU_BAR,
      TITLE_BAR:
        this.authService.getUserType() == 'WAREHOUSE' ?
          AppConstants.COLORS.WH_TITLE_BAR : AppConstants.COLORS.TITLE_BAR,
    }
    // this.menus = this.menuService.getMenusFromLocalStorage();
    console.log("this.menus")
    console.log(this.menus)
    // this.colors = {
    //   MENU_BAR:
    //     this.authService.getUserTypeList().includes(19) ?
    //       AppConstants.COLORS.WH_MENU_BAR : AppConstants.COLORS.MENU_BAR,
    //   TITLE_BAR:
    //     this.authService.getUserTypeList().includes(19) ?
    //       AppConstants.COLORS.WH_TITLE_BAR : AppConstants.COLORS.TITLE_BAR,
    // }

    // if (this.authService.getUserTypeList().includes(19) && this.authService.getPortalType() == "w") {
    //   // this.currentUserTypeId = 19;
    //   this.filteredMenus = this.menus.filter((x) => x.portalType == 'w');
    //   // this.panelTitle = this.authService.getFullName();
    // } else {
    //   this.filteredMenus = this.menus.filter((x) => x.portalType == 's');
    // }

    // if (this.authService.getUserType() == 'OWNER' || this.authService.getUserType() == 'SUBOPERATOR') {
    //   this.menus = MenuConstants.MENU_LIST;
    // } else if (this.authService.getUserType() == 'WAREHOUSE') {
    //   this.menus = MenuConstants.WAREHOUSE_MENU_LIST;
    // }

    this.menus = this.menuService.getMenusFromLocalStorage();

    console.log("this.menus")
    console.log(this.menus)

    this.userTypeList = [
      {
        id: 19,
        title: "WAREHOUSE"
      },
      {
        id: 2,
        title: "OWNER"
      }
    ]

    this.initializeLanguages();
    this.currentStoreId = this.authService.getBranchId();
    this.currentWhId = this.authService.getWarehouseId();
    this.stores = this.authService.getBranchesList();
    this.warehouses = this.authService.getWhList();
    this.panelTitle = this.authService.getBranchName();
    this.currentUser = this.authService.getUsername();
    this.userTypeIds = this.authService.getUserTypeList();
  }

  initializeLanguages() {

    if (!this.languageService.languagesFetched()) {
      this.languageService.getLanguagesListFromServer().subscribe(
        (data: RespLanguage) => {
          this.languages = data.languages.map(
            (language) => {
              return {
                id: language.id,
                name: language.title,
                flagClass: language.imageClass,
                dir: language.langDir
              }
            }
          );
          this.languageService.setLanguagesList(this.languages);
          this.languageService.setCurrentLanguage(this.languages[0]);
          this.currentLanguage = this.languageService.getCurrentLanguage();
          this.currentLanguageTitle = this.currentLanguage.name;
        }
      );
    } else {
      this.languages = this.languageService.getLanguagesList();
      this.currentLanguage = this.languageService.getCurrentLanguage();
      this.currentLanguageTitle = this.languageService.getCurrentLanguage().name;
    }

  }

  setSubmenu(list: DtListSubMenu[]) {
    this.submenus = list;
  }

  onLanguageChange() {
    this.languages.forEach(
      (language) => {
        if (language.name == this.currentLanguageTitle) {
          this.currentLanguage = language;
        }
      }
    );
    this.languageService.setCurrentLanguage(this.currentLanguage);
    this.languageService.languageChangedEmittor.emit(this.currentLanguage);
  }

  onUserTypeChange() {
    console.log("this.currentUserTypeId")
    console.log(this.currentUserTypeId)
    console.log("this.currentStoreId")
    console.log(this.currentStoreId)
    this.colors = {
      MENU_BAR:
        this.currentUserTypeId == 19 ? AppConstants.COLORS.WH_MENU_BAR : AppConstants.COLORS.MENU_BAR,
      TITLE_BAR:
        this.currentUserTypeId == 19 ? AppConstants.COLORS.WH_TITLE_BAR : AppConstants.COLORS.TITLE_BAR,
    }
    // this.panelTitle = this.currentUserTypeId == 19 ? 'Warehouse'  ;
    if (this.currentUserTypeId == 19) {
      this.filteredMenus = this.menus.filter((x) => x.portalType == 'w');
      this.currentWhId = this.warehouses[0].id;
      this.panelTitle = this.warehouses[0].title;

      this.router.navigateByUrl("/warehouse/inventory/products");

    } else {
      this.filteredMenus = this.menus.filter((x) => x.portalType == 's');
      this.currentStoreId = this.stores[0].id;
      this.panelTitle = this.stores[0].title;
      this.router.navigateByUrl("/pos/inventory/products");

      console.log("this.stores")
      console.log(this.stores)

    }
  }

  onWarehouseChange() {
    this.warehouses.forEach(
      (warehouse) => {
        if (warehouse.id == this.currentWhId) {
          this.authService.setWarehouseId(warehouse.id);
          this.authService.setWarehouseName(warehouse.title);
          this.authService.storeChanged.emit(warehouse);
          this.panelTitle = warehouse.title;
        }
      }
    )
  }

  onStoreChange() {
    this.stores.forEach(
      (store) => {
        if (store.id == this.currentStoreId) {
          this.authService.setBranchId(store.id);
          this.authService.setBranchName(store.title);
          this.authService.storeChanged.emit(store);
          this.panelTitle = store.title;
        }
      }
    )
  }

  onRoute(link: string) {
    this.router.navigate([this.linkPrefix + link]);
  }

  /* FOR LOGOUT */
  onLogout() {
    this.authService.logout();
  }

  getVersion() {
    return AppConstants.VERSION;
  }

}
