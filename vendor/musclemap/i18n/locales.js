
const translations = {
  en: {}
};

let currentLocale = "en";

export function setLocale(locale) {
  currentLocale = translations[locale] ? locale : "en";
}

export function getLocale() {
  return currentLocale;
}

export function getAvailableLocales() {
  return Object.keys(translations);
}

export function getMuscleName(muscle) {
  return String(muscle ?? "");
}

export function getAllMuscleNames() {
  return {};
}

export function getUIString(key) {
  return String(key ?? "");
}
