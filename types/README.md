# Types for Menu library

Type definitions for the [Enonic XP Menu library](https://github.com/enonic/lib-menu). They are published with every release, so the version matches the jar.

## Install

```bash
npm i --save-dev @enonic-types/lib-menu
```

## Setup

Add lib-menu to both `types` and `paths` in the `tsconfig.json` file used for your application's server-side TypeScript code:

```json
{
  "compilerOptions": {
    "types": ["@enonic-types/global", "@enonic-types/lib-menu"],
    "paths": {
      "/lib/menu": ["./node_modules/@enonic-types/lib-menu"]
    }
  }
}
```

The `types` entry - next to [`@enonic-types/global`](https://www.npmjs.com/package/@enonic-types/global) - is what types `require('/lib/menu')`. The `paths` entry is what resolves `import ... from '/lib/menu'`.

## Use

```ts
import {getBreadcrumbMenu, getMenuTree} from '/lib/menu';
import type {MenuItem} from '@enonic-types/lib-menu';

const menu = getMenuTree(2, {returnContent: true});

const activeItems: MenuItem[] = menu.menuItems.filter((item) => item.isActive || item.inPath);

const breadcrumbs = getBreadcrumbMenu({ariaLabel: 'breadcrumbs', linkActiveItem: true});
```

```js
const menuLib = require('/lib/menu');

const menu = menuLib.getMenuTree(2);
```

Menu settings and the included Thymeleaf fragments are documented in the [lib-menu README](https://github.com/enonic/lib-menu#readme).
