# Config help

For your convenience we've added a few example mixins that you can use on your website. There's three alternatives, one only adding the checkbox `Show in menu?`, one allowing you to overwrite the standard title (displayName) for each item in the menu with a custom one, and the third one for allowing you to toggle opening in a new window.

The second alternative, `example-standard.xml`, is included automatically when you use this library in your app. You only need to reference it. The other two needs to be added to your app manually to work.

## Installation:

1. Copy the code of the mixin you prefer
2. Go to your app's folder `/src/main/resources/site/mixins/`
3. Create a folder called `menu-item` (exactly like this!)
4. Create a new file in here called `menu-item.xml` (or just copy the file here and rename it)
5. Open your `/site.xml` file
6. Add this line after the end of the config node `<x-data mixin="menu-item" />`

**Optionally** you could skip *5.* and *6.* and add the `x-data` mixin reference on a per-content-basis, instead of inside the `site.xml` (which will add the mixin to *all* contents you have, including native XP content types and other apps).

Now you are done. You need to reload any open content in Content Studio to see the new fields.

You are free to change the words (the labels) of these input types. But do not change how they're stored as the code is expecting a specific format on the stored data. All the mixin examples we've added here are tested to work with this lib.
