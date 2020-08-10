import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Localiser, { LocaliserInstance } from '../index';

describe('Localiser', () => {
  describe('init()', () => {
    let localiser: LocaliserInstance;

    it('should return new instance of LocaliserInstance class', () => {
      localiser = Localiser.init({
        localeResources: {},
        context: React.createContext(null),
        localeContextPath: '',
        defaultLocale: 'ru',
      });

      expect(localiser).toBeInstanceOf(LocaliserInstance);
    });
  });

  describe('usual usage', () => {
    let localiser: LocaliserInstance;
    let AppContext: React.Context<any>;
    let WrapperComponent: React.FC;
    let Component: React.FC;

    beforeAll(() => {
      const localeResources = {
        ru: {
          'a/b/c': 'фоо бар',
          'c/d/e': 'фоо %str',
          'e/f/g': '%param баз %extra',
        },
        en: {
          'a/b/c': 'foo bar',
          'c/d/e': 'foo %str',
          'e/f/g': '%param baz %extra',
        },
      };

      AppContext = React.createContext({
        data: {
          locale: 'en',
        },
        dispatch: () => {},
      });

      localiser = Localiser.init({
        localeResources,
        context: AppContext,
        localeContextPath: 'data.locale',
        defaultLocale: 'ru',
      });

      WrapperComponent = function () {
        const [context, setContext] = React.useState({ locale: 'en' });

        return (
          <AppContext.Provider value={{ data: context, dispatch: setContext }}>
            <Component />
          </AppContext.Provider>
        );
      };

      Component = function () {
        const { dispatch } = React.useContext(AppContext);

        return (
          <>
            <p role="loc-phrase">{localiser.l('a/b/c')}</p>
            <button
              onClick={() =>
                dispatch((prevState: any) => ({
                  ...prevState,
                  locale: prevState.locale === 'en' ? 'ru' : 'en',
                }))
              }
            >
              Change language
            </button>
          </>
        );
      };
    });

    describe('component rendering', () => {
      it('should render "a/b/c" locale key in English', () => {
        render(<WrapperComponent />);

        expect(screen.getByRole('loc-phrase')).toHaveTextContent('foo bar');
      });

      it('should switch locale and render "a/b/c" locale key in Russian', () => {
        render(<WrapperComponent />);

        fireEvent.click(screen.getByText('Change language'));

        expect(screen.getByRole('loc-phrase')).toHaveTextContent('фоо бар');
      });
    });

    describe('ls()', () => {
      let result: string | null;

      it('should return correct and processed string (params = null)', () => {
        result = localiser.ls('a/b/c', null, 'en');

        expect(result).toBe('foo bar');
      });

      it('should return correct and processed string (params = {})', () => {
        result = localiser.ls('a/b/c', {}, 'en');

        expect(result).toBe('foo bar');
      });

      it('should return the same string if params contain non-existing key', () => {
        result = localiser.ls('a/b/c', { iAmDoNotExist: 'I am very sorry' }, 'en');

        expect(result).toBe('foo bar');
      });

      it('should return correct and processed string (with 1 param)', () => {
        result = localiser.ls('c/d/e', { str: 'testing' }, 'en');

        expect(result).toBe('foo testing');
      });

      it('should return correct and processed string (with 2+ params)', () => {
        result = localiser.ls('e/f/g', { param: 'bass', extra: 'stonks' }, 'en');

        expect(result).toBe('bass baz stonks');
      });

      it('should return empty string if specified locale does not exist', () => {
        result = localiser.ls('e/f/g', { param: 'bass', extra: 'stonks' }, 'stonks');

        expect(result).toBe('');
      });

      it('should return empty string if specified locKey does not exist', () => {
        result = localiser.ls('sto/nk/s', { param: 'bass', extra: 'stonks' }, 'ru');

        expect(result).toBe('');
      });
    });
  });
});
