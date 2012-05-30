Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',

    models: [
        'config.Entity',
        'blueprint.Entity'
    ],

    stores: [
       'EntitiesTree',
       'config.Entities',
       'blueprint.Entities'
    ],

    views: [
        'entity.TreeList',
        'entity.Create'
    ],

    init: function() {
        this.control({
            '#EntityList': {
                select :         this.handleEntityClick,
                deleteclick:     this.deleteEntityActionIconClick,
                itemmouseenter:  this.application.showActionsOnFolder,
                itemmouseleave:  this.application.hideActions
            },
            'entiteslist button[action="showCreateEntity"]': {
                click: this.showCreateEntity
            },
            'createentity button[action="createEntity"]' : {
                click: this.createEntity
            },
            'entiteslist': {
                itemcontextmenu: this.showListContextMenu
            }
        })
    },

    deleteEntityActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        var entity = Ext.getStore('config.Entities').getById( node.get('id') )

        if( !entity ) return

        this.deleteEntity( entity )
    },

    showListContextMenu: function( view, record, item, index, e, options ) {

        if( !record.data.leaf ) {
            var entity = Ext.getStore('config.Entities').getById( record.getId() )

            if( entity ) {
                var menuController = this.application.getController('Menu')
                menuController.showEntitiesListContextMenu( entity, e )
            }

        } else {
            var component = Ext.getStore('config.Components').getById( record.getId() )

            if( component ) {
                var menuController = this.application.getController('Menu')
                menuController.showComponentContextMenu( component, e )
            }
        }

    },

    showCreateEntity: function( ) {
        var CreateView = this.getEntityCreateView()
        var createView = new CreateView()

        var EntityModel = this.getConfigEntityModel()
        createView.down('form').loadRecord( new EntityModel() )

        createView.show()
    },

    createEntity: function ( button, event, record ) {
        var window = button.up('window'),
            form   = window.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            zone   = this.application.getActiveZone(),
            entities = zone.getEntities()

        var entityBlueprint = Ext.getStore('blueprint.Entities').getById( values.blueprintId )

        if( entityBlueprint ) {
            entityBlueprint.getComponents().each(
                function( component ) {

                    var newComponent = Ext.create( 'Spelled.model.config.Component', {
                        blueprintId: component.get('blueprintId'),
                        config: component.get('config')
                    } )

                    record.getComponents().add( newComponent )
                }
            )

            record.set( values )

            record.set('blueprintId', entityBlueprint.getFullName() )
            entities.add( record )

            this.showEntitylist( entities )
            window.close()
        }
    },

    deleteEntity: function ( entity ) {
        var zone     = this.application.getActiveZone(),
            entities = zone.getEntities()

        entities.remove( entity )

        this.showEntitylist( entities )
    },

    editEntity: function ( entity ) {
        console.log( "editEntity"  )
        console.log( entity )
    },

    handleEntityClick: function( treePanel, record ) {
        if( !record.data.leaf ) {
            this.getConfig( treePanel, record )
        } else {
            this.getComponentConfig( record )
        }
    },

    getConfig:  function( treePanel, record ) {
        if( record.data.leaf ) return

        console.log( "Maybe show a assets list?" )
    },

    getComponentConfig: function( record ) {
        if( !record.data.leaf ) return

        var component = Ext.getStore('config.Components').getById( record.getId() )

        if( component ) {
            var componentsController = this.application.getController('Components')
            componentsController.showConfig( component )
        }
    },

    showEntitylist: function( entities ) {
        var tree     = Ext.ComponentManager.get( "EntityList"),
            rootNode = tree.getStore().getRootNode()
        rootNode.removeAll()

        entities.each( function( entity ) {

            var node = rootNode.createNode( {
                text      : entity.get('name'),
                id        : entity.getId(),
                expanded  : true,
                leaf      : false
            } )

            entity.mergeWithBlueprintConfig()

            entity.getComponents().each( function( component ) {

                node.appendChild(
                    node.createNode( {
                            text         : component.get('blueprintId'),
                            leaf         : true,
                            id           : component.getId()
                        }
                    )
                )
            })

            rootNode.appendChild( node )
        })

        if( rootNode.hasChildNodes( ) && rootNode.firstChild.hasChildNodes( ) ) {
            tree.getSelectionModel().select( rootNode.firstChild.firstChild )
        }
     }
});