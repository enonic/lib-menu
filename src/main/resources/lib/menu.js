const libs = {
    portal: require("/lib/xp/portal"),
    content: require("/lib/xp/content"),
    util: require("/lib/util"),
};

const globals = {
    appPath: libs.util.app.getJsonName(),
};

/**
 * Returns the full breadcrumb menu path for the current content and site.
 * @param {Object} params - A JSON object containing the (optional) settings for the function.
 *   @param {Boolean} [params.linkActiveItem=false] - Wrap the active (current content) item with a link.
 *   @param {Boolean} [params.showHomepage=true] - Disable return of item for the site homepage.
 *   @param {String} [params.homepageTitle=null] - Customize (overwrite) the displayName of home/site link (if used). Common usage: "Home" or "Start".
 *   @param {String} [params.dividerHtml=null] - Any custom html you want appended to each item, except the last one. Common usage: '<span class="divider">/</span>'.
 *   @param {String} [params.urlType=Server] - Control type of URL to be generated for menu items, default is 'server', only other option is 'absolute'.
 * @returns {Object} - The set of breadcrumb menu items (as array) and needed settings.
 */
exports.getBreadcrumbMenu = function (params = {}) {
    let site = libs.portal.getSite();
    let content = libs.portal.getContent() || site; // Fallback to site if there's no content (like in errorHandlers).

    let breadcrumbItems = []; // Stores each menu item
    let breadcrumbMenu = {}; // Stores the final JSON sent to Thymeleaf

    // Safely take care of all incoming settings and set defaults, for use in current scope only
    const settings = {
        linkActiveItem: params.linkActiveItem || false,
        showHomepage: params.showHomepage || true,
        homepageTitle: params.homepageTitle || null,
        dividerHtml: params.dividerHtml || null,
        urlType: params.urlType == "absolute" ? "absolute" : "server",
    };

    // Loop the entire path for current content based on the slashes. Generate one JSON item node for each item.
    // If on frontpage, skip the path-loop
    if (content._path != site._path) {
        let fullPath = content._path;
        let arrVars = fullPath.split("/");
        let arrLength = arrVars.length;
        for (let i = 1; i < arrLength - 1; i++) {
            // Skip first item - the site - since it is handled separately.
            let lastVar = arrVars.pop();
            if (lastVar != "") {
                //Could replace with 7.1.0 exists
                let curItem = libs.content.get({
                    key: arrVars.join("/") + "/" + lastVar,
                }); // Make sure item exists
                if (curItem) {
                    let item = {};
                    let curItemUrl = libs.portal.pageUrl({
                        path: curItem._path,
                        type: settings.urlType,
                    });
                    item.title = curItem.displayName;
                    item.text = curItem.displayName;
                    if (content._path === curItem._path) {
                        // Is current node active?
                        item.active = true;
                        if (settings.linkActiveItem) {
                            // Respect setting for creating links for active item
                            item.url = curItemUrl;
                        }
                    } else {
                        item.active = false;
                        item.url = curItemUrl;
                    }
                    item.type = curItem.type;
                    breadcrumbItems.push(item);
                }
            }
        }
    }

    // Add Home button linking to site home, if wanted
    if (settings.showHomepage) {
        let homeUrl = libs.portal.pageUrl({
            path: site._path,
            type: settings.urlType,
        });
        let item = {
            title: settings.homepageTitle || site.displayName, // Fallback to site displayName if no custom name given
            text: settings.homepageTitle || site.displayName,
            url: homeUrl,
            active: content._path === site._path,
            type: site.type,
        };
        breadcrumbItems.push(item);
    }

    // Add divider html (if any) and reverse the menu item array
    breadcrumbMenu.divider = settings.dividerHtml;
    breadcrumbMenu.items = breadcrumbItems.reverse();

    return breadcrumbMenu;
};

/**
 * Get menu tree
 * @param {integer} levels - menu levels to get
 * @param {Object} params - configure the end result. see getSubMenus
 *   @param {String} [params.urlType=Server] - Control type of URL thats generated in getSubMenus.

 * @returns {Array}
 */
exports.getMenuTree = function (levels, params) {
    let menu = [];
    let site = libs.portal.getSite();
    if (site) {
        menu = getSubMenus(site, levels, params);
    }

    return menu;
};

/**
 * Returns submenus of a parent menuitem.
 * @param {Content} parentContent - content object obtained with 'portal.getContent', 'portal.getSite' or any 'content.*' commands
 * @param {Integer} [levels=1] - The number of submenus to retrieve
 * @param {Object} params - parameteres to configure
 *   @param {String} [params.urlType=Server] - Control type of URL to be generated for menu items, default is 'server', only other option is 'absolute'.
 * @return {Array} Array of submenus
 */
exports.getSubMenus = getSubMenus;

function getSubMenus(parentContent, levels = 1, params = {}) {
    const settings = {
        urlType: params.urlType == "absolute" ? "absolute" : "server",
    };

    // Fallback to currentContent if there's no content (like in errorHandlers).
    let currentContent = libs.portal.getContent() || parentContent;

    return iterateSubMenus(parentContent, levels);

    function iterateSubMenus(parentContent, levels) {
        let subMenus = [];

        if (parentContent.type === "portal:site" && isMenuItem(parentContent)) {
            subMenus.push(renderMenuItem(parentContent, 0));
        }

        let children = getChildMenuItems(parentContent);

        levels--;

        let loopLength = children.hits.length;
        for (let i = 0; i < loopLength; i++) {
            let child = children.hits[i];
            subMenus.push(renderMenuItem(child, levels));
        }

        return subMenus;
    }

    //currentContent is by sub method
    function renderMenuItem(content, levels) {
        let subMenus = [];
        if (levels > 0) {
            subMenus = iterateSubMenus(content, levels);
        }

        let inPath = false;
        let isActive = false;

        // Is the menuitem we are processing in the currently viewed content's path?
        if (
            content._path ===
            currentContent._path.substring(0, content._path.length)
        ) {
            inPath = true;
        }

        // Is the currently viewed content the current menuitem we are processing?
        if (content._path === currentContent._path) {
            isActive = true;
            inPath = false; // Reset this so an menuitem isn't both in a path and active (makes no sense)
        }

        let menuItem = content.x[globals.appPath]["menu-item"];
        let url = libs.portal.pageUrl({
            id: content._id,
            type: settings.urlType,
        });
        let title = content.displayName;

        if (menuItem.menuName && Array.isArray(menuItem.menuName) == false) {
            title = menuItem.menuName;
        }

        return {
            title,
            displayName: content.displayName,
            menuName:
                menuItem.menuName && menuItem.menuName.length
                    ? menuItem.menuName
                    : null,
            path: content._path,
            name: content._name,
            id: content._id,
            hasChildren: subMenus.length > 0,
            inPath,
            isActive,
            newWindow: menuItem.newWindow ? menuItem.newWindow : false,
            type: content.type,
            url,
            children: subMenus,
        };
    }
}

function getChildMenuItems(parent) {
    return libs.content.query({
        count: 1000,
        sort: parent.childOrder,
        filters: {
            boolean: {
                must: [
                    {
                        hasValue: {
                            field: "_parentPath",
                            values: ["/content" + parent._path],
                        },
                    },
                    {
                        hasValue: {
                            field:
                                "x." + globals.appPath + ".menu-item.menuItem",
                            values: ["true"],
                        },
                    },
                ],
            },
        },
    });
}

function isMenuItem(content) {
    var extraData = content.x;
    if (!extraData) {
        return false;
    }
    var extraDataModule = extraData[globals.appPath];
    if (!extraDataModule || !extraDataModule["menu-item"]) {
        return false;
    }
    var menuItemMetadata = extraDataModule["menu-item"] || {};

    return menuItemMetadata.menuItem;
}
