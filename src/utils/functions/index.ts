import i18next from "i18next";

class Functions {
    static onChangeLanguage = (lang: 'jp' | 'en') => {
        i18next.changeLanguage(lang);
    };
}

export default Functions;