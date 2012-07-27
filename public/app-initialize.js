// this file will be included before any SpelLEd classes are loaded
// but after the needed Ext classes has been loaded

Ext.require('Ext.direct.*', function() {
	//Ext.app.REMOTING_API will be definied by /api include
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
});

//Provide a configuration for the SpellEd Editor
Ext.ns("Ext.app");

Ext.app.CONFIGURATION = {
	"version" : "latest",
	"name" : "SpellEd",
	"documentationServerURL": "http://docs.spelljs.elaine/"
};