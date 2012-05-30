Ext.define('Spelled.view.zone.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.zonetreelist',

    animate: false,
    animCollapse: false,
    title : 'All Zones',
    store : 'ZonesTree',

    rootVisible: false,

    tbar: [
        {
            text: "Create",
            action: "showCreateZone",
            tooltip: {
                text:'Create a new Zone',
                title:'Create'
            }
        }
    ]
});