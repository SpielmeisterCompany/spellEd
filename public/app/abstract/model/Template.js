Ext.define('Spelled.abstract.model.Template', {
    extend: 'Ext.data.Model',

	mixins: ['Spelled.abstract.model.Model'],

    requires: ['Spelled.abstract.writer.JsonWriter'],

	fields: [
		{ name: 'readonly', type: 'boolean', defaultValue: false },
		{ name: 'engineInternal', type: 'boolean', defaultValue: false }
	],

	constructor: function() {
		this.callParent( arguments )
		this.set( 'templateId', this.generateIdentifier( arguments[2] ))
	},

	isReadonly: function() {
		return ( this.get('readonly') === true )
	},

	isEngineInternal: function() {
		return ( this.get('engineInternal') === true )
	},

	getFullName: function() {
        return this.get('templateId')
	},

	isDirty: function() {
		return this.dirty
	},

	getDocumentationName: function() {
		return this.get('type').replace(/([a-z])([A-Z])/, "$1_$2").toLowerCase() + "_" + this.getFullName().replace( /\./g, "_")
	}
});
