export class DtLanguage {
    id: number;
    name: string;
    flagClass: string;
    dir: string;
}

export class RespLanguageTerm {
    id: number;
    term: {
        termId: number,
        termText: string;
    }[];
}

export class RespLanguage {
    languages: {
        id: number;
        title: string;
        code: string;
        langCode: string;
        titleForeign: string;
        imageClass: string;
        langDir: string;
    }[];
    terms: RespLanguageTerm[];
}