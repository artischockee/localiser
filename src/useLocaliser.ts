import { useCallback, useContext } from 'react';
import LocaleContext from './LocaleContext';

export default function _useLocaliser() {
  const context = useContext(LocaleContext);

  if (context == null || typeof context.l !== 'function') {
    throw new Error('@artischocke/localiser: Context must be specified');
  }

  return useCallback(
    (locKey: string, params?: Record<string, unknown>) => {
      return context.l(locKey, params, context.locale);
    },
    [context],
  );
}
