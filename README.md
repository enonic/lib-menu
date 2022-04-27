# Menu lib

This library will assist you with creating different kind of menus in XP.
It helps you with the server side and client side code.
However, the client side code is optional and can be adjusted to your needs.

## Installation

To install this library you need to add a new dependency to your app's `build.gradle` file.

### Gradle

```
dependencies {
    include 'com.enonic.lib:lib-menu:4.1.1'
}
```

**Note:** The continuous build-command, `gradle build|deploy -t`, won't detect changes to `build.gradle` file. Make sure you "restart" the build/deploy command.

## Usage

Using lib-menu demands adding some code to your app:

1. Storage: Use our included **X-data** or overwrite with your own.
2. Javascript: Use the functions in your **Controller**.
3. HTML: Use our included **Thymeleaf** fragments, or write your own.

### X-data

We include an x-data called `menu-item` with this library.
It will be enabled in your app after adding a dependency to this library
(meaning you can add the `<x-data>` tag to your site.xml without having the x-data scheme in your app). Overwriting it is very easy, just place an x-data with the same name in your app and that will be used instead.

It is important that you manually update your own app's `site.xml` adding this x-data (ours or your own) referencing this [x-data](https://developer.enonic.com/docs/xp/stable/cms/x-data).
You can also optionally add this x-data to specific content types.

After this, any content type with this x-data will now get the fields/settings for menu control.

```xml
<!-- Add this line to your site.xml -->
<!-- or inside any content type descriptor -->
<x-data name="menu-item" />
```

Check the `/_examples` folder for a few x-datas you can just copy and paste into your site. Also read the readme-files in those folders for more information. As mentioned previously, manually adding a x-data to your app with the same name (`x-data/menu-item/menu-item.xml`) will overwrite this library's included x-data.

### Controller

In every controller you want to use it (Page, Part or Layout) you just `require` the `/lib/menu` library.

To access any of the functions from this library use:

```javascript
const libs = {
    menu: require('/lib/menu')
};
```

<h4>Menu structure</h4>

Get 2 levels of menu based on content setting 'Show in menu'
```javascript
let menuItems = libs.menu.getMenuTree(2);
```

Get 2 levels of menu based on content setting 'Show in menu'
```javascript
let menuItems = libs.menu.getMenuTree(2, { returnContent : true });
```

#### getMenuTree(level, options)
| Param | default | description |
| ----- | ------- | ----------- |
| `levels` | 1 | The number of submenus to retrieve |
| `options` | {} | Options object |
| `options.ariaLabel` | "menu" | The aria label for the menu |
| `options.urlType`|  "server" | Control type of URL to be generated for menu items, default is 'server', only other option is 'absolute' |
| `options.returnContent` | false | Controls what info to return
| `options.query` | ""  | Query string to add when searching for menu items
| `options.currentContent` | content in context | Key (path or id) to content used to get the current site, Also check for in path or active based on this.

<h4>Breadcrumb structure</h4>

Get a breadcrumb menu for current content. AriaLabel is optional but recommended.
```javascript
let breadcrumbItems = libs.menu.getBreadcrumbMenu({ navigationAriaLabel: "breadcrumbs" });
```

To be more flexible, subMenuItems require a content to be sent in.
```javascript
const content = libs.portal.getContent();
let subMenuItems = libs.menu.getSubMenus(content,1); // Get 1 level of submenu (from current content)
```

### Thymeleaf

* We've included Thymeleaf fragments you can use for the different types of menues we have. In `2.0.0` version.
* In `4.0.0` need to pass in an argument to the fragments.

```html
<div data-th-replace="/site/views/fragments/enonic-lib-menu/menu :: main-menu (${menu})"></div>
<div data-th-replace="/site/views/fragments/enonic-lib-menu/breadcrumb :: breadcrumb(${breadcrumbs})"></div>
```

We've also included a bunch of example code of ready-to-go Thymeleaf in the `/_examples/views/` folder, have a look there if you need to build something custom. Also read the readme-files in those folders for more information.

## Compatibility

| Lib version        | XP version |
| ------------- | ------------- |
| 4.0.0+ | 7.0.0 |
| 3.0.0+ | 7.0.0 |
| 2.0.0 | 6.13.1 |
| 1.2.0+ | 6.3.0 |
| 1.1.1 | 6.1.0 |
| 1.1.0 | 6.1.0 |
| 1.0.0 | 6.0.0 |
