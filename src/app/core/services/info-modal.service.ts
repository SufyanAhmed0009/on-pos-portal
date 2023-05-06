import { Direction } from '@angular/cdk/bidi';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalSharedInfoComponent } from 'src/app/shared/components/modal-info/modal-info.component';
import { ServiceLanguage } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceInfoModal {

  constructor(
    private matDialog: MatDialog,
    private languageService: ServiceLanguage
  ) { }

  public openInfoModal(content: string){

    const initialState = {
      content: content
    };

    this.matDialog.open(ModalSharedInfoComponent, {
      width: '510px',
      data: initialState,
      direction: <Direction> this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    }); 

  } 
}
