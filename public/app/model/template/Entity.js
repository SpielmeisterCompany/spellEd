Ext.define('Spelled.model.template.Entity', {
	extend: 'Spelled.abstract.model.Template',
	requires: [
		'Spelled.data.writer.EntityTemplate',
		'Spelled.data.reader.EntityTemplate',
		'Spelled.abstract.model.Entity'
	],

	mixins: [ 'Spelled.abstract.model.Entity' ],

	fields: [
        "namespace",
        "name"
    ],

	associations: [
		{
			type: 'hasMany',
			model: 'Spelled.model.config.Component',
			associationKey: 'components',
			name :  'getComponents'
		},
		{
			type: 'hasMany',
			model: 'Spelled.model.config.Entity',
			associationKey: 'children',
			name :  'getChildren'
		},
		{
			type: 'belongsTo',
			model: 'Spelled.model.config.Entity',
			getterName: 'getEntity'
		}
	],

	setEntity: function( entity ) {
		this[ 'Spelled.model.config.EntityBelongsToInstance' ] = entity
	},

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'entityTemplate'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: {
			type: 'entityTemplate'
		},
		reader: {
			type: 'entityTemplate'
		}
    },

	getCalculatedDependencies: function() {
		var entity = Ext.create( 'Spelled.model.config.Entity', { templateId: this.getFullName() } )

		return entity.getCalculatedDependencies()
	},

	getChild: function( id ) {

		var helperFunction = function( entity ) {
			var child = entity.getChildren().findRecord( 'id', id )

			if( !child ) {
				entity.getChildren().each(
					function( item ) {
						var result = helperFunction( item )

						if( !!result ) {
							child = result
							return false
						}
					}
				)
			}

			return child
		}

		return helperFunction( this )
	},

	mergeChildrenComponentsConfig: function() {
		this.checkForComponentChanges()
	},

	createTreeNode: function( node ) {
		var entityNode       = this.mixins.abstractModel.createTreeNode.call( this, node ),
			sortOrder        = this.sortOrder,
			markAsComposites = function( compositeNode ) {
			compositeNode.set( 'cls', 'templateEntityComposite' )
			compositeNode.set( 'sortOrder', sortOrder )
			compositeNode.eachChild( markAsComposites )
		}

		this.getChildren().each( function( entity ) {
			var childNode = entity.createTreeNode( entityNode )

			entityNode.set( 'leaf', false )

			markAsComposites( childNode )

			entityNode.appendChild( childNode )
		})

		return entityNode
	}
});
