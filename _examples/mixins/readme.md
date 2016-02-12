# Config help

For your convenience we've added a few example mixins that you can use on your website.

## Installation:

* Copy the code of the mixin you prefer
* Go to your apps source code into the folder `/site/mixins/`
* Create a folder called `menu-item`
* Create a new file in here called `menu-item.xml` (or just copy the file here and rename it)
* Open your `/site.xml` file
* Add this line after the end of the config node `<x-data mixin="menu-item" />`

Now you are done. You might need to reload the Admin interface of Enonic XP to see the new mixin.

You are free to change the words (the labels) of these input types. But do not change the names as the code is expecting a specific format on the stored data. All the mixin examples we've added here are tested and validated to work with this lib.
