import React from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import type { namespaces } from "../i18n";

type Namespace = (typeof namespaces)[number];

export const useTranslation = (namespace: Namespace = "common") => {
  const { t, i18n } = useI18nTranslation(namespace);
  return {
    t,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
    isLoading: i18n.isInitialized === false,
  };
};

interface TProps {
  i18nKey: string;
  values?: Record<string, any>;
  components?: Record<string, React.ReactElement>;
}

export const T: React.FC<TProps> = ({ i18nKey, values, components }) => {
  const { t } = useTranslation();
  const content = t(i18nKey, { ...values, ...components }) as unknown as string;
  return React.createElement(React.Fragment, null, content);
};
