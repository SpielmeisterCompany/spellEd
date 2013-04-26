Ext.define('Spelled.view.asset.create.LocalizedFileField', {
    extend: 'Ext.container.Container',
    alias: 'widget.localizedfilefield',

	generateLanguageFileField: function( languages ) {
		languages.each(
			function( language ){
				this.createLanguageTab( language.get( 'name' ), language.get( 'id' ) )
			},
			this
		)
	},

	createLanguageTabs: function( localized, languages ) {
		var me             = this,
			tabPanel       = this.down( 'tabpanel' ),
			languagesCount = languages.getCount()

		tabPanel.removeAll()

		if( localized && languagesCount == 0 ) {
			tabPanel.add( { title: 'Error', html: 'Missing language configuration. Check your project settings.' } )

		} else if( localized ) {
			me.generateLanguageFileField( languages )

		} else {
			me.createLanguageTab( 'Default', 'default' )
		}

		if( tabPanel.up( 'form' ).getRecord() ) tabPanel.setActiveTab( 0 )
	},

	createLanguageTab: function( name, id ) {
		var panel = this.down( 'tabpanel' )

		return panel.add({
			title: name,
			items: [
				{
					xtype: 'assetfilefield',
					name: id
				},
				{ xtype: 'assetiframe', workspacePrefix: false, height: '100%' }
			]
		})
	},

	fireChangeEvent: function( checkbox, newValue, oldValue ) {
		var cmp   = this.up( 'form' ),
			asset = cmp.getRecord()

		if( !asset ) return

		asset.set( 'localized', newValue )

		this.fireEvent( 'localizechange', cmp, asset )
	},

	updatePreview: function( tabPanel, newCard ) {
		var form   = tabPanel.up( 'form' ),
			asset  = form.getRecord(),
			iframe = newCard.down( 'assetiframe'),
			name   = newCard.down( 'assetfilefield').getName()

		if( asset ) this.fireEvent( 'updatepreview', iframe, asset, name )
	},

	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
			items: [
				{
					xtype: 'checkbox',
					fieldLabel: 'Localized',
					name: 'localized',
					listeners: {
						change: Ext.bind( me.fireChangeEvent, me )
					}
				},
				{
					xtype: 'tabpanel',
					listeners: {
						tabchange: Ext.bind( me.updatePreview, me ),
						afterrender: function() {
							this.setActiveTab( 0 )
						}
					}
				}
			]
		})

		this.callParent( arguments )
	}
})
