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
import { initialize } from '@artischocke/localiser';
import enResources from './localeResources/en.json';
import ruResources from './localeResources/ru.json';

const localiser = initialize({
  // Provide locale resources in the object below.
  // You can specify any name you wish.
  localeResources: {
    en: enResources,
    ru: ruResources,
  },
  fallbackLocale: 'en',
});

export default localiser;
```

Your localisation resources could look like that:

`localeResources/en.json`

```json
{
  "component/title": "Hello, world",
  "component/copyright": "artischocke (c) 2010 - %currentYear"
}
```

`localeResources/ru.json`

```json
{
  "component/title": "Привет, мир",
  "component/copyright": "артисчхоцке (c) 2010 - %currentYear"
}
```

> Note the fact we've got `currentYear` word here, preceded by `%` symbol. This is dynamic variable, which can be replaced by any value you provide in `l()` function received from `useLocaliser()` hook.
>
> See below for details.

Then, you wrap your core component (`App` in `App.jsx`, for example) in `LocaleProvider`:

```jsx
import React, { useState } from 'react';
import { LocaleProvider } from '@artischocke/localiser';
import localiser from './locale';

export default function App(props) {
  // You can change locale by any means you wish
  const [locale] = useState('en');

  return (
    <LocaleProvider config={localiser} locale={locale}>
      {/* Your application goes here */}
    </LocaleProvider>
  );
}
```

Later on, in `Component.jsx`:

```jsx
import React from 'react';
import { useLocaliser } from '@artischocke/localiser';

export default function Component() {
  const l = useLocaliser();

  const currentYear = new Date().getFullYear(); // suppose it's 2020 year

  return (
    <div>
      <h1>{l('component/title')}</h1>
      <p>{l('component/copyright', { currentYear })}</p>
    </div>
  );
}
```

Result:

```jsx
// locale === 'en'
render(<App />);
// render result:
// <div>
//   <h1>Hello, world</h1>
//   <p>artischocke (c) 2010 - 2020</p>
// </div>

// locale === 'ru'
render(<App />);
// render result:
// <div>
//   <h1>Привет, мир</h1>
//   <p>артисчхоцке (c) 2010 - 2020</p>
// </div>
```

When we change 'locale' state in `App` component (e.g. clicking the control button somewhere in the application), our `LocaleProvider` refreshes its internal knowledge about `locale` (passed as a prop in the provider), then re-render is invoked, which results to updating the `l()` return values.

## API Reference

### `initialize(params)`

Creates localiser instance with specified parameters.

#### Arguments

1. `params` _(required)_. Type: `LocaliserParams`.

   Initialisation parameters.

   1. `localeResources` _(required)_. Type: `Record<string, Record<string, string>>`.

   2. `fallbackLocale`. Type: `string`.

#### Return value

`Localiser` instance.

#### Example

```javascript
import { initialize } from '@artischocke/localiser';

const enResources = {
  'foo/bar/baz': 'foo bar baz',
  'bax/tax/fax': '%word bax tax fax',
};

const ruResources = {
  'foo/bar/baz': 'фоо бар баз',
  'bax/tax/fax': 'бакс такс факс %word',
};

const localiser = initialize({
  localeResources: {
    en: enResources,
    ru: ruResources,
  },
  fallbackLocale: 'en',
});

export default localiser;
```

### `<LocaleProvider />`

A higher-order component (HOC) which provides the app's current locale to its children components.

#### Props

1. `config` _(required)_. Type: `Localiser`.

   You should pass your `Localiser` instance that you obtained from `initialize()` function result.

2. `locale` _(required)_. Type: `string`.

   The app's current locale.

#### Example

```jsx
import React, { useState } from 'react';
import { LocaleProvider } from '@artischocke/localiser';
import localiser from './locale';

export default function App(props) {
  const [locale, setLocale] = useState('en');

  return (
    <LocaleProvider config={localiser} locale={locale}>
      {/* Your application goes here */}
      <button type="button" onClick={() => setLocale('ru')}>
        Switch to RU
      </button>
      <button type="button" onClick={() => setLocale('en')}>
        Switch to EN
      </button>
    </LocaleProvider>
  );
}
```

### `useLocaliser()`

A custom hook that returns function which processes its arguments and returns localised string.

#### Return value

Function `l(locKey, params)`

1. `locKey` _(required)_. Type: `string`.

   A localisation key which addresses to one of the keys in localisation resource files.

2. `params`. Type: `Record<string, any>`.

   An optional object containing key-value pair(s), where each key represents the same word in the specified `locKey` text, and each value is a replacement for the key.

Function `l()` returns `string` with gathered text (either processed or not). The locale resource object, where the string is collected by the library, is found by the current locale.

If `locKey` is not found in current locale resources, the method will try to find the key in the fallback locale provided in config. If no luck - the function returns `''` (empty string).

#### Example

```jsx
import React from 'react';
import { useLocaliser } from '@artischocke/localiser';

export default function Component() {
  const l = useLocaliser();

  const currentYear = new Date().getFullYear(); // suppose it's 2020 year

  return (
    <div>
      <h1>{l('component/title')}</h1>
      <p>{l('component/copyright', { currentYear })}</p>
    </div>
  );
}

// locale === 'en'
// render result:
// <div>
//   <h1>Hello, world</h1>
//   <p>artischocke (c) 2010 - 2020</p>
// </div>

// locale === 'ru'
// render result:
// <div>
//   <h1>Привет, мир</h1>
//   <p>артисчхоцке (c) 2010 - 2020</p>
// </div>
```

## To-do list

- [ ] Write documentation on GitHub Wiki
- [x] Implement own Context provider to "unbind" from user's Context
- [ ] Implement interaction with Redux (as self-sufficient option of the library)
- [ ] Implement standalone option of the library (no binding to React, Redux, etc.)

## Issues

If you find any bugs and other issues when using this library, please let me know about this. Report issues in the specified section.
