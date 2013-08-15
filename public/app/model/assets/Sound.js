Ext.define('Spelled.model.assets.Sound', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_sound',

	iconCls: "tree-asset-sound-icon",

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'sound'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'localized', type: 'boolean', defaultValue: false },
		{ name: 'subtype', type: 'string', defaultValue: 'sound' }
	],

	setFile: function( name ) {}
})