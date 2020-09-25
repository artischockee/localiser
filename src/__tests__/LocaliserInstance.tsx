import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import LocaliserInstance from '../LocaliserInstance';
import { initialize, LocaleProvider, useLocaliser } from '../index';
import localeResources from '../__stubs__/localeResources.json';

interface AppContextModel {
  dispatch: React.Dispatch<React.SetStateAction<string>>;
}

describe('LocaliserInstance', () => {
  let localiser: LocaliserInstance;
  const AppContext = React.createContext<AppContextModel>({
    dispatch: () => {},
  });
  let Component = function () {
    const { dispatch } = React.useContext(AppContext);
    const l = useLocaliser();

    return (
      <>
        <p role="loc-phrase">{l('a/b/c')}</p>
        <button onClick={() => dispatch('ru')}>ru</button>
        <button onClick={() => dispatch('en')}>en</button>
        <button onClick={() => dispatch('ua')}>ua</button>
      </>
    );
  };
  let WrapperComponent: React.FC;

  describe('rendering (base scenario)', () => {
    beforeAll(() => {
      localiser = initialize({
        localeResources,
        fallbackLocale: 'ru',
      });



      WrapperComponent = function () {
        const [locale, setLocale] = React.useState('en');

        return (
          <AppContext.Provider value={{ dispatch: setLocale }}>
            <LocaleProvider config={localiser} locale={locale}>
              <Component />
            </LocaleProvider>
          </AppContext.Provider>
        );
      };
    });

    it('should render "a/b/c" locale key in English', () => {
      const { asFragment, getByRole } = render(<WrapperComponent />);

      expect(asFragment()).toMatchSnapshot();
      expect(getByRole('loc-phrase')).toHaveTextContent('foo bar');
    });

    it('should switch locale to "ru" and render "a/b/c" locale key in Russian', () => {
      const { asFragment, getByText, getByRole } = render(<WrapperComponent />);

      expect(asFragment()).toMatchSnapshot();

      fireEvent.click(getByText(/ru/i));

      expect(asFragment()).toMatchSnapshot();
      expect(getByRole('loc-phrase')).toHaveTextContent('фоо бар');
    });

    it('should switch locale to "ua" and render "a/b/c" locale key in Fallback locale (ru)', () => {
      const { asFragment, getByText, getByRole } = render(<WrapperComponent />);

      expect(asFragment()).toMatchSnapshot();
      expect(getByRole('loc-phrase')).toHaveTextContent('foo bar');

      fireEvent.click(getByText(/ua/i));

      expect(asFragment()).toMatchSnapshot();
      expect(getByRole('loc-phrase')).toHaveTextContent('фоо бар');
    });
  });

  describe('rendering (without fallback locale)', () => {
    beforeAll(() => {
      localiser = initialize({
        localeResources,
      });

      WrapperComponent = function () {
        const [locale, setLocale] = React.useState('en');

        return (
          <AppContext.Provider value={{ dispatch: setLocale }}>
            <LocaleProvider config={localiser} locale={locale}>
              <Component />
            </LocaleProvider>
          </AppContext.Provider>
        );
      };
    });

    it('should switch locale to "ua" and render "a/b/c" locale key in Fallback locale (ru)', () => {
      const { asFragment, getByText, getByRole } = render(<WrapperComponent />);

      expect(asFragment()).toMatchSnapshot();
      expect(getByRole('loc-phrase')).toHaveTextContent('foo bar');

      fireEvent.click(getByText(/ua/i));

      expect(asFragment()).toMatchSnapshot();
      expect(getByRole('loc-phrase')).toHaveTextContent('');
    });
  });

  describe('rendering (without useLocaliser hook)', () => {
    beforeAll(() => {
      localiser = initialize({
        localeResources,
        fallbackLocale: 'ru',
      });

      Component = function () {
        const { dispatch } = React.useContext(AppContext);

        return (
          <>
            <p role="loc-phrase">{localiser.l('a/b/c')}</p>
            <button onClick={() => dispatch('ru')}>ru</button>
            <button onClick={() => dispatch('en')}>en</button>
            <button onClick={() => dispatch('ua')}>ua</button>
          </>
        );
      };

      WrapperComponent = function () {
        const [locale, setLocale] = React.useState('en');

        return (
          <AppContext.Provider value={{ dispatch: setLocale }}>
            <LocaleProvider config={localiser} locale={locale}>
              <Component />
            </LocaleProvider>
          </AppContext.Provider>
        );
      };
    });

    it('should switch locale to "ua" and render "a/b/c" locale key in Fallback locale (ru)', () => {
      const { asFragment, getByText, getByRole } = render(<WrapperComponent />);

      expect(asFragment()).toMatchSnapshot();
      expect(getByRole('loc-phrase')).toHaveTextContent('фоо бар');

      fireEvent.click(getByText(/ua/i));

      expect(asFragment()).toMatchSnapshot();
      expect(getByRole('loc-phrase')).toHaveTextContent('фоо бар');
    });
  });

  describe('l()', () => {
    let result: string | null;

    it('should return correct and processed string (params = null)', () => {
      result = localiser.l('a/b/c', null, 'en');

      expect(result).toBe('foo bar');
    });

    it('should return correct and processed string (params = {})', () => {
      result = localiser.l('a/b/c', {}, 'en');

      expect(result).toBe('foo bar');
    });

    it('should return the same string if params contain non-existing key', () => {
      result = localiser.l('a/b/c', { iAmDoNotExist: 'I am very sorry' }, 'en');

      expect(result).toBe('foo bar');
    });

    it('should return correct and processed string (with 1 param)', () => {
      result = localiser.l('c/d/e', { str: 'testing' }, 'en');

      expect(result).toBe('foo testing');
    });

    it('should return correct and processed string (with 2+ params)', () => {
      result = localiser.l('e/f/g', { param: 'bass', extra: 'stonks' }, 'en');

      expect(result).toBe('bass baz stonks');
    });

    it('should return string from fallback locale if specified locale does not exist', () => {
      result = localiser.l('e/f/g', { param: 'bass', extra: 'stonks' }, 'stonks');

      expect(result).toBe('bass баз stonks');
    });

    it('should return empty string if specified locKey does not exist', () => {
      result = localiser.l('sto/nk/s', { param: 'bass', extra: 'stonks' }, 'ru');

      expect(result).toBe('');
    });
  });
});
