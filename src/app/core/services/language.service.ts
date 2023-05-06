import { Injectable, EventEmitter } from '@angular/core';
import { StorageConstants } from '../static/storage_constants';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { StaticLanguage } from '../static/language_terms';
import { ApiConstants } from '../static/api_constants';
import { DtLanguage, RespLanguageTerm } from '../models/language';

@Injectable({
    providedIn: 'root'
})
export class ServiceLanguage {

    languageChangedEmittor = new EventEmitter<DtLanguage>();

    constructor(private http: HttpClient) { }

    /* GET LIST OF LANGAUGES */
    getLanguagesListFromServer() {
        return this.http.get(
            AppConstants.SERVER_READONLY_URL + ApiConstants._LANGUAGE.GET.PACKAGE
        );
    }

    /* GET/SET LIST OF LANGUAGES FROM/TO LOCAL-STORAGE */
    getLanguagesList(): DtLanguage[] {
        return [
            {id: 1, name: "English", dir: 'ltr', flagClass: ''},
            {id: 2, name: "اردو", dir: 'rtl', flagClass: ''}
        ]
    }

    setLanguagesList(languages: DtLanguage[]) {
        localStorage.setItem(StorageConstants.LANGUAGES, JSON.stringify(languages));
    }

    /* CHECK IF LANGUAGES ARE SET IN THE LOCAL-STORAGE */
    languagesFetched() {
        return this.getLanguagesList() != null;
    }

    /* GET CURRENT LANGUAGE */
    getCurrentLanguage(): DtLanguage {
        if (localStorage.getItem(StorageConstants.CURRENT_LANGUAGE)) {
            let language: DtLanguage = JSON.parse(localStorage.getItem(StorageConstants.CURRENT_LANGUAGE));
            return language;
        } else {
            return null;
        }
    }

    setCurrentLanguage(language: DtLanguage) {
        localStorage.setItem(StorageConstants.CURRENT_LANGUAGE, JSON.stringify(language));
    }

    /* SETTING LANGUAGE TERMS */
    getLanguageTermsJSON(terms: RespLanguageTerm[]): string {
        let localTerms = [];
        terms.forEach(
            (item) => {
                let langList = [];
                item.term.forEach(
                    (langItem) => {
                        langList[langItem.termId] = langItem.termText;
                    }
                );
                localTerms[item.id] = langList;
            }
        );
        return JSON.stringify(localTerms);
    }

    translate(value: string, id: number): any {
        if (StaticLanguage.TERMS[id]) {
            if (StaticLanguage.TERMS[id][this.getCurrentLanguage().id]) {
                return StaticLanguage.TERMS[id][this.getCurrentLanguage().id];
            } else {
                return value;
            }
        } else {
            return value;
        }
    }

    getLangCodeFromId(id: number) {
        let language = AppConstants.LANGUAGE_CODES.find(
            (item) => {
                return item.id == id;
            }
        );
        return language.code;
    }

}
