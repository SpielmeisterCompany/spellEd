define(
	'server/extDirectApi/createStorageApi',
	[
		'path',
		'fs',
		'server/extDirectApi/createUtil',
		'flob',

		'underscore'
	],
	function(
		path,
		fs,
		createUtil,
		flob,

		_
	) {
		'use strict'

		return function( root ) {
			var util          = createUtil( root),
				libraryPrefix = "library"

			var generateExtModel = function( filePath ) {
				var content   = JSON.parse( getByFilePath( filePath ) ),
					fileParts = filePath.substr( filePath.indexOf( libraryPrefix ) + libraryPrefix.length + 1 ).split( path.sep ),
					baseName  = fileParts.pop()

				content.id = filePath

				if( content.startScene ) {
					content.name = fileParts.pop()
				} else {
					content.name      = path.basename( baseName, path.extname( baseName ) )
					content.namespace = fileParts.join( "." )
				}

				return content
			}

			var getByFilePath = function( filePath ) {
				return fs.readFileSync( filePath, 'utf8' )
			}

			var writeContent = function( filePath, content, encoding ) {

				return fs.writeFileSync( filePath, ( _.isObject( content ) )
					? JSON.stringify( content, '', '\t' )
					: ( encoding === 'base64' ) ?  new Buffer( content, 'base64' ) : content
				)
			}

			var getAllByType = function( params ) {
				var searchPath = util.getPath( params.projectName || root ),
					type       = params.type,
					subtype    = params.subtype,
					pattern    = ( params.projectName ) ? searchPath + "/library/**/*" : searchPath + "/*/*",
					files      = flob.byTypes( pattern, [ '.json' ] )

				var result = _.map(
					files,
					function( filePath ) {
						try{
							var content = generateExtModel( filePath )

							if( _.isArray( type ) ) {
								return ( _.find( type, function( key ){ return key === content.type } ) ) ? content : false

							} else if( subtype ) {
								return ( content.type === type && content.subtype === subtype ) ? content : false
							} else {
								return ( content.type === type ) ? content : false
							}

						} catch( e ) {
							console.error( "Could not parse JSON file: " + filePath )
							return false
						}
					}
				)

				return _.filter(
					result,
					function( item ) {
						return item !== false
					}
				)
			}

			var read = function( req, res, payload, next ) {
				var params = _.isArray( payload ) ? payload.pop() : payload

				if( _.has( params, 'id' ) ) {
					var filePath = util.getPath( params.id )
					return ( _.has( params, 'type' ) ) ? generateExtModel( filePath ) : getByFilePath( filePath )
				} else {
					return getAllByType( params )
				}
			}

			var create = function(  req, res, payload, next  ) {
				var params   = _.isArray( payload ) ? payload.pop() : payload,
					filePath = util.getPath( params.id ),
					content  = params.content

				writeContent( filePath, content, params.encoding )

				return filePath
			}

			var update = function( req, res, payload, next ) {
				var params   = _.isArray( payload ) ? payload.pop() : payload,
					filePath = util.getPath( params.id),
					content  = params.content

				return writeContent( filePath, content, params.encoding )
			}

			var destroy = function( req, res, payload, next ) {
				var params   = _.isArray( payload ) ? payload.pop() : payload,
					filePath = util.getPath( params.id)

				fs.unlink( filePath )
			}

            return [
                {
                    name: "create",
                    len: 1,
                    func: create
                },
                {
                    name: "read",
                    len: 1,
                    func: read
                },
                {
                    name: "update",
                    len: 1,
                    func: update
                },
                {
                    name: "destroy",
                    len: 1,
                    func: destroy
                }
			]
        }
    }
)