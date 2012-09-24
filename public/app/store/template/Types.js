Ext.define('Spelled.store.template.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
        {
			"type":"component",
            "name":"Component"
        },
        {
            "type":"entity",
            "name":"Entity"
        },
        {
            "type":"system",
            "name":"System"
        }
    ]
});
