import { createContext } from 'react';
import { LocaleConfig } from './types';

const LocaleContext = createContext<LocaleConfig>({
  locale: '',
  l() {
    throw new Error('@artischocke/localiser: l() not implemented');
  },
});

export default LocaleContext;
