const libs = {
    portal: require("/lib/xp/portal"),
    content: require("/lib/xp/content"),
};

const globals = {
    appPath: app.name.replace(/\./g, '-')
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
 *   @param {String} [params.currentContent] - Key to content used to get the current site, Also gets content is in path or active based on this.
 * @returns {Object} - The set of breadcrumb menu items (as array) and needed settings.
 */
exports.getBreadcrumbMenu = function (params) {
    // Safely take care of all incoming settings and set defaults.
    let settings = {
        linkActiveItem: params.linkActiveItem || false,
        showHomepage: params.showHomepage || true,
        homepageTitle: params.homepageTitle || null,
        dividerHtml: params.dividerHtml || null,
        urlType: params.urlType == "absolute" ? "absolute" : "server",
        ariaLabel: params.ariaLabel || "breadcrumbs",
        currentContent: params.currentContent ?
            libs.content.get({ key: params.currentContent }) :
            libs.portal.getContent()
    };

    const site = settings.currentContent ? libs.content.getSite({ key: settings.currentContent._path }) : libs.portal.getSite();
    const content =  settings.currentContent;
    const breadcrumbItems = []; // Stores each menu item
    const breadcrumbMenu = {}; // Stores the final JSON

    //If no content is found return no results
    if (content == null || content == undefined) {
        return breadcrumbItems;
    }

    // Loop the entire path for current content based on the slashes. Generate one JSON item node for each.
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

                    // remove text in next major version
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
 * Creates a menu tree structure
 * The root site is based on execution context or the currentContent
 * @param {Number} levels - menu levels to get
 * @param {Object} [params={}] - configure the end result
 * @param {String} [params.ariaLabel="menu"] - The aria label added to the nav element
 *  @param {String} [params.urlType="Server"] - Control type of URL to be generated for menu items, default is 'server', only other option is 'absolute'
 *  @param {Boolean} [params.returnContent] - Controls what info to return
 *  @param {String} [params.query=""] - Query string to add when searching for menu items
 *  @param {String} [params.currentContent] - Key (path or id) used to get the current site and if its in path or active based on this content.
 * @returns {Object}
 *  @returns {Array} object.menuItems The list of menuItems and children
 *  @returns {String} object.ariaLabel The ariaLabel used for this menu
 */
exports.getMenuTree = function (levels, params) {
    if (!params) {
        params = {};
    }
    const site = params.currentContent ? libs.content.getSite({ key: params.currentContent }) : libs.portal.getSite();
    let menuItems = [];

    if (site) {
        menuItems = getSubMenus(site, levels, params);
    }

    let ariaLabel = "menu";
    if (params && params.ariaLabel) {
        ariaLabel = params.ariaLabel;
    }

    return {
        menuItems: menuItems,
        ariaLabel: ariaLabel,
    };
};

/**
 * Recursive method that searches through content
 * @param {Content} parentContent
 * @param {Number} levels
 * @param {Object} settings
 * @returns
 */
function iterateSubMenus(parentContent, levels, settings) {
    const subMenus = [];

    if (parentContent.type === "portal:site" && isMenuItem(parentContent)) {
        subMenus.push(renderMenuItem(parentContent, 0, settings));
    }

    const children = getChildMenuItems(parentContent, settings.query);

    levels--;

    const loopLength = children.hits.length;
    for (let i = 0; i < loopLength; i++) {
        let child = children.hits[i];
        subMenus.push(renderMenuItem(child, levels, settings));
    }

    return subMenus;
}

/**
 * Calculates the end result for the menuItem that will be returned.
 * @param {Content} content The item in the menu we want data for
 * @param {Number} levels How deep the search should go
 * @param {object} settings see getSubMenus
 * @returns {Object}
 */
function renderMenuItem(content, levels, settings) {
    let subMenus = [];
    if (levels > 0) {
        subMenus = iterateSubMenus(content, levels, settings);
    }

    let inPath = false;
    let isActive = false;
    // Could still be empty if on an error page or something
    if (settings.currentContent) {
        if (content._path === settings.currentContent._path) {
            // Is the currently viewed content the current menuitem we are processing?
            isActive = true;
        } else if (settings.currentContent._path.indexOf(`${content._path}/`) === 0) {
            // Is the menuitem we are processing in the currently viewed content's path?
            inPath = true;
        }
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

/**
 * Returns submenus of a parent menuitem.
 * @param {Content} parentContent - content object obtained with 'portal.getContent', 'portal.getSite' or any 'content.*' commands
 * @param {Number} [levels=1] - The number of submenus to retrieve
 * @param {Object} [params = {}] - parameteres to configure
 *  @param {string} [params.currentContent] - The content that sets the context of the menu. CurrentContent defaults to the current context content: portal.getContent().
 *  @param {Boolean} [params.returnContent] - Controls what info to return
 *  @param {String} [params.urlType="Server"] - Control type of URL to be generated for menu items, default is 'server', only other option is 'absolute'
 * @return {Array}
 */
function getSubMenus(parentContent, levels, params) {
    if (!levels) {
        levels = 1;
    }
    if (!params) {
        params = {};
    }
    const currentContent = params.currentContent ?
    libs.content.get({ key: params.currentContent }) :
    libs.portal.getContent();

    //default properties
    const settings = {
        urlType: params.urlType == "absolute" ? "absolute" : "server",
        returnContent: params.returnContent != undefined ? params.returnContent : false,
        query: params.query ? params.query : "",
        currentContent: currentContent,
    };

    return iterateSubMenus(parentContent, levels, settings);
}

exports.getSubMenus = getSubMenus;

// Searches for menu items and returns the query result
function getChildMenuItems(parent, query) {
    return libs.content.query({
        count: 1000,
        query: query,
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
