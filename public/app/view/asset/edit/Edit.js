Ext.define('Spelled.view.asset.edit.Edit', {
	extend: 'Ext.Window',
	alias: 'widget.editasset',

	title : 'Edit a existing Asset',
	modal : true,

	layout: 'fit',

	width : 450,

	closable: true,

	items: [ {
		xtype: 'assetform',

		defaults: {
			anchor: '100%',
			allowBlank: true
		},

		api: {
			submit: Spelled.AssetsActions.update
		},

		items: [
			{
				xtype: "combo",
				disabled: true,
				readOnly: true,
				name: 'type',
				editable: false,
				emptyText: '-- Select Type --',
				store: 'asset.Types',
				queryMode: 'local',
				fieldLabel: "Type",
				displayField: 'name',
				valueField: 'type'
			},
			{
				xtype: "textfield",
				disabled: true,
				name: 'name',
				fieldLabel: 'Name'
			},
			{
				xtype: "assetfolderpicker",
				disabled: true,
				readOnly: true,
				name: 'folder',
				fieldLabel: 'Import into',
				displayField: 'text',
				valueField: 'id'
			},
			{
				xtype: 'filefield',
				name: 'asset',
				fieldLabel: 'Asset',
				labelWidth: 50,
				msgTarget: 'side',
				buttonText: 'Select a File...'
			},
			{
				xtype: 'menuseparator'
			},{
				xtype: 'spritesheetconfig',
				hidden: true
			},{
				xtype: 'animationassetconfig',
				hidden: true
			}
		],


		buttons: [
			{
				text: 'Edit',
				action: 'editAsset'
			}
		]

	}]
});