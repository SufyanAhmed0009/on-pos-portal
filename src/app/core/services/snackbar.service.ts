import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceLanguage } from './language.service';
import { Direction } from '@angular/cdk/bidi';

@Injectable({
    providedIn: 'root'
}) 
export class ServiceSnackbar {

    constructor( 
        private snackBar: MatSnackBar,
        private languageService: ServiceLanguage
    ) { }

    showErrorMessage(message: string) {
        this.popUpMessage(message, "snackbar-error");
    }

    showSuccessMessage(message: string) {
        this.popUpMessage(message, "snackbar-success");
    }

    showInfoMessage(message: string) {
        this.popUpMessage(message, "snackbar-info");
    }
 
    private popUpMessage(message: string, panelClass: string) {
        this.snackBar.open(message, "OK", {
            duration: 2000, 
            direction: <Direction>this.languageService.getCurrentLanguage().dir,
            panelClass: panelClass
        });
    }

}