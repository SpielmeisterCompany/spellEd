Ext.define('Spelled.view.template.component.Property', {
    extend: 'Ext.form.Panel',
    alias : 'widget.componenttemplateproperty',

    bodyPadding: 10,
    margin: '5 0 0 0',
    title: 'Property',

	defaults: {
		hidden: true
	},

    buttons: [
        {
            text: "Save",
            action: "save"
        },
        {
            text: "Reset",
            action: "reset"
        }
    ],
    items: [
        {
            xtype: 'textfield',
            name: 'name',
            fieldLabel: 'Name',
            allowBlank:false,
            anchor: '100%'
        },
        {
            xtype: 'combobox',
            name: 'type',
            fieldLabel: 'Type',
            allowBlank:false,
            anchor: '100%'
        },
        {
            xtype: 'textareafield',
            name: 'default',
            allowBlank:false,
            fieldLabel: 'Default value',
            anchor: '100%'
        }
	],

	showConfig: function() {
		this.items.each(
			function( item ) {
				item.show()
			}
		)
	},

	hideConfig: function() {
		this.items.each(
			function( item ) {
				item.hide()
			}
		)
	}

});
