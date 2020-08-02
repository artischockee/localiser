# Localiser

[![Codecov Coverage](https://img.shields.io/codecov/c/github/artischockee/localiser/master.svg?style=flat-square)](https://codecov.io/gh/artischockee/localiser/)

A set of localisation utilities designed for React applications.

Today it works only with **React Context API** (but I'm gonna extend the variety of possible options).

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
// locale.js

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
// Component.jsx

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
  "component/paragraph/text": "English text" 
}
```

`ru.json`

```json
{
  "component/paragraph/text": "Русский текст" 
}
```

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
      
      <button onClick={handleChangeLanguage}>Change app language</button>
    </>
  );
}
```

And that's all!

When we click the button (triggering the locale to change), our components re-render, which results to updating the `l()` return values.

## Issues

If you find any bugs and other issues when using this library, please let me know about this. Report issues in the specified section.