Ext.define('Spelled.view.menu.contextmenu.ScriptsList', {
    extend: 'Ext.menu.Menu',
    alias : 'widget.scriptslistcontextmenu',

    items: [
        {
			icon: 'images/icons/add.png',
            text: 'Create a new Script',
            action: 'create'
        },
        {
			icon: 'images/icons/delete.png',
            text: 'Remove',
            action: 'remove'
        }
    ]
});