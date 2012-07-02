define(
    'server/extDirectApi/templates/createComponentApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',

        'underscore'

    ],
    function(
        path,
        fs,
        createUtil,

        _
    ) {
        'use strict'
        return function( root ) {
            var templatePathPart = "/library/templates"

            var util = createUtil( root )

			var buildComponentFromData = function( data ) {
				return _.pick( data, 'name', 'namespace', 'type', 'title', 'doc')
			}

            /**
             *  Component Templates Actions
             */

            var readcomponentTemplate = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

            var updatecomponentTemplate = function( req, res, payload, next ) {
                var component = payload[ 0 ],
                    tmpPath   = component.id

                var result = buildComponentFromData( component )

                var attributes = _.map(
                    component.getAttributes,
                    function( attribute ) {
                        return _.pick( attribute, 'name', 'type', 'default' )
                    }
                )

                result.attributes = attributes

                util.writeFile( tmpPath, JSON.stringify( result, null, "\t" ) )

                return result
            }

            var deletecomponentTemplate = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id

                util.deleteFile( jsonFilePath )

                return true
            }

            var createcomponentTemplate = function( req, res, payload, next ) {
                var name        = payload.name,
                    extension   = ".json",
                    folder      = ( payload.namespace === "root" ) ? path.join( root , payload.projectName , templatePathPart ) : payload.namespace,
                    filePath    = folder + "/"+ name + extension

                var namespace = util.extractNamespaceFromPath( folder, templatePathPart )

				var component = buildComponentFromData( payload )
				component.namespace  = namespace
				component.attributes = []

                util.writeFile( filePath , JSON.stringify( component, null, "\t" ), false )

                return {
                    success: true,
                    data: component
                }
            }

            return [
                {
                    name: "read",
                    len: 1,
                    func: readcomponentTemplate
                },
                {
                    name: "create",
                    len: 1,
                    func: createcomponentTemplate
                },
                {
                    name: "update",
                    len: 1,
                    func: updatecomponentTemplate
                },
                {
                    name: "destroy",
                    len: 1,
                    func: deletecomponentTemplate
                }
            ]
        }
    }
)