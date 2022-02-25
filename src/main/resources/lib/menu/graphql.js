var libs = {
  graphql: require("/lib/graphql"),
};

function createGraphQLMenuTree(context) {
  return context.schemaGenerator.createObjectType({
    name: context.uniqueName("Menu"),
    description: "An entry in the menu",
    fields: {
      menuItems: {
        type: libs.graphql.list(createGraphQLMenuItem(context)),
      },
      ariaLabel: {
        type: libs.graphql.GraphQLString
      },
    },
  });
}

function createGraphQLMenuItem(context) {
  return context.schemaGenerator.createObjectType({
    name: context.uniqueName("Menu_Item"),
    description: "An entry in the menu",
    fields: {
      title: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      path: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      name: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      id: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      hasChildren: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLBoolean),
      },
      inPath: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLBoolean),
      },
      isActive: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLBoolean),
      },
      newWindow: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLBoolean),
      },
      type: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      url: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      children: {
        type: libs.graphql.list(libs.graphql.reference("Menu_Item")),
      },
    },
  });
}

function createGraphQLBreadcrumbsMenu(context) {
  return context.schemaGenerator.createObjectType({
    name: context.uniqueName("Breadcrumbs"),
    description: "A breadcrumbs menu",
    fields: {
      divider: {
        type: libs.graphql.GraphQLString,
      },
      ariaLabel: {
        type: libs.graphql.GraphQLString,
      },
      items: {
        type: libs.graphql.list(createGraphQLBreadcrumbsMenuItem(context)),
      },
    },
  });
}

function createGraphQLBreadcrumbsMenuItem(context) {
  return context.schemaGenerator.createObjectType({
    name: context.uniqueName("Breadcrumbs_Item"),
    description: "A menu item",
    fields: {
      title: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      text: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      active: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLBoolean),
      },
      url: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
      type: {
        type: libs.graphql.nonNull(libs.graphql.GraphQLString),
      },
    },
  });
}

exports.createGraphQLMenuTree = createGraphQLMenuTree;
exports.createGraphQLMenuItem = createGraphQLMenuItem;
exports.createGraphQLBreadcrumbsMenu = createGraphQLBreadcrumbsMenu;
exports.createGraphQLBreadcrumbsMenuItem = createGraphQLBreadcrumbsMenuItem;
