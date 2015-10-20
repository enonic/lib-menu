# lib-menu

## Usage

To "install" this library you need to update your build.gradle file in root. Add the new dependency (after other dependencies) and make sure the Enonic repository URL is set up for maven.

**Note:** The "gradle watch" command won't detect this change, so use "gradle deploy" after changing your build.gradle file.

### Gradle build script

```
repositories {
    maven {
        url 'http://repo.enonic.net/public'
    }
}

dependencies {
    include 'com.enonic.lib:menu:1.1.0'
}
```

### Controllers

In every controller you want to use it (Page, Part or Layout) you just add this at the top of the file:

```javascript
var menu = require('/lib/enonic/menu');
```

To access any of the functions from this library, just type something like this:

```javascript
var menuItems = menu.getMenuTree(2); // Get 2 levels of menu
```

### Mixin X-data

Any content type that may appear in the menu will need a mixin named "menu-item" with a Checkbox field named "menuItem" and a TextLine
field named "menuName". This mixin must be added as x-data.

## Compatibility

| Lib version        | XP version |
| ------------- | ------------- |
| 1.0.0 | 6.0.0 |
| 1.1.0 | 6.1.0 |
