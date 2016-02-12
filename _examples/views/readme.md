For your convenience we've added a few example mixins that you can use on your website.

Installation:

* *First: Add one of the mixins!*
* Just select a file and copy the HTML-code in it
* Go to your apps source code and add this code anywhere you want it
* Make sure your controller uses `libs.menu.getMenuTree(x)` and sends this into the view as a parameter called `menuItems`

Now you are done. Edit some contents in your Enonic XP Admin interface and choose to display them in the menu. Voíla!

## Example controller code

Normal use:

````
	var menuItems = libs.menu.getMenuTree(2);
	var params = {
		menuItems = menuItems
	};

	var view = resolve("myhtmlfile.html");
	var body = libs.thymeleaf.render(view, params);
	return { body: body };
````

Example submenu use:

````
	var content = libs.portal.getContent();
	var menuItems = libs.menu.getSubMenus(content,2);
	var params = {
		menuItems = menuItems
	};

	var view = resolve("myhtmlfile.html");
	var body = libs.thymeleaf.render(view, params);
	return { body: body };
````
