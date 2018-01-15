# Menu lib

This library will assist you with creating different kind of menus in XP. It helps you with the server side and client side code. However, the client side code is optional and can be adjusted to your needs.

## Installation

To install this library you need to update your `build.gradle` file in root. Add the new dependency (after other dependencies) and make sure the Enonic repository URL is set up for maven.

### Gradle 3+

```
plugins {
    id 'com.enonic.lib:menu' version '1.4.0'
}
```

### Gradle - old

```
repositories {
    maven {
        url 'http://repo.enonic.com/public'
    }
}

dependencies {
    include 'com.enonic.lib:menu:1.4.0'
}
```

**Note:** The continuous build-command, `gradle build|deploy -t`, won't detect changes to `build.gradle` file. Make sure you "restart" the build/deploy command.

### Controllers

In every controller you want to use it (Page, Part or Layout) you just `require` the `/lib/enonic/menu` library, like so:

```javascript
var libs = {
	menu: require('/lib/enonic/menu')
}
```

To access any of the functions from this library, just type something like this:

```javascript
var menuItems = libs.menu.getMenuTree(2); // Get 2 levels of menu
var breadcrumbItems = libs.menu.getBreadcrumbMenu({}); // Get a breadcrumb menu

var content = libs.portal.getContent();
var subMenuItems = libs.menu.getSubMenus(content,1); // Get 1 level of submenu (from current content)
```

### Mixin

We include a mixin called `menu-item` with this library. It's available to your app when installing this library  (meaning you can add the `<x-data>` tag to your site.xml without adding a mixin manually first - new in 1.3.3). Overwriting it is very easy, just place a mixin with the same name in your app and that will be used instead.

It is important that you manually update your own app's `site.xml` adding this mixin (ours or your own) referencing this [mixin as a x-data one](](http://docs.enonic.com/en/stable/developer/schema/mixins.html#using-a-mixin) (not inline!). You can also optionally add this mixin to only specific content types, still as x-data.

After this, any content type with this mixin will now get the fields/settings for menu control.

```xml
<!-- Add this line after the end of the config node in site.xml -->
<!-- Or the same line inside the config node of any content type descriptor file -->
<x-data mixin="menu-item" />
```

Check the `/_examples` folder for a few mixins you can just copy and paste into your site. Also read the readme-files in those folders for more information. A mentioned previously, manually adding a mixin to your app with the same name (`mixins/menu-item/menu-item.xml`) will overwrite this library's included mixin.

### Thymeleaf

We've included Thymeleaf fragments you can use for the different types of menues we have. They can be used like this after version `1.4.0` of this lib is installed.

```html
<div data-th-replace="/site/views/fragments/menu :: main-menu"></div>
<div data-th-replace="/site/views/fragments/breadcrumb :: breadcrumb"></div>
```

We've also included a bunch of example code of ready-to-go Thymeleaf in the `/_examples` folder, have a look there if you need to build something custom. Also read the readme-files in those folders for more information.

## Compatibility

| Lib version        | XP version |
| ------------- | ------------- |
| 1.4.0 | 6.12.0 |
| 1.3.3 | 6.3.0 |
| 1.3.2 | 6.3.0 |
| 1.3.1 | 6.3.0 |
| 1.3.0 | 6.3.0 |
| 1.2.0 | 6.3.0 |
| 1.1.1 | 6.1.0 |
| 1.1.0 | 6.1.0 |
| 1.0.0 | 6.0.0 |
