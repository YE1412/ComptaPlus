import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
const i18n = createI18n({
  legacy: true,
  locale: "fr",
  fallbackLocale: "en",
  mode: "legacy",
  messages: {
    fr,
    en,
  }, // set locale messages
});
export default i18n;
