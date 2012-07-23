Ext.define('Spelled.view.asset.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.assetstreelist',

    animate: false,
    animCollapse: false,
    store : 'asset.Tree',

    rootVisible: false,

	tbar: [
		{
			text: "Add new asset",
			action: "showCreateAsset",
			icon: 'images/icons/add.png'
		}
	]
});