import { Component, OnInit } from '@angular/core';
import { ServiceLanguage } from '../core/services/language.service';
import { RespLanguage, DtLanguage } from '../core/models/language';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
})
export class PointOfSalesComponent implements OnInit {

  langDir: string = "ltr";

  constructor(private languageService: ServiceLanguage) {

  }

  ngOnInit(): void {
    if (this.languageService.languagesFetched()) {
      this.langDir = this.languageService.getCurrentLanguage().dir;
    } else {
      this.languageService.getLanguagesListFromServer().subscribe(
        (data: RespLanguage) => {
          let languages = data.languages.map(
            (language) => {
              return {
                id: language.id,
                name: language.title,
                flagClass: language.imageClass,
                dir: language.langDir
              }
            }
          );
          this.languageService.setLanguagesList(languages);
          this.languageService.setCurrentLanguage(languages[0]);
          this.langDir = this.languageService.getCurrentLanguage().dir;
        }
      );
    }

    this.languageService.languageChangedEmittor.subscribe(
      (data: DtLanguage) => {
        this.langDir = data.dir;
      }
    );
  }
}
