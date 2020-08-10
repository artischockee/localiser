import React from 'react';
import Utils from './utils';

type LocaleResources = Record<string, Record<string, string>>;
interface Params {
  localeResources: LocaleResources;
  context: React.Context<any>;
  localeContextPath: string;
  defaultLocale?: string;
}

export class LocaliserInstance {
  private readonly resources: Record<string, Record<string, string>> = {};
  private readonly defaultLocale: string | null = null;
  private readonly context: React.Context<any>;
  private readonly localeContextPath: string;

  constructor(params: Params) {
    this.resources = params.localeResources;
    this.context = params.context;
    this.localeContextPath = params.localeContextPath;

    if (params.defaultLocale != null) {
      this.defaultLocale = params.defaultLocale;
    }
  }

  private getLocaleItem(locKey: string, params?: Record<string, any>) {
    const context = React.useContext(this.context);

    const locale = Utils.getObjectPropertyByPath(context, this.localeContextPath) || this.defaultLocale;

    if (locale == null || typeof locale !== 'string' || this.resources[locale] == null) return '';

    return Utils.getProcessedLocItem(this.resources[locale][locKey], params);
  }

  l(locKey: string, params?: Record<string, any>): string {
    return this.getLocaleItem(locKey, params);
  }

  /**
   * Stands for 'localization standalone' which means
   * you can achieve 'plain' localization (string, not wrapped into the React element)
   * from almost every place in code, even from not connected (to Redux store) functions.
   */
  ls(locKey: string, params: Record<string, any> | null, locale: string): string {
    if (this.resources[locale] == null) return '';

    return Utils.getProcessedLocItem(this.resources[locale][locKey], params);
  }
}

export default class Localiser {
  static init(params: Params) {
    return new LocaliserInstance(params);
  }
}
