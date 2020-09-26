import { createContext } from 'react';
import { LocaleConfig } from './types';
import Localiser from './Localiser';

let LocaleContext = createContext<LocaleConfig>({
  locale: '',
  l() {
    throw new Error('@artischocke/localiser: l() not implemented');
  },
});

export function initContext(localiserInstance: Localiser) {
  LocaleContext = createContext<LocaleConfig>({
    locale: '',
    l: localiserInstance.l,
  });
}

export default LocaleContext;
