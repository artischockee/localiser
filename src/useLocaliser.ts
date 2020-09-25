import { useCallback, useContext } from 'react';
import LocaleContext from './LocaleContext';

export default function useLocaliser() {
  const context = useContext(LocaleContext);

  console.log('useLocaliser()', context);

  if (context == null || typeof context.l !== 'function') {
    throw new Error('@artischocke/localiser: Context must be specified');
  }

  return useCallback(
    (locKey: string, params?: Record<string, any> | null) => {
      return context.l(locKey, params, context.locale);
    },
    [context],
  );
}
