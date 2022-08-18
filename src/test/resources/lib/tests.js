const t = require('/lib/xp/testing');

// Reused value
const xDataMenuItem = {
    // *shrug* Default value?
    "myapplication": {
        "menu-item": {
            "menuItem": true
        }
    }
};

const testDataSingle = {
    site: {
        _id: 1234,
        _path: "/test",
        type: "portal:site",
        x: xDataMenuItem
    },
    getContent: {
        _id: 1234,
        _path: "/test",
        type: "portal:site",
        x: xDataMenuItem
    }
}

const defaultData = {
    site: null,
    getContent: null
}

// Mockes before require
t.mock("/lib/xp/portal", {
    setTestData: function(mockNodes) {
        this.data = mockNodes;
    },
    clearData: function() {
        delete this.data;
    },
    getSite: function() {
        return this.data.site;
    },
    getContent: function() {
        return this.data.getContent;
    },
    pageUrl: function(params) {
        return "/url";
    }
});

t.mock("/lib/xp/content", {
    setTestData(mockNodes) {
        this.getQueryResult = mockNodes.getQueryResult;
    },
    clearData: function() {
        delete this.data;
    },
    query: function(params) {
        params = params ? params : {};
        return this.getQueryResult ? this.getQueryResult(params) : { hits: [] };
    }
});

const portal = require("/lib/xp/portal");
const contentLib = require("/lib/xp/content");
const menuLib = require("/lib/menu");

exports.testMenuEmpty = function () {
    portal.setTestData(defaultData);
    let result = menuLib.getMenuTree();

    t.assertEquals(0, result.menuItems.length, "Testing empty menu");

    result = menuLib.getMenuTree(3);

    t.assertEquals(0, result.menuItems.length, 0, "Testing empty menu with subLevels");
    portal.clearData();
}

exports.testMenuLabel = function() {
    portal.setTestData(defaultData);
    let result = menuLib.getMenuTree(5);

    t.assertEquals(result.ariaLabel, "menu", "Default value label");

    result = menuLib.getMenuTree(5, { ariaLabel: "myMenu"});

    t.assertEquals(result.ariaLabel, "myMenu", "AriaLabel custom name");
    portal.clearData();
}

exports.testSingleMenuItem = function() {
    portal.setTestData(testDataSingle);
    let result = menuLib.getMenuTree();

    t.assertEquals(1, result.menuItems.length, "Testing menuItems size. Default level");
    t.assertEquals("portal:site", result.menuItems[0].type, "Testing menuItems value");

    result = menuLib.getMenuTree(1);
    t.assertEquals(1, result.menuItems.length, "Testing empty menu with 1 level");

    portal.clearData();
}

const testDataMultiple = {
    site: {
        _id: 1122,
        _path: "/test",
        type: "portal:site",
        x: xDataMenuItem
    },
    getContent: {
        _id: 1144,
        _path: "/test/content/path",
        type: "myapplication:landing-page",
        x: xDataMenuItem
    },
    getQueryResult: function(params) {
        if (!params) return {hits: []}
        if (params.parent && params.parent._path == "/test") {
            return {
                hits: [{
                    _id: 1133,
                    _path: "/test/content",
                    x: xDataMenuItem
                },
                {
                    _id: 2211,
                    _path: "/test/content-path",
                    x: xDataMenuItem
                }]
            }
        }
        else if (params.parent && params.parent._path == "/test/content") {
            return {
                hits: [{
                    _id: 1144,
                    _path: "/test/content/path",
                    type: "myapplication:landing-page",
                    x: xDataMenuItem
                }, {
                    _id: 1155,
                    _path: "/test/content/path-ish",
                    type: "myapplication:landing-page",
                    x: xDataMenuItem
                }]
            }
        } else {
            return {hits: []};
        }
    }
}

exports.testInPathActive = function() {
    portal.setTestData(testDataMultiple);
    contentLib.setTestData(testDataMultiple);

    let result = menuLib.getMenuTree(3);

    t.assertEquals(true, result.menuItems[0].inPath, "Testing site is in the menu path");

    t.assertEquals(true, result.menuItems[1].inPath, "Testing site child is in the menu path");

    t.assertEquals(true, result.menuItems[1].children[0].isActive, "Testing site grandchild is active");
    t.assertEquals(false, result.menuItems[1].children[0].inPath, "Testing site grandchild. Active item is not in path");

    t.assertEquals(false, result.menuItems[1].children[1].inPath, "Testing site grandchild is not in path");

    t.assertEquals(false, result.menuItems[2].inPath, "Testing proper inPath calculation")

    portal.clearData();
    contentLib.clearData();
}

exports.test

/**
 * //TODO
 * exports.testOverrideMenuName = function() {
 *
 * }
 */