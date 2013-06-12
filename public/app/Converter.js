Ext.define( 'Spelled.Converter' ,{
	singleton: true,

	libraryIdToRelativePath: function( libraryId ) {
		return libraryId.replace( /\./g, "/" )
	},

	getLocalizedFilePath: function( filePath, language ) {
		var parts     = filePath.split( '.' ),
			extension = parts.pop()

		parts.push( this.localizeExtension( language, "." + extension ) )

		return parts.join( '' )
	},

	localizeExtension: function( language, extension ) {
		if( language == 'default' ) return extension

		return "." + language + extension
	},

	toWorkspaceUrl: function( url ) {
		var workspacePath = Spelled.Configuration.getWorkspacePath(),
			url           = ( workspacePath && workspacePath.length > 0 ) ? workspacePath + '/' + url : url

		return Spelled.app.platform.normalizeUrl( url )
	},

	internalAssetIdToMyAssetId: function( internalAssetId ) {
		if( Ext.isString( internalAssetId ) ){
			var parts = internalAssetId.split( ':' )

			if( Ext.isArray( parts ) && parts.length > 1 ) {
				return parts.pop()
			} else {
				return internalAssetId
			}
		}

		return false
	},

	convertValueForGrid: function( value ) {
		if( Ext.isArray( value ) === true ) {
			return "[" + value.toString() + "]"
		} else if( Ext.isObject( value ) ) {
			return Ext.encode( value )
		} else {
			return value
		}
	},

	namespaceFromObject: function( object ) {
		var namespace = object.namespace,
			name      = object.name

		return ( !!namespace && namespace.length > 0 ) ? namespace +"."+ name : name
	},

	createDependencyNodeWithDynamicDependency: function( record ) {
		var staticDependencies  = record.getCalculatedDependencies(),
			dynamicDependencies = Ext.Array.difference( record.getDependencies(), staticDependencies ),
			rootNode            = record.createDependencyNode(),
			libraryStore        = Ext.getStore( 'Library' )

		Spelled.Converter.addAdditionalInfoToDependencyNode( rootNode, true )

		for ( var j = 0, l = dynamicDependencies.length; j < l; j++ ) {
			var libraryId = dynamicDependencies[ j ],
				item      = libraryStore.findLibraryItemByLibraryId( libraryId )

			var node = item.getDependencyNode()
			rootNode.children.push( node )
			Spelled.Converter.addAdditionalInfoToDependencyNode( node )
		}

		return rootNode
	},

	addAdditionalInfoToDependencyNode: function( node, isStatic ) {
		var mergeChildren = function( targetChild, sourceChild ) {
			var targetChildren = targetChild.children,
				sourceChildren = sourceChild.children

			for ( var u = 0, i = sourceChildren.length; u < i; u++ ) {
				var item                 = sourceChildren[ u ],
					entityChildLibraryId = item.libraryId,
					exists               = false

				for ( var j = 0, l = targetChildren.length; j < l; j++ ) {
					var sourceItem = targetChildren[ j ]

					if( sourceItem.libraryId == entityChildLibraryId && sourceItem.children.length == 0 ) {
						exists = sourceItem
						break
					}
				}

				if( !exists ) {
					targetChildren.push( item )
				}
			}
		}

		var addInfo = function( childNode ) {
			var children    = childNode.children,
				tmp         = {},
				newChildren = []

			childNode.isStatic = isStatic

			for ( var j = 0, l = children.length; j < l; j++ ) {
				var child         = children[ j ],
					libraryId     = child.libraryId,
					existingChild = tmp[ libraryId ]

				if( !existingChild ) {
					tmp[ libraryId ] = child
					newChildren.push( child )
				} else {
					//Only for entities

					mergeChildren( existingChild, child )
					addInfo( existingChild )
				}

				addInfo( child )
			}

			childNode.children = newChildren
		}

		addInfo( node )
	},

	integerListFromString: function( list ) {
		var values = list.split( "," )
		return Ext.Array.map( values, function( item ) { return parseInt( item, 10 ) } )
	},

	decodeFieldValue: function( value, type ) {
		if( type && type === 'string' ) return value

		return Ext.decode( value, true ) || value
	},

	formatPropertyGridSource: function( source ) {
		var newSource = {}
		Ext.Object.each( source,
			function( key, attribute ) {
				newSource[ key ] = attribute.value
			},
			this
		)

		return newSource
	}
})
