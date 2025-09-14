import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const namespaces = [
  "common",
  "navigation",
  "projects",
  "materials",
  "production",
  "errors",
] as const;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "pl",
    debug: import.meta.env.DEV,
    ns: namespaces,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
  });

export default i18n;
