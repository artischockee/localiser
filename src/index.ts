import { LocaleContextModel } from './types';
import Localiser from './Localiser';
import { localiser } from './instance';

export function initialize(params: LocaleContextModel) {
  localiser.instance = new Localiser(params);
  // initContext(localiserInstance); // TODO: should be use it?

  return localiser.instance;
}

export { LocaleContextModel, LocaliserL } from './types';

export { default as useLocaliser } from './useLocaliser';
export { default as LocaleProvider } from './LocaleProvider';
