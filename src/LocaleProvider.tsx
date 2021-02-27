import React, { ReactNode, useEffect } from 'react';
import LocaleContext from './LocaleContext';
import Localiser from './Localiser';
import { localiser } from './instance';

interface Props {
  config: Localiser;
  locale: string;
  children: ReactNode;
}

export default function LocaleProvider(props: Props) {
  useEffect(() => {
    if (localiser.instance instanceof Localiser) {
      localiser.instance.locale = props.locale;
    }
  }, [props.locale]);

  return (
    <LocaleContext.Provider
      value={{
        locale: props.locale,
        l: props.config.l,
      }}
    >
      {props.children}
    </LocaleContext.Provider>
  );
}
