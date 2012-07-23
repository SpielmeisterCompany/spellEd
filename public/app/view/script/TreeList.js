Ext.define('Spelled.view.script.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.scriptstreelist',

    animate: false,
    animCollapse: false,
    store : 'script.Tree',

    rootVisible: false,

	tbar: [
		{
			xtype: 'button',
			icon: "images/icons/script-add.png",
			action: 'showCreateScript',
			text: 'Create new script'
		}
	]
});
