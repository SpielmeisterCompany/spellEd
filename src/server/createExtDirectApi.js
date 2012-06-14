define(
    'server/createExtDirectApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',
        'server/extDirectApi/blueprints/createComponentApi',
        'server/extDirectApi/blueprints/createEntityApi',
        'server/extDirectApi/blueprints/createSystemApi',
        'server/extDirectApi/createAssetsApi',
        'server/extDirectApi/createScriptsApi',
        'server/extDirectApi/ProjectApi',

        'underscore'
    ],
    function(
        path,
        fs,
        createUtil,
        createComponentApi,
        createEntityApi,
        createSystemApi,
        createAssetsApi,
        createScriptsApi,
        createProjectApi,

        _
    ) {
        'use strict'

        return function( projectsRoot ) {

            var projectBlueprintLibraryPath = "/library/blueprints/"
            var util = createUtil( projectsRoot )


            var listBlueprints = function( req, res, payload, next ) {
                var requestedNode = ( payload[ 0 ] !== 'root' ) ? payload[ 0 ] :  projectsRoot + payload[1] + projectBlueprintLibraryPath

                var tmpPath = util.getPath( requestedNode )

                if ( !tmpPath ) return {}

                return util.listing( tmpPath, true, req, res, payload, next )
            }

            var getAllBlueprints = function( projectName, type ) {
                var blueprintsPath =  projectsRoot + projectName + projectBlueprintLibraryPath,
                    tmpPath = util.getPath( blueprintsPath )


                if ( !tmpPath ) return {}

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return {}

                return _.filter(
                    util.getDirFilesAsObjects( tmpPath ),
                    function( blueprint ) {
                        return ( blueprint.type === type )
                    }
                )
            }

            var getAllEntityBlueprints = function( req, res, payload, next ) {
                var projectName =  payload[0]
                return getAllBlueprints( projectName, 'entityBlueprint' )
            }

            var getAllComponentBlueprints = function( req, res, payload, next ) {
                var projectName = payload[0]
                return getAllBlueprints( projectName, 'componentBlueprint' )
            }

			var getAllSystemsBlueprints = function( req, res, payload, next ) {
				var projectName = payload[0]
				return getAllBlueprints( projectName, 'systemBlueprint' )
			}

            var createBlueprint = function( req, res, payload, next ) {
                var api = ( payload.type === "componentBlueprint" ) ? createComponentApi( projectsRoot ) :  createEntityApi( projectsRoot )

                var apiFunction = _.find(
                    api,
                    function( item ) {
                        return ( item.name === 'create')
                    }
                )

                if( apiFunction ) {
                    return apiFunction.func( req, res, payload, next )
                }
            }

            return {
                ProjectActions            : createProjectApi( projectsRoot ) ,
                ComponentBlueprintActions : createComponentApi( projectsRoot ),
                EntityBlueprintActions    : createEntityApi( projectsRoot ),
                AssetsActions             : createAssetsApi( projectsRoot ),
                SystemBlueprintActions    : createSystemApi( projectsRoot ),
                ScriptsActions            : createScriptsApi( projectsRoot ),
                BlueprintsActions : [
                    {
                        name: "createBlueprint",
                        len: 0,
                        func: createBlueprint,
                        form_handler: true
                    },
                    {
                        name: "getTree",
                        len: 2,
                        func: listBlueprints
                    },
                    {
                        name: "getAllEntitiesBlueprints",
                        len: 1,
                        func: getAllEntityBlueprints
                    },
                    {
                        name: "getAllComponentsBlueprints",
                        len: 1,
                        func: getAllComponentBlueprints
                    },
					{
						name: "getAllSystemsBlueprints",
						len: 1,
						func: getAllSystemsBlueprints
					}
                ]
            }
        }
    }
)
