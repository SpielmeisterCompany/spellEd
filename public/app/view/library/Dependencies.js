Ext.define('Spelled.view.library.Dependencies', {
    extend: 'Ext.container.Container',
    alias : 'widget.spelldependencies',

	requires: [
		'Spelled.model.DependencyNode'
	],

	layout: {
		type: 'vbox',
		align: 'center'
	},

	defaults: {
		flex: 1,
		width: '100%',
		hideHeaders: true
	},

	addAdditionalNodeInformation: function( node ) {
		var store      = Ext.getStore( 'Library'),
			rootRecord = store.findLibraryItemByLibraryId( node.get( 'libraryId' ) )

		if( rootRecord ) {
			var dependencies = rootRecord.getDependencies()

			if( dependencies && dependencies.length > 0 ) {
				var dependencyNodes = Ext.Array.map(
					dependencies,
					function( item ) {
						var record = store.findLibraryItemByLibraryId( item )

						if( record ) {
							return record.getDependencyNode()
						}
					}
				)

				node.appendChild( Ext.Array.clean( dependencyNodes ) )
			}
		}

		var nodesWithUnknownLibraryIds = []

		node.cascadeBy(
			function() {
				var record = store.findLibraryItemByLibraryId( this.get( 'libraryId' ) )

				if( this.get( 'type' ) == 'entity' && this.get( 'libraryId' ) == 'Anonymous' ) {
					//TODO: some action for anon entities

				} else if( record ) {
					if( this.get( 'depth' ) > 1 ) this.set( 'isStatic', true )

					this.set( 'iconCls', record.iconCls )
					this.set( 'sortOrder', record.sortOrder )

				} else  {
					nodesWithUnknownLibraryIds.push( this )
				}
			}
		)

		Ext.Array.each(
			nodesWithUnknownLibraryIds,
			function( node ) {
				node.remove()
			}
		)
	},

	initComponent: function() {
		var me           = this,
			libraryStore = Ext.getStore( 'Library' ),
			store        = Ext.create('Ext.data.TreeStore', {
				model: 'Spelled.model.DependencyNode',
				nodeParam: 'libraryId',
				listeners: {
					beforeload: function(  store, operation, eOpts ) {
						var libraryId = operation.id.split( '###' )[0],
							record    = libraryStore.findLibraryItemByLibraryId( libraryId )

						if( !record ) return false

						operation.params.libraryId = libraryId
						operation.params.metaData = record.transformToRawMetaData()

						if( record.get( 'content' ) ) operation.params.scriptContent = record.get( 'content' )
					},
					load: function( store, node, records, successful ) {
						if( successful ) me.addAdditionalNodeInformation( node )
					}
				},
				proxy: {
					type: 'direct',
					directFn: 'Spelled.DependencyActions.getStaticDependencies',
					extraParams: { projectName: Spelled.app.getActiveProject().get( 'name' ) }
				}
		});

		Ext.applyIf( me, {
			items: [
				{
					name: 'dependencies',
					xtype: 'treepanel',
					animate: false,
					animCollapse: false,
					height: 300,
					store: store,

					hideHeaders: true,
					rootVisible: false,
					listeners: {
						itemmouseenter : Ext.bind( me.actionColumnHandler, me, [ true ], 0 ),
						itemmouseleave : Ext.bind( me.actionColumnHandler, me, [ false ], 0 ),
						itemcontextmenu : Ext.bind( me.contextMenuHandler, me ),
						itemdblclick : Ext.bind( me.doubleClickHandler, me )
					},
					fields: [ 'libraryId', 'isStatic' ],
					columns: [
						{
							xtype: 'treecolumn',
							text: 'Dynamic library items', dataIndex: 'libraryId', flex: 1,
							renderer: function( value, style, record ) {
								var css = ( record.get( 'isStatic' ) ) ? 'locked-icon' : ""
								return "<img src='" + Ext.BLANK_IMAGE_URL + "' class='" + css +"'/>" + value
							}
						},
						{
							xtype: 'actioncolumn',
							width: 30,
							icon: 'resources/images/icons/wrench-arrow.png',
							iconCls: 'x-hidden edit-action-icon',
							handler: Ext.bind( me.handleEditClick, me )
						}
					],
					tbar: [
						{
							text: 'Add',
							icon: 'resources/images/icons/add.png',
							menu: [
								{
									text: 'Single dependency', icon: 'resources/images/icons/add.png',
									handler: Ext.bind( me.handleAddClick, me, [ false ] )
								},
								{
									text: 'Multiple dependencies', icon: 'resources/images/icons/add.png',
									handler: Ext.bind( me.handleAddClick, me, [ true ] )
								}
							]
						}
					]
				}
			]
		})

		me.callParent( arguments )

		this.reconfigureStores()
	},

	doubleClickHandler: function( view, record ) {
		var found = Ext.getStore( 'Library' ).findLibraryItemByLibraryId( record.get( 'libraryId' ) )
		if( found ) this.fireEvent( 'deepLink', found )
	},

	contextMenuHandler: function( view, record, item, index, e, eOpts ) {
		e.stopEvent()
		this.handleEditClick( view, null, null, null, e, record )
	},

	handleEditClick: function( view, rowIndex, colIndex, item, e, record ) {
		var isStatic = record.get( 'isStatic' )

		if( record.get( 'libraryId' ) == 'Anonymous' ) return

		if( isStatic ) {
			this.fireEvent( 'showStaticLibraryItemContextMenu', record, e )
		} else {
			this.fireEvent( 'showDynamicLibraryItemContextMenu', record, e)
		}
	},

	handleAddClick: function( multiple ) {
		this.fireEvent( 'showAddToLibrary', this, multiple )
	},

	actionColumnHandler: function( show, grid, record, item ) {
		if( record.get( 'libraryId' ) == 'Anonymous' ) return

		if( show )
			this.fireEvent( 'showActionColumns', grid, record, item )
		else
			this.fireEvent( 'hideActionColumns', grid, record, item )
	},

	reconfigureStores: function() {
		if( !this.record ) return

		var me = this

		me.fireEvent( 'loaddependencies', me, me.record )
	}
})
