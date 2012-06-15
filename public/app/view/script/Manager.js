Ext.define('Spelled.view.script.Manager', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.scriptmanager',

    title: 'Script Editor',
    titleCollapse: false,
    activeTab: 0,
    bbar: [
        {
            xtype: 'button',
            action: 'showCreateScript',
            text: 'Create a new Script'
        }
    ]
});