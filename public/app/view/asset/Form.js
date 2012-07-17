Ext.define('Spelled.view.asset.Form', {
	extend: 'Ext.form.Panel',
	alias: 'widget.assetform',

	defaults: {
		anchor: '100%',
		allowBlank: false
	},
	xtype: "form",
	bodyPadding: 10,

	items: [
		{
			xtype: "combo",
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
			name: 'name',
			fieldLabel: 'Name'
		},
		{
			xtype: "assetfolderpicker",
			name: 'folder',
			fieldLabel: 'Namespace',
			displayField: 'text',
			valueField: 'id'
		},
		{
			xtype: 'filefield',
			allowBlank: true,
			name: 'asset',
			fieldLabel: 'File',
			labelWidth: 50,
			msgTarget: 'side',
			buttonText: 'Select a File...',
			listeners: {
				'change': function( cmp, value) {
					if( value )
						this.up('form').down('combobox[name="assetId"]').reset()
				}
			},
			validator: function( value ) {
				var file = this.up('form').down('combobox[name="assetId"]').getValue()
				if( ( !file && !value ) )
					return "You need to select a new File"
				else
					return true
			}
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
			formBind: true,
			text: 'Upload',
			action: 'createAsset'
		}
	]

});
