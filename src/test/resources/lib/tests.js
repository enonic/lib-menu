const t = require('/lib/xp/testing');
const menuLib = require('/lib/menu');

exports.testMenuEmpty = function () {
    const result = menuLib.getMenuTree({});

    t.assertJson({}, result, "Testing empty menu");
}

exports.testMenuLabel = function() {
    const result = menuLib.getMenuTree({});

    // log.info(JSON.stringify(result, null, 4));

    t.assertEquals(JSON.stringify({ menuItems: [], ariaLabel: "menu"}), JSON.stringify(result), "Testing empty menu");
}