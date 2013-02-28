define(
    'server/createExtDirectApi',
    [
        'path',
		'http',
        'fs',
        'server/extDirectApi/createUtil',
		'server/extDirectApi/createStorageApi',

		'spell/shared/build/exportDeploymentArchive',
		'spell/shared/build/initializeProjectDirectory',
		'spell/shared/build/isDevEnvironment',

        'underscore'
    ],
    function(
        path,
		http,
        fs,
        createUtil,
		createStorageApi,

		exportDeploymentArchive,
		initializeProjectDirectory,
		isDevEnvironment,

        _
    ) {
        'use strict'

		var printErrors = function( errors ) {
			var tmp = []
			tmp = tmp.concat( errors )

			console.error( tmp.join( '\n' ) )
		}

		var writeResponse = function( status, res, data ) {
			var data = data || ""

			res.writeHead( status, {
				'Content-type'  : 'application/json',
				'Content-Length': data.length
			} )

			res.write( data )
			res.end()
		}

		var createResponseData = function( method, payload, id ) {
			var post_data = {
				action : "ProjectActions",
				method : method,
				data   : payload,
				type   : "rpc",
				tid    : id
			}

			return JSON.stringify( post_data )
		}

		/*
		 * private
		 */

		/*
		 * RPC call handler
		 *
		 * @param spellCorePath
		 * @param projectsPath
		 * @param req
		 * @param res
		 * @param payload
		 * @param next
		 * @return {*}
		 */
		var initDirectory = function( spellCorePath, projectsPath, isDevEnvironment, req, res, payload, next ) {
			var projectName     = payload[ 0 ],
				projectPath     = projectsPath + '/' + projectName,
				projectFilePath = projectsPath + '/' + payload[ 1 ]

			initializeProjectDirectory( spellCorePath, projectName, projectPath, projectFilePath, isDevEnvironment )

			return writeResponse( 200, res, createResponseData( "initDirectory", payload, req.extDirectId ) )
		}

		/*
		 * RPC call handler
		 *
		 * @param spellCorePath
		 * @param projectsPath
		 * @param req
		 * @param res
		 * @param payload
		 * 	payload[ 0 ] : relative project path in projects directory
		 * 	payload[ 1 ] : relative output file path in projects directory
		 *
		 * @param next
		 * @return {*}
		 */
		var exportDeployment = function( spellCorePath, projectsPath, req, res, payload, next  ) {
			var projectName    = payload[ 0 ],
				outputFileName = payload[ 1 ],
				projectPath    = path.join( projectsPath, path.normalize( projectName ) ),
				outputFilePath = path.join( projectsPath, path.normalize( outputFileName ) )

			var onComplete = function( errors ) {
				if( errors &&
					errors.length > 0 ) {

					printErrors( errors )
					writeResponse( 500, res )
				} else {
					writeResponse( 200, res, createResponseData( "exportDeployment", payload, req.extDirectId ) )
				}
			}

			return exportDeploymentArchive( spellCorePath, projectPath, outputFilePath, onComplete )
		}

        return function( projectsRoot, spellCorePath ) {
            return {
				StorageActions    : createStorageApi( projectsRoot ),
				SpellBuildActions : [
					{
						name: "initDirectory",
						len: 2,
						func: _.bind(
							initDirectory,
							null,
							spellCorePath,
							projectsRoot,
							isDevEnvironment( spellCorePath )
						)
					},
					{
						name: "exportDeployment",
						len: 2,
						func: _.bind(
							exportDeployment,
							null,
							spellCorePath,
							projectsRoot
						)
					}
				]
            }
        }
    }
)
