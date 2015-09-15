# lib-menu

## Usage

### Gradle build script

    repositories {
        maven {
            url 'http://repo.enonic.net/public'
        }
    }

    dependencies {
        include 'com.enonic.lib:menu:1.0.0'
    }

### Controllers

    var menu = require('/lib/enonic/menu/menu');

### Mixin X-data

Any content type that may appear in the menu will need a mixin named "menu-item" with a Checkbox field named "menuItem" and a TextLine
field named "menuName". This mixin must be added as x-data.

## Compatibility

| Lib version        | XP version |
| ------------- | ------------- |
| 1.0.0 | 6.0.0 |