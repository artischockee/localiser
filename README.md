# Localiser

**Sorry for the inconvenience, the library at the moment does not work as expected. Please wait for the stable release. Once the issues will be solved, this remark will be deleted.**

A set of localisation utilities primarily for React applications.

## Install

```
npm install @artischocke/localiser
```

or, using Yarn:

```
yarn add @artischocke/localiser
```

## Usage

```javascript
// locale.js

import { useContext } from 'react';
import Localiser from '@artischocke/localiser';
import appContext from '../appContext';
import ruResources from './localeResources/ru.json';
import enResources from './localeResources/en.json';

const defaultLocale = 'ru';

const localiser = Localiser.init(
  // Provide locale resources in the object below.
  // You can specify any name you wish.
  {
    ru: ruResources,
    en: enResources,
  },
  // You can provide any locale as a string,
  // just make sure the string equals to one of the
  // provided locale resources name above.
  useContext(appContext).locale,
  // As a fallback, default locale can be used.
  defaultLocale
);

export default localiser;
```