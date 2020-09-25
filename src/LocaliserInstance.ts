import { getProcessedLocItem } from './utils';
import { LocaleContextModel } from './types';

export default class LocaliserInstance {
  private readonly resources: Record<string, Record<string, string>> = {};
  private readonly fallbackLocale: string | null = null;

  constructor(params: LocaleContextModel) {
    this.resources = params.localeResources;

    if (params.fallbackLocale != null) {
      this.fallbackLocale = params.fallbackLocale;
    }

    this.l = this.l.bind(this);
  }

  l(locKey: string, params?: Record<string, any> | null, locale?: string): string {
    console.log('l() : "this"', this);

    let _locale = locale || this.fallbackLocale;

    if (_locale == null || this.resources[_locale] == null) {
      if (this.fallbackLocale != null && this.resources[this.fallbackLocale] != null) {
        _locale = this.fallbackLocale;
      } else {
        return '';
      }
    }

    return getProcessedLocItem(this.resources[_locale][locKey], params);
  }
}
