declare const i18n: any;
declare let message: {};
interface I18nSeetings {
  legacy: boolean;
  locale: string;
  fallbackLocale: string;
  messages: {};
}

declare function createI18n(seetings: I18nSeetings): any;
export default i18n;
