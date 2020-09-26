export interface LocaleConfig {
  locale: string;
  l(locKey: string, params?: Record<string, any> | null, locale?: string): string;
}

export interface LocaleContextModel {
  localeResources: Record<string, Record<string, string>>;
  fallbackLocale?: string;
}

export type LocaliserL = (locKey: string, params?: Record<string, any>) => string;
