import { ReactElement, useContext } from 'react';
import LocaleContext from '../LocaleContext';
import { render } from '@testing-library/react';

describe('LocaleContext', () => {
  it('should throw an error when using l() without proper initialization', () => {
    const Component = (): ReactElement => {
      const context = useContext(LocaleContext);

      return <p>{context.l('a/b/c')}</p>;
    };

    expect(() => render(<Component />)).toThrowError();
  });
});
