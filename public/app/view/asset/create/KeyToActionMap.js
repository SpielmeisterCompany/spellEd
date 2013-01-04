Ext.define('Spelled.view.asset.create.KeyToActionMap', {
    extend: 'Ext.container.Container',
    alias: 'widget.keytoactionconfig',

	initComponent: function() {
		var me = this

		var store = Ext.create( 'Ext.data.Store',{
				fields: [ 'key','action' ],
				data: [],
				listeners: {
					datachanged: Ext.bind( me.onDataChange, me )
				}
			}
		)

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'tool-documentation',
					docString: "#!/guide/asset_type_key_to_action_map",
					width: 'null'
				},
				{
					xtype: 'gridpanel',
					store: store,
					enableColumnHide: false,
					sortableColumns: false,
					name: 'config',
					selType: 'rowmodel',
					plugins: [{
						ptype: 'cellediting',
						clicksToEdit: 1
					}],
					bbar: [
						{
							text: "Add",
							action: "addKeyMapping"
						}
					],
					columns: [
						{
							header: 'Key',
							dataIndex: 'key',
							flex:1,
							editor: {
								xtype        : 'combobox',
								forceSelection: true,
								typeAhead    : true,
								emptyText    : '-- Select a Key --',
								queryMode	 : 'local',
								store        : 'asset.ActionKeys',
								name         : 'name',
								displayField : 'name',
								valueField   : 'name',
								listClass    : 'x-combo-list-small',
								allowBlank   : false
							}
						},
						{
							header: 'Action',
							width: 120,
							dataIndex: 'action',
							editor: {
								xtype: 'textfield',
								allowBlank: false
							}
						},
						{
							xtype: 'actioncolumn',
							width: 30,
							icon: 'images/icons/wrench-arrow.png',
							handler: Ext.bind( me.handleEditClick, me )
						}
					]
				}
			]
		})

		me.addEvents(
			'editclick'
		)

		me.callParent()
	},

	onDataChange: function() {
		if( !this.items ) return
		var grid = this.down( 'gridpanel' )

		grid.fireEvent( 'edit', grid.editingPlugin )
	},

	handleEditClick: function(gridView, rowIndex, colIndex, column, e, record) {
		gridView.getSelectionModel().select( rowIndex )
		this.fireEvent('editclick', gridView, rowIndex, colIndex, column, e);
	}
});
