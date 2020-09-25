import { createContext } from 'react';
import { LocaleConfig } from './types';
import LocaliserInstance from './LocaliserInstance';

let LocaleContext = createContext<LocaleConfig>({
  locale: '',
  l() {
    throw new Error('@artischocke/localiser: l() not implemented');
  },
});

export function initContext(localiserInstance: LocaliserInstance) {
  LocaleContext = createContext<LocaleConfig>({
    locale: '',
    l: localiserInstance.l,
  });
}

export default LocaleContext;
