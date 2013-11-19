Ext.define('Spelled.view.project.Settings' ,{
    extend: 'Ext.Window',
    alias: 'widget.projectsettings',

	requires: [
		'Ext.form.FieldContainer'
	],

    width: 500,
    height: 500,
	layout: 'fit',

    title : 'Project settings',
    modal : true,
	autoShow: true,

	initComponent: function() {

		Ext.applyIf( this, {
			items: [
				{
					defaults: {
						padding:5
					},
					xtype: 'tabpanel',
                    items: [
						{
							xtype: 'projectgeneralsettings'
						},
						{
							xtype: 'projectlanguagesettings'
						},
                        {
                            xtype: 'projectandroidsettings'
                        },
                        {
                            xtype: 'projectiossettings'
                        },
	                    {
		                    xtype: 'projecttizensettings'
	                    },
						{
							xtype: 'projectwebsettings'
						},
						{
							xtype: 'projectplugins'
						}
					]
				}
			]
		})

		this.callParent( arguments )
	},

	buttons: [
		{
			text: "Set",
			action: "setProjectSettings",
			formBind: true
		},
		{
			text: "Cancel",
			handler: function() {
				this.up('window').close()
			}
		}
	]
})