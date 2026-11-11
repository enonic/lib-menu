import type {Content} from '@enonic-types/core';

declare global {
    interface XpLibraries {
        '/lib/menu': typeof import('./index');
    }
}

export type UrlType = 'server' | 'absolute';

export interface GetBreadcrumbMenuParams {
    /** Wrap the active (current content) item with a link. Default is `false`. */
    linkActiveItem?: boolean;
    /** Include an item for the site homepage. */
    showHomepage?: boolean;
    /** Overrides the displayName of the home/site item, e.g. "Home" or "Start". */
    homepageTitle?: string | null;
    /** Custom html to be appended to each item except the last one, e.g. `'<span class="divider">/</span>'`. */
    dividerHtml?: string | null;
    /** Type of URL to generate for the items. Default is `'server'`. */
    urlType?: UrlType;
    /** The `aria-label` text of the `<nav>` element. Default is `'breadcrumbs'`. */
    ariaLabel?: string;
    /** Key (path or id) of the content to build the breadcrumbs for. Default is the content in the current context. */
    currentContent?: string;
    /** Return the full content of each item. Default is `false`. */
    returnContent?: boolean;
}

export interface BreadcrumbMenuItem {
    title: string;
    /** @deprecated Use `title`. */
    text: string;
    /** Whether the item is the current content. */
    active: boolean;
    /** Not set on the active item, unless `linkActiveItem` is `true`. */
    url?: string;
    /** Content type name, e.g. `'portal:site'`. */
    type: string;
    /** Only set when `returnContent` is `true`. */
    content?: Content;
}

export interface BreadcrumbMenu {
    /** The `dividerHtml` parameter, or `null`. */
    divider: string | null;
    ariaLabel: string;
    /** Items ordered from the site homepage to the current content. */
    items: BreadcrumbMenuItem[];
}

export interface GetSubMenusParams {
    /** Type of URL to generate for the menu items. Default is `'server'`. */
    urlType?: UrlType;
    /** Return the full content of each menu item. Default is `false`. */
    returnContent?: boolean;
    /** Query string to add when searching for menu items. */
    query?: string;
    /**
     * Key (path or id) of the content that sets the context of the menu: `isActive` and `inPath` are
     * calculated from it. Default is the content in the current context.
     */
    currentContent?: string;
}

export interface GetMenuTreeParams extends GetSubMenusParams {
    /** The aria label of the menu. Default is `'menu'`. */
    ariaLabel?: string;
}

export interface MenuItem {
    /** The "Override menu name" value of the content, or its displayName. */
    title: string;
    path: string;
    name: string;
    id: string;
    hasChildren: boolean;
    /** Whether the current content is a descendant of this item. */
    inPath: boolean;
    /** Whether this item is the current content. */
    isActive: boolean;
    newWindow: boolean;
    /** Content type name. */
    type: string;
    url: string;
    children: MenuItem[];
    /** Only set when `returnContent` is `true`. */
    content?: Content;
}

export interface MenuTree {
    menuItems: MenuItem[];
    ariaLabel: string;
}

/**
 * Returns the breadcrumb menu for the current content and site.
 *
 * @param params - Optional settings.
 * @returns The breadcrumb menu, or an empty array when no content is found.
 */
export declare function getBreadcrumbMenu(params?: GetBreadcrumbMenuParams): BreadcrumbMenu | [];

/**
 * Creates a menu tree of the content marked with "Show in menu" in the current site.
 * The site is resolved from the execution context, or from `params.currentContent`.
 *
 * @param levels - Number of menu levels to retrieve. Default is `1`.
 * @param params - Optional settings.
 * @returns The menu items with their children, and the aria label of the menu.
 */
export declare function getMenuTree(levels?: number, params?: GetMenuTreeParams): MenuTree;

/**
 * Returns the submenus of a parent content.
 *
 * @param parentContent - Content obtained with `portal.getContent`, `portal.getSite` or any `content.*` function.
 * @param levels - Number of menu levels to retrieve. Default is `1`.
 * @param params - Optional settings.
 * @returns The menu items below the parent content.
 */
export declare function getSubMenus(parentContent: Content, levels?: number, params?: GetSubMenusParams): MenuItem[];
