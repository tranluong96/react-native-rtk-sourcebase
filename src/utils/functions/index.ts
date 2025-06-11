import i18next from "i18next";

export default class Functions {
    static onChangeLanguage = (lang: 'jp' | 'en') => {
        i18next.changeLanguage(lang);
    }
}

export const isNullOrEmpty = (value: any) => {
    return value === null || value === undefined || value === "";
};
export const isNotNullOrEmpty = (value: any) => {
    return !isNullOrEmpty(value);
};