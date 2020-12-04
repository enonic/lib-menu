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
 * @param {Object} [params={}] - A JSON object containing the (optional) settings for the function.
 *   @param {Boolean} [params.linkActiveItem=false] - Wrap the active (current content) item with a link.
 *   @param {Boolean} [params.showHomepage=true] - Disable return of item for the site homepage.
 *   @param {String} [params.homepageTitle=null] - Customize (overwrite) the displayName of home/site link (if used). Common usage: "Home" or "Start".
 *   @param {String} [params.dividerHtml=null] - Any custom html you want appended to each item, except the last one. Common usage: '<span class="divider">/</span>'.
 *   @param {String} [params.urlType="Server"] - Control type of URL to be generated for menu items, default is 'server', only other option is 'absolute'.
 *   @param {String} [params.ariaLabel="breadcrumbs"] - The 'aria-label' attribute text on the '<nav>' element. This should be the name of the navigation, e.g "Breadcrumbs".
 * @returns {Object} - The set of breadcrumb menu items (as array) and needed settings.
 */
exports.getBreadcrumbMenu = function (params = {}) {
    // Safely take care of all incoming settings and set defaults, for use in current scope only
    let settings = {
        linkActiveItem: params.linkActiveItem || false,
        showHomepage: params.showHomepage || true,
        homepageTitle: params.homepageTitle || null,
        dividerHtml: params.dividerHtml || null,
        urlType: params.urlType == "absolute" ? "absolute" : "server",
        ariaLabel: params.ariaLabel || "breadcrumbs",
    };
    
    const site = libs.portal.getSite();
    const content = libs.portal.getContent(); // Fallback to site if there's no content (like in errorHandlers).

    const breadcrumbItems = []; // Stores each menu item
    const breadcrumbMenu = {}; // Stores the final JSON sent to Thymeleaf

    //If no content is found return no results
    if (content == null || content == undefined) {
        return breadcrumbItems;
    }

    // Loop the entire path for current content based on the slashes. Generate one JSON item node for each item.
    // If on frontpage, skip the path-loop
    if (content._path != site._path) {
        const arrVars = content._path.split("/");
        const arrLength = arrVars.length;

        // Skip first item - the site - since it is handled separately.
        for (let i = 1; i < arrLength - 1; i++) {
            const lastVar = arrVars.pop();
            if (lastVar != "") {
                const curItem = libs.content.get({
                    key: arrVars.join("/") + "/" + lastVar,
                }); 
                // Make sure item exists
                if (curItem) {
                    const item = {};
                    const curItemUrl = libs.portal.pageUrl({
                        path: curItem._path,
                        type: settings.urlType,
                    });
                    item.title = curItem.displayName;
                    item.text = curItem.displayName;
                    if (content._path === curItem._path) {
                        // Is current item active?
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
    breadcrumbMenu.ariaLabel = settings.ariaLabel;
    breadcrumbMenu.items = breadcrumbItems.reverse();

    return breadcrumbMenu;
};

/**
 * Get menu tree
 * @param {integer} levels - menu levels to get
 * @param {Object} params - configure the end result. see getSubMenus
 * @param {String} [params.ariaLabel="menu"] - The aria label added to the nav element
 * @returns {Object} 
 * @returns {Array} object.menuItems The list of menuItems and children
 * @returns {String} object.ariaLabel The ariaLabel used for this menu
 */
exports.getMenuTree = function (levels, params) {
    const site = libs.portal.getSite();
    let menuItems = [];
    if (site) {
        menuItems = getSubMenus(site, levels, params);
    } 
    
    return {
        menuItems,
        ariaLabel: params.ariaLabel || "menu",
    };
};

/**
 * Returns submenus of a parent menuitem.
 * @param {Content} parentContent - content object obtained with 'portal.getContent', 'portal.getSite' or any 'content.*' commands
 * @param {Integer} [levels=1] - The number of submenus to retrieve
 * @param {Object} [params = {}] - parameteres to configure
 *  @param {String} [params.urlType=Server] - Control type of URL to be generated for menu items, default is 'server', only other option is 'absolute'.
 *  @param {Boolean} [params.returnContent=false] - Controls what info to return 
 *  @param {String} [params.query=""] - Query string to add when searching for menu items
 * @return {Array}
 */
exports.getSubMenus = getSubMenus;

function getSubMenus(parentContent, levels = 1, params = {}) {
    //default properties
    const settings = {
        urlType: params.urlType == "absolute" ? "absolute" : "server",
        returnContent: params.returnContent != undefined ? params.returnContent : false,
        query: params.query ? params.query : "",
    };

    let currentContent = libs.portal.getContent();

    // In controllers without content return an empty menu
    if (currentContent) {
        return iterateSubMenus(parentContent, levels);
    } else {
        return [];
    }

    function iterateSubMenus(parentContent, levels) {
        const subMenus = [];

        if (parentContent.type === "portal:site" && isMenuItem(parentContent)) {
            subMenus.push(renderMenuItem(parentContent, 0));
        }

        const children = getChildMenuItems(parentContent, settings.query);

        levels--;

        const loopLength = children.hits.length;
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
            inPath = false; // Reset this so an menuitem isn't both in a path and active
        }

        const menuItem = content.x[globals.appPath]["menu-item"];
        const url = libs.portal.pageUrl({
            id: content._id,
            type: settings.urlType,
        });
        let title = content.displayName;

        if (menuItem.menuName && Array.isArray(menuItem.menuName) == false) {
            title = menuItem.menuName;
        }

        const showMenu = {
            title,
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
            content: settings.returnContent ? content : undefined,
        };

        return showMenu;
    }
}

// Searches for menu items and returns the query result
function getChildMenuItems(parent, query) {
    return libs.content.query({
        count: 1000,
        query,
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

// Simple check if content is a menu item
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
