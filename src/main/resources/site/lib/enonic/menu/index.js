var libs = {
    portal: require('/lib/xp/portal'),
    content: require('/lib/xp/content')
};

var globals = {
	appPath: app.name.replace(/\./g, '-')
};

/**
 * Get menu tree
 * @param {integer} levels - menu levels to get
 * @returns {Array}
 */
exports.getMenuTree = function(levels) {
    levels = (isInt(levels) ? levels : 1);
    var site = libs.portal.getSite();

    if (!site) {
        return [];
    }
    var menu = exports.getSubMenus(site, levels);

    return menu;
};

/**
 * Returns submenus of a parent menuitem.
 * @param {Content} parentContent - content object obtained with 'portal.getContent', 'portal.getSite' or any 'content.*' commands
 * @param {Integer} levels - The number of submenus to retrieve
 * @return {Array} Array of submenus
 */
exports.getSubMenus = function(parentContent, levels) {
    var subMenus = [];

    if (parentContent.type === 'portal:site' && isMenuItem(parentContent)) {
        subMenus.push(menuItemToJson(parentContent, 0));
    }

    var children = libs.content.getChildren({
        key: parentContent._id,
        count: 200
    });

    levels--;

	var loopLength = children.hits.length;
	for (var i = 0; i < loopLength; i++) {
		var child = children.hits[i];
		if (isMenuItem(child)) {
			subMenus.push(menuItemToJson(child, levels));
		}
	}

	return subMenus;
}


/**
 * Checks if the content is a menu item.
 * @param {Content} content - content object obtained with 'portal.getContent', 'portal.getSite' or any 'content.*' commands
 * @return {Boolean} true if the content is marked as menu item
 */
function isMenuItem(content) {
    var extraData = content.x;
    if (!extraData) {
        return false;
    }
    var extraDataModule = extraData[globals.appPath];
    if (!extraDataModule || !extraDataModule['menu-item']) {
        return false;
    }
    var menuItemMetadata = extraDataModule['menu-item'] || {};
    var menuItemValue = menuItemMetadata['menuItem'];

    return menuItemValue;
}

/**
 * Returns JSON data for a menuitem.
 * @param {Content} content - content object obtained with 'portal.getContent', 'portal.getSite' or any 'content.*' commands
 * @param {Integer} levels - The number of submenus to retrieve
 * @return {Object} Menuitem JSON data
 */
function menuItemToJson(content, levels) {
    var subMenus = [];
    if (levels > 0) {
        subMenus = exports.getSubMenus(content, levels);
    }

	 var inPath = false;
	 var isActive = false;

	 var currentContent = libs.portal.getContent();

	 // Is the menuitem we are processing in the currently viewed content's path?
	 if ( content._path == currentContent._path.substring(0,content._path.length) ) {
		 inPath = true;
	 }

	 // Is the currently viewed content the current menuitem we are processing?
	 if ( content._path == currentContent._path ) {
		 isActive = true;
		 inPath = false; // Reset this so an menuitem isn't both in a path and active (makes no sense)
	 }

    var menuItem = content.x[globals.appPath]['menu-item'];

    return {
        displayName: content.displayName,
        menuName: menuItem.menuName && menuItem.menuName.length ? menuItem.menuName : null,
        path: content._path,
        name: content._name,
        id: content._id,
        hasChildren: subMenus.length > 0,
        inPath: inPath,
        isActive: isActive,
        newWindow: menuItem.newWindow ? menuItem.newWindow : false,
        type: content.type,
        children: subMenus
    };
}

/**
 * Check if value is integer
 * @param value
 * @returns {boolean}
 */
function isInt(value) {
    return !isNaN(value) &&
           parseInt(Number(value)) == value &&
           !isNaN(parseInt(value, 10));
}
