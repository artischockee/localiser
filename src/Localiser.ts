import { getProcessedLocItem } from './utils';
import { LocaleContextModel } from './types';

export default class Localiser {
  private readonly resources: Record<string, Record<string, string>> = {};
  private readonly fallbackLocale: string | null = null;
  private currentLocale: string | null = null;

  constructor(params: LocaleContextModel) {
    this.resources = params.localeResources;

    if (params.fallbackLocale != null) {
      this.fallbackLocale = params.fallbackLocale;
    }

    this.l = this.l.bind(this);
  }

  set locale(_currentLocale: string | null) {
    this.currentLocale = _currentLocale;
  }

  l(locKey: string, params?: Record<string, any> | null, locale?: string): string {
    let _locale = locale || this.currentLocale || this.fallbackLocale;

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
