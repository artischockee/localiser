import { LocaliserParams } from './types';
import Localiser from './Localiser';
import { localiser } from './instance';

export function initialize(params: LocaliserParams): Localiser {
  localiser.instance = new Localiser(params);

  return localiser.instance;
}

export { LocaliserParams, LocaliserL } from './types';

export { default as useLocaliser } from './useLocaliser';
export { default as LocaleProvider } from './LocaleProvider';
