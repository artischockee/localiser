import { LocaleContextModel } from './types';
import LocaliserInstance from './LocaliserInstance';

export function initialize(params: LocaleContextModel) {
  const localiserInstance = new LocaliserInstance(params);
  // initContext(localiserInstance); // TODO: should be use it?

  return localiserInstance;
}

export { LocaleContextModel } from './types';

export { default as useLocaliser } from './useLocaliser';
export { default as LocaleProvider } from './LocaleProvider';
