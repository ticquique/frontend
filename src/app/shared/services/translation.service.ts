declare const require: any;
import { Injectable } from '@angular/core';
const en = require('../../../environments/i18n/en.json');
const es = require('../../../environments/i18n/es.json');
const de = require('../../../environments/i18n/de.json');

export class TranslationSet {
    public languange: string;
    public values: { [key: string]: string } = {};
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class TranslationService {

    public languages = ['de', 'en', 'es'];
    public language = 'es';
    private dictionary: { [key: string]: TranslationSet } = {
        de: {
            languange: 'de',
            values: de
        },
        en: {
            languange: 'en',
            values: en
        },
        es: {
            languange: 'es',
            values: es
        }
    };
    constructor() {
        const lang = navigator.language;
        if (this.languages.indexOf(lang) !== -1) { this.language = lang; }
    }

    translate(value: string): string {
        if (this.dictionary[this.language] != null) {
            const val = this.dictionary[this.language].values[value];
            if (val) { return val; } else { return value; }
        }
    }
}
