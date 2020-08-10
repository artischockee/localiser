# Localiser

[![Codecov Coverage](https://img.shields.io/codecov/c/github/artischockee/localiser/master.svg?style=flat-square)](https://codecov.io/gh/artischockee/localiser/)
[![NPM version](https://img.shields.io/npm/v/@artischocke/localiser?style=flat-square)](https://www.npmjs.com/package/@artischocke/localiser)
![Minified size](https://img.shields.io/bundlephobia/min/@artischocke/localiser?style=flat-square)

A set of localisation utilities designed for React applications.

Today it works only with [**React Context API**](https://reactjs.org/docs/context.html) (but I'm gonna extend the variety of possible options).

## Install

```
npm install @artischocke/localiser
```

or, using Yarn:

```
yarn add @artischocke/localiser
```

## Usage

Suppose you wish to store the configuration in `locale.js`:

```javascript
import Localiser from '@artischocke/localiser';
import AppContext from '../appContext';
import ruResources from './localeResources/ru.json';
import enResources from './localeResources/en.json';

const localiser = Localiser.init({
  // Provide locale resources in the object below.
  // You can specify any name you wish.
  localeResources: {
    ru: ruResources,
    en: enResources,
  },
  // Specify the React Context instance where
  // the application's locale stores.
  context: AppContext,
  // Indicate the path to the locale variable in
  // the context object (that you provided above)
  // (please read explanations below).
  localeContextPath: 'data.locale',
  // As a fallback, default locale can be used.
  defaultLocale: 'ru',
});

export default localiser;
```

Later on, in `Component.jsx`:

```jsx
import React from 'react';
import localiser from '../services/locale';

export default function Component() {
  return (
    <p>{localiser.l('component/paragraph/text')}</p>
  );
}
```

Result:

```javascript
// locale = 'en';
render(Component);
// --> <p>English text</p>

// locale = 'ru';
render(Component);
// --> <p>Русский текст</p>;
```

### Detailed description

Imagine your localisation resources look like that:

`en.json`

```json
{
  "component/paragraph/text": "English text",
  "component/span/text": "We have %number bricks"
}
```

`ru.json`

```json
{
  "component/paragraph/text": "Русский текст",
  "component/span/text": "У нас есть %number кирпичей"
}
```

> Note the fact we've got `number` word here, preceded by `%` symbol. This is dynamic variable, which can be replaced by any value you provide in `.l()` and `.ls()` functions.
> 
> Look below for the details. 

Then, we create context (with **React Context API**):

`appContext.js`

```javascript
const AppContext = React.createContext({
  data: {
    locale: 'en',
  },
  dispatch: () => {},
});

export default AppContext;
```

Now we can create new Localiser instance:

`locale.js`

```javascript
import Localiser from '@artischocke/localiser';
import AppContext from '../appContext';
import ruResources from './localeResources/ru.json';
import enResources from './localeResources/en.json';

const localiser = Localiser.init({
  localeResources: {
    ru: ruResources,
    en: enResources,
  },
  context: AppContext,
  // Because our AppContext's structure is:
  // {
  //   data: { locale: string },
  //   dispatch: () => void,
  // }
  // We must specify the path to the locale variable
  // in AppContext object, so 'data.locale' will be enough.
  localeContextPath: 'data.locale',
  defaultLocale: 'ru',
});

export default localiser;
```

In the core component (optionally) we create internal state and return `<AppContext.Provider>` as a wrapper for our application:

`App.jsx`

```jsx
import React from 'react';
import AppContext from './appContext';
import Component from './Component';

export default function App(props) {
  const [context, setContext] = React.useState({
    locale: 'en',
  });

  return (
    <AppContext.Provider value={{ data: context, dispatch: setContext }}>
      <Component />
    </AppContext.Provider>
  );
}
```

Eventually, we create our common app component:

`Component.jsx`

```jsx
import React from 'react';
import localiser from '../localiser';
import AppContext from './appContext';

export default function Component(props) {
  const { dispatch } = React.useContext(AppContext);

  function handleChangeLanguage() {
    dispatch((prevState) => ({
      ...prevState,
      locale: prevState.locale === 'en' ? 'ru' : 'en',
    }));
  }

  return (
    <>
      <p>{localiser.l('component/paragraph/text')}</p>
      {/* Use ls() function when you want to control locale manually */}
      <p>{localiser.ls('component/paragraph/text', null, 'ru')}</p>
      {/* Second argument could be an object containing replacement data for the keys.
          In 'component/span/text' key we have '%number' word, which, in this case,
          will be replaced with '30'. */}
      <span>{localiser.l('component/span/text', { number: 30 })}</span>      

      <button onClick={handleChangeLanguage}>Change app language</button>
    </>
  );
}
```

And that's all!

When we click the button (triggering the locale to change), our components re-render, which results to updating the `l()` return values.

## API Reference

### `init(params)`

Creates localiser instance with specified parameters.

#### Arguments

1. `params` *(required)*. Type: `Params`.

   Initialisation parameters.

   ```typescript
   interface Params {
     localeResources: Record<string, Record<string, string>>;
     context: React.Context<any>;
     localeContextPath: string;
     defaultLocale?: string;
   }
   ```
   
#### Return value

`LocaliserInstance` object with `.l()` and `.ls()` methods.
   
#### Example

```javascript
import React from 'react';
import Localiser from '@artischocke/localiser';

const ruResources = {
  'foo/bar/baz': 'фоо бар баз',
  'bax/tax/fax': 'бакс такс факс %word'
};

const enResources = {
  'foo/bar/baz': 'foo bar baz',
  'bax/tax/fax': '%word bax tax fax'
};

const AppContext = React.createContext({
  data: {
    locale: 'en',
  },
});

const localiser = Localiser.init({
  localeResources: {
    ru: ruResources,
    en: enResources,
  },
  context: AppContext,
  localeContextPath: 'data.locale',
  defaultLocale: 'en',
});

export default localiser;
```
   
### `l(locKey, params)`

Returns localised string based on locale specified in `.init()` function (via **React Context**).

#### Arguments

1. `locKey` *(required)*. Type: `string`.

   Locale key specified in locale resources provided in `.init()` function.
   
2. `params`. Type: `Record<string, any>`.

   An object containing key-value pair(s), where each key represents the same word in the specified `locKey` text, and each value is a replacement for the key.
   
#### Return value

`string` with gathered text (either processed or not). The locale resource object, where the string is collected by the library, is found by the current locale (in provided `Context`).

If `locKey` is not found in locale resources - the function returns `''` (empty string).

#### Example

```jsx
import React from 'react';
import localiser from '../localiser';

export default function Component() {
  return (
    <>
      <p>{localiser.l('foo/bar/baz')}</p>
      {/* 'bax/tax/fax': '%word bax tax fax' */}
      <span>{localiser.l('bax/tax/fax', { word: 'super!' })}</span>
      <span>{localiser.l('bax/tax/fax', { nonExistingKey: 'you will be upset' })}</span>
      <p>{localiser.l('non/existing/locKey', { evenWith: 'params' })}</p> 
    </>
  );
}

// Render result (if locale is 'en'):
//   <p>foo bar baz</p>
//   <span>super! bax tax fax</span>
//   <span>%word bax tax fax</span>
//   <span></span>
```

### `ls(locKey, params, locale)`

Returns localised string based on `locale` argument.

It is a 'standalone' version of `.l()`, which means you do not actually need to have locale value in `Context`.

This function is not using provided `Context` at all.

#### Arguments

1. `locKey` *(required)*. Type: `string`.

   Locale key specified in locale resources provided in `.init()` function.
   
2. `params` *(required)*. Type: `Record<string, any>` or `null`.

   An object containing key-value pair(s), where each key represents the same word in the specified `locKey` text, and each value is a replacement for the key.
   
   If no `params` assumed to use - just pass `null` or `{}`.
   
3. `locale` *(required)*. Type: `string`.

   String that matches one of the keys of locale resources.
   
#### Return value

`string` with gathered text (either processed or not). The locale resource object, where the string is collected by the library, is found by the `locale` argument.

#### Example

```jsx
import React from 'react';
import localiser from '../localiser';

export default function Component() {
  return (
    <>
      {/* [ru] 'foo/bar/baz': 'фоо бар баз' */}
      <p>{localiser.ls('foo/bar/baz', null, 'ru')}</p>
      {/* [ru] 'bax/tax/fax': 'бакс такс факс %word' */}
      <span>{localiser.ls('bax/tax/fax', { word: 'super!' }, 'ru')}</span>
      <span>{localiser.ls('bax/tax/fax', { word: 'classy!' }, 'en')}</span>
    </>
  );
}

// Render result (no matter which 'locale' is in Context):
//   <p>фоо бар баз</p>
//   <span>бакс такс факс super!</span>
//   <span>classy! bax tax fax</span>
```

## Issues

If you find any bugs and other issues when using this library, please let me know about this. Report issues in the specified section.