# View (and controller) help

For your convenience we've added a few example views for rendering fully semantic menues in HTML5 that you can use on your website. Just add your own styling via CSS.

## Installation:

* *First: Install the lib and optionally add one of the mixins*
* Setup your **view** by copying the code from one of the HTML files in this folder.
* Setup your **controller** by copying from the JavaScript examples in this document.

Keep reading for detailed instructions.

# Site menus

Creating menus for navigating your site? Then look no further. With the code in place, just edit some content in your Enonic XP Admin interface and choose to display them in the menu. Voíla!

## Example controller code

Make sure your controller uses `libs.menu.getMenuTree(x)` and sends this into the view as a parameter called `menuItems`, see general installation guide in the root `README.md` file for more info. Now you are done. Edit some content in your Enonic XP Admin interface and choose to display them in the menu. Voíla!

Example basic use:

```javascript
	// Get my menu (based on content having the "Show in menu" checked).
	var menuItems = libs.menu.getMenuTree(2);
	var params = {
		menuItems: menuItems // The name of the variable you send in here - menuItems - is expected by Thymeleaf.
	};

	// Rendering time
	var view = resolve("example-3level.html");
	var body = libs.thymeleaf.render(view, params);
	return { body: body };
```

## Note about Thymeleaf examples

Some classes are added to the wrapping `<li>` element to assist you with styling the menus using CSS. They are easy to change, but here's what they are used for:  
`has-children` - Used to indicate that there are sub menu items present (for displaying drop down icon or similar).  
`path` - Added if this is a parent menu item to the currently viewed page/content on your website.  
`active` - This is the currently viewed page/content on the website. It will not have "path" class.

# Submenus

When extracting submenus you won't be using `getMenuTree` but use `getSubMenus` instead (no need to change your Thymeleaf). It also takes the level-parameter, but needs in addition to that the data for current content. Here's an example:

```javascript
	var content = libs.portal.getContent(); // Get current content (want a menu from another area of your site? Fetch the content data for that item instead!)
	var menuItems = libs.menu.getSubMenus(content,2); // Get submenu based on the content
	var params = {
		menuItems: menuItems // The name of the variable you send in here - menuItems - is expected by Thymeleaf.
	};

	// Rendering time
	var view = resolve("example-2level.html");
	var body = libs.thymeleaf.render(view, params);
	return { body: body };
```

# Breadcrumb menus

This functionality does not rely on the mixin data, but core data stored on each content. To get a breadcrumb menu you send in the optional `params` object containing settings for your menu. It will give back the JSON needed to render a proper menu.

## Breadcrumb settings

The settings for this function are all optional, just send in an empty object, `{}`, if you want to use the defaults. These are the available settings:

**linkActiveItem** (default: false) - Wrap the active (current content) item with a link. If false, the entire a-tag will be skipped and not rendered. This is the best-practise way of doing breadcrumb menus.  
**showHomepage** (default: true) - Disable return of item for the site homepage, meaning the breadcrumb will never link back to the site content, only its children and grand children.  
**homepageTitle** (default: null) - Customize (overwrite) the displayName of home/site link (if used). Common usage: "Home" or "Start". If empty, the site content's displayName value will be used. Using this without setting `showHomepage` to true doesn't have any effect.  
**dividerHtml** (default: null) - Any custom html you want appended to each item, except the last one. Common usage: '<span class="divider">/</span>'.
**urlType** (default: 'server') - Control type of URL to be generated for menu items, default is 'server', only other option is 'absolute'. Read more in the docs for portal.pageUrl().

# Example controller code

Here's an example use:

```javascript
	var breadcrumbs = libs.menu.getBreadcrumbMenu({
		linkActiveItem: false,
		showHomepage: true,
		homepageTitle: 'Home',
		dividerHtml: '<span class="divider">/</span>'
	});
	var params = {
		breadcrumbs: breadcrumbs // The name of the variable you send in here - breadcrumbs - is expected by Thymeleaf.
	};

	// Rendering time
	var view = resolve("example-breadcrumbs.html");
	var body = libs.thymeleaf.render(view, params);
	return { body: body };
```

The return look something like this:

```JSON
{
    "divider": "<span class=\"divider\">/</span>",
    "items": [
        {
            "text": "Home",
            "url": "https://www.example.com",
            "active": false,
				"type": "portal:site"
        },
        {
            "text": "Norwegian",
            "active": false,
            "url": "http://www.example.com/no",
				"type": "com.enonic.xp:landing-page"
        },
        {
            "text": "Subpage",
            "active": false,
            "url": "http://www.example.com/no/sub-page",
				"type": "com.enonic.xp:landing-page"
        },
        {
            "text": "Current page",
            "active": true,
				"type": "com.enonic.xp:article"
        }
    ]
}
```

## Note about Thymeleaf example

Check the file `example-breadcrumbs.html` for an idea of how you can use this data. It contains a few comments that you can remove later. The class names and elements are just a suggestion.
