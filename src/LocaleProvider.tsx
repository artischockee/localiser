import React, { useEffect } from 'react';
import LocaleContext from './LocaleContext';
import LocaliserInstance from './LocaliserInstance';
import { localiser } from './instance';

interface Props {
  config: LocaliserInstance;
  locale: string;
  children: React.ReactNode;
}

export default function LocaleProvider(props: Props) {
  useEffect(() => {
    if (localiser.instance instanceof LocaliserInstance) {
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
