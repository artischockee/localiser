import Utils from './utils';

type LocaleResources = Record<string, Record<string, string>>;

export class LocaliserInstance {
  private readonly resources: Record<string, Record<string, string>> = {};
  private readonly defaultLocale: string | null = null;
  private readonly currentLocale: string | null = null;

  constructor(localeResources: LocaleResources, currentLocale: string, defaultLocale?: string) {
    this.resources = localeResources;
    this.currentLocale = currentLocale;

    if (defaultLocale != null) {
      this.defaultLocale = defaultLocale;
    }
  }

  getLocaleItem(locKey: string, params?: Record<string, any>) {
    const locale = this.currentLocale || this.defaultLocale;

    if (locale == null || this.resources[locale] == null) return null;

    return Utils.getProcessedLocItem(this.resources[locale][locKey], params);
  }

  l(locKey: string, params?: Record<string, any>) {
    return this.getLocaleItem(locKey, params);
  }

  /**
   * Stands for 'localization standalone' which means
   * you can achieve 'plain' localization (string, not wrapped into the React element)
   * from almost every place in code, even from not connected (to Redux store) functions.
   */
  ls(locKey: string, params: Record<string, any> | null, locale: string): string | null {
    if (this.resources[locale] == null) return null;

    return Utils.getProcessedLocItem(this.resources[locale][locKey], params);
  }
}

export default class Localiser {
  static init(localeResources: LocaleResources, currentLocale: string, defaultLocale?: string) {
    return new LocaliserInstance(localeResources, currentLocale, defaultLocale);
  }
}
