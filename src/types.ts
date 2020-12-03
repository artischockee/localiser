export interface LocaleConfig {
  locale: string;
  l(locKey: string, params?: Record<string, unknown> | null, locale?: string): string;
}

export interface LocaliserParams {
  localeResources: Record<string, Record<string, string>>;
  fallbackLocale?: string;
}

export type LocaliserL = (locKey: string, params?: Record<string, unknown>) => string;
