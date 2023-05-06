import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/core/static/app-constants';
import { DtLanguage, RespLanguage } from 'src/app/core/models/language';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ReqLogin, RespLogin } from 'src/app/core/models/login';
import { ServiceMenu } from 'src/app/core/services/menu.service';
import { RespMenu } from 'src/app/core/models/menu';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean;
  languages: DtLanguage[];
  langDir: string;
  error: string;

  selectedPortalType: number;
  portalTypeList: {
    id: number;
    title: string;
  }[];


  constructor(
    private authService: ServiceAuth,
    private router: Router,
    private languageService: ServiceLanguage,
    private menuService: ServiceMenu,
    private snackBarService: ServiceSnackbar,
  ) {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/pos/inventory/products"]);
    }

  }

  ngOnInit(): void {

    this.portalTypeList = [
      {
        id: 19,
        title: "WAREHOUSE"
      },
      {
        id: 2,
        title: "STORE"
      }
    ]

    this.initializeLanguages();
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      portalType: new FormControl(2, Validators.required)
    });

  }

  // login() {
  //   this.submitted = true;
  //   let request: ReqLogin = new ReqLogin();
  //   request.user = {
  //     username: this.loginForm.controls.username.value,
  //     password: this.loginForm.controls.password.value
  //   }

  //   this.authService.login(request).subscribe(
  //     (response: RespLogin) => {
  //       console.log("response");
  //       console.log(response);
  //       if (response.userTypeList.includes(19)) {
  //         if (!response.userType) {
  //           response.userType = 'WAREHOUSE'
  //         }
  //           this.loginAsWarehouse(response);
  //       } else if (response.userTypeList != null) {
  //         if (!response.userType) {
  //           response.userType = 'OWNER';
  //         }
  //         this.loginAsOwner(response);
  //       } else {
  //         this.onError();
  //       }

  //       this.submitted = false;
  //     },
  //     (error) => {
  //       this.submitted = false;
  //       this.onError();
  //     }
  //   );
  // }

  login() {
    this.submitted = true;
    let request: ReqLogin = new ReqLogin();
    request.user = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }
    request.portalType = this.loginForm.controls.portalType.value == 2 ? 's' : this.loginForm.controls.portalType.value == 19 ? 'w' :''

    // this.authService.login(request).subscribe(
    //   (response: RespLogin) => {
    //     console.log("login");
    //     console.log(response);
    //     console.log("this.loginForm.controls.portalType.value")
    //     console.log(this.loginForm.controls.portalType.value)
    //     if (response.userTypeList.includes(19) && this.loginForm.controls.portalType.value == 19) {
    //       if (!response.userType) {
    //         response.userType = 'WAREHOUSE'
    //       }
    //         this.loginAsWarehouse(response);
    //     } else if (response.userTypeList != null) {
    //       if (!response.userType) {
    //         response.userType = 'OWNER';
    //       }
    //       this.loginAsOwner(response);
    //     } else {
    //       this.onError();
    //     }

    //     this.submitted = false;
    //   },
    //   (error) => {
    //     this.submitted = false;
    //     this.onError();
    //   }
    // );

    this.authService.login(request).subscribe(
      (response: RespLogin) => {
        console.log("Login")
        console.log(response)
        if (response.userTypeList.includes(19) && this.loginForm.controls.portalType.value == 19) {
          response.userType = 'WAREHOUSE'
          this.loginAsWarehouse(response);
        } else if (response.userTypeList != null && this.loginForm.controls.portalType.value == 2) {
          // if (!response.userType) {
          response.userType = 'OWNER';
          // }
          this.loginAsOwner(response);
        } else {
          if (!response.userTypeList.includes(this.loginForm.controls.portalType.value)) {
            this.snackBarService.showErrorMessage("Please Choose Correct Portal Type!")
          } else {
            this.onError();
          }
        }

        this.submitted = false;
      },
      (error) => {
        this.submitted = false;
        this.onError();
      }
    );
  }

  onError() {
    this.error = "Invalid credentials. Try Again."
  }

  loginAsOwner(response: RespLogin) {
    if (response.branchList && response.branchList?.length > 0) {
      this.authService.setToken(response.tokenString);
      this.authService.setRefreshToken(response.refreshTokenString);
      this.authService.setUserId(response.userId);
      this.authService.setUsername(response.fullUsername);
      this.authService.setUserType(response.userType);
      this.authService.setFranchiseId(response.hqId);
      this.authService.setFullName(response.name);
      this.authService.setBranchId(response.branchList[0].id);
      this.authService.setBranchName(response.branchList[0].title);
      this.authService.setPortalType("s");

      this.authService.setBranchesList(response.branchList);
      this.authService.setUserBranchList(response.userbranchlist);
      this.authService.setUserTypeList(response.userTypeList);

      this.menuService.getNavigationMenus().subscribe(
        (data: RespMenu[]) => {
          // console.log("login")
          // console.log(data)          
          data = data.filter(item => item.menu.portalType == 's');
      
          console.log(data)
          this.menuService.setAllowedRoutes(data);
          this.menuService.setNavigationMenus(data);

          //Displaying Success Message.
          this.snackBarService.showSuccessMessage("Login Successful");

          // let userType = this.authService.getUserType();
          this.router.navigateByUrl("/pos/inventory/products");
        }
      );

    } else {
      this.onError();
    }
  }

  loginAsWarehouse(response: RespLogin) {
    // let warehouseList: { whTitle: string; whId: number }[] = JSON.parse(response.whList? response.whList : '');
    // if (warehouseList && warehouseList.length > 0) {
    //   response.branchList = warehouseList.map((item) => {
    //     return {
    //       id: item.whId,
    //       title: item.whTitle,
    //       parent: null
    //     }
    //   });
    // }
    // console.log(response.branchList);
    console.log("response.whList")
    console.log(response.whList)
    if (!response.whList || response.whList?.length == 0) {
      response.whList = [{
        id: (response.fullUsername == 'warehouse' ? 1 : 161),
        title: response.fullUsername == 'warehouse' ? 'Warehouse' : 'warehouse.lahore',
        parent: null
      }];
    }
    if (response.whList && response.whList?.length > 0) {
      console.log("response")
      console.log(response)
      this.authService.setToken(response.tokenString);
      this.authService.setRefreshToken(response.refreshTokenString);
      this.authService.setUserId(response.userId);
      this.authService.setUsername(response.fullUsername);
      this.authService.setUserType(response.userType);
      this.authService.setFranchiseId(response.hqId);
      this.authService.setFullName(response.name);
      // this.authService.setBranchId(response.branchList[0].id);
      this.authService.setBranchesList(response.branchList);
      // this.authService.setBranchName(response.branchList[0].title);
      this.authService.setBranchesList(response.whList);
      this.authService.setBranchId(response.whList[0].id ? response.whList[0].id : 1);
      this.authService.setBranchName(response.whList[0].title ? response.whList[0].title : 'Warehouse');
      this.authService.setUserTypeList(response.userTypeList);
      this.authService.setWhList(response.whList)
      this.authService.setWarehouseId(response.whList[0].id);
      this.authService.setWarehouseName(response.whList[0].title);
      this.authService.setPortalType("w");

      this.menuService.getNavigationMenus().subscribe(
        (data: RespMenu[]) => {
          console.log("login")
          // console.log(data)
          data = data.filter(item => item.menu.portalType == 'w');
          console.log(data)
          this.menuService.setAllowedRoutes(data);
          this.menuService.setNavigationMenus(data);
          //Displaying Success Message.
          this.snackBarService.showSuccessMessage("Login Successful");

          //  let userType = this.authService.getUserType();
          this.router.navigateByUrl("/warehouse/inventory/products");
        }
      );

    } else {
      this.onError();
    }
  }

  initializeLanguages() {
    this.languages = this.languageService.getLanguagesList();
    let currentLanguage = this.languageService.getCurrentLanguage();
    if (currentLanguage == null) {
      this.languageService.setCurrentLanguage(this.languages[0]);
      this.langDir = 'ltr';
    } else {
      this.langDir = currentLanguage.dir;
    }
  }

  getVersion() {
    return AppConstants.VERSION;
  }

  onChangeLanguage(language: DtLanguage) {
    this.languageService.setCurrentLanguage(language);
    this.langDir = language.dir;
  }

}
