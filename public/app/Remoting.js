Ext.define( 'Spelled.Remoting', {
	singleton: true,

	requires: [
		'Ext.direct.*',
		'Spelled.Configuration'
	],

	constructor: function() {
		Ext.Direct.addProvider(
		{
			"url": Spelled.Configuration.extDirectRouterUrl,
			"namespace":"Spelled",
			"type":"remoting",
			"actions":{
				"StorageActions":[
					{"name":"create","len":1},
					{"name":"createNamespaceFolder","len":1},
					{"name":"read","len":1},
					{"name":"update","len":1},
					{"name":"destroy","len":1},
					{"name":"getNamespaces","len":1},
					{"name":"deleteFolder","len":1}
				],

				"SpellBuildActions":[
					{"name":"initDirectory","len":2},
					{"name":"exportDeployment","len":2}
				]
			}
		})
	}
})
