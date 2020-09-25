import React, { useContext } from 'react';
import LocaleContext from '../LocaleContext';
import { render } from '@testing-library/react';

describe('LocaleContext', () => {
  it('should throw an error when using l() without proper initialization', () => {
    const Component = (): React.ReactElement => {
      const context = useContext(LocaleContext);

      return <p>{context.l('a/b/c')}</p>;
    };

    expect(() => render(<Component />)).toThrowError();
  });

  it('should NOT throw an error when using l() without proper initialization', () => {
    test.todo('it');
    // initContext(
    //   new LocaliserInstance({
    //     localeResources: {},
    //     fallbackLocale: 'ru',
    //   }),
    // );
    //
    // const Component = (): React.ReactElement => {
    //   const context = useContext(LocaleContext);
    //
    //   return <p>{context.l('a/b/c')}</p>;
    // };
    //
    // expect(() => render(<Component />)).not.toThrowError();
  });
});
