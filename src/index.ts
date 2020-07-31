import Utils from './utils';

type LocaleResources = Record<string, Record<string, string>>;
type CurrentLocale = string;

export class LocaliserInstance {
  private readonly resources: Record<string, Record<string, string>> = {};
  private readonly currentLocale: string | null = null;

  constructor(localeResources: LocaleResources, currentLocale?: CurrentLocale) {
    this.resources = localeResources;
    if (currentLocale == null) {
      Utils.warn(
        "You haven't specified 'currentLocale' prop. It means that your attempts of using 'l' function will be failed and the function will return 'null'.",
      );
    } else {
      this.currentLocale = currentLocale;
    }
  }

  l(locKey: string, params?: Record<string, any>) {
    if (this.currentLocale == null) return null;

    const locItem = this.resources[this.currentLocale][locKey];

    return Utils.getProcessedLocItem(locItem, params);
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
  static init(localeResources: LocaleResources, currentLocale?: CurrentLocale) {
    return new LocaliserInstance(localeResources, currentLocale);
  }
}
