import React from "react";
import LocaleContext from "./LocaleContext";
import LocaliserInstance from "./LocaliserInstance";

interface Props {
  config: LocaliserInstance;
  locale: string;
  children: React.ReactNode;
}

export default function LocaleProvider(props: Props) {
  return (
    <LocaleContext.Provider value={{
      locale: props.locale,
      l: props.config.l,
    }}>
      {props.children}
    </LocaleContext.Provider>
  )
}
