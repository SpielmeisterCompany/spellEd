Ext.define('Spelled.view.template.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.templatestreelist',

    animate: false,
    animCollapse: false,
    title : 'All Templates',
    store : 'TemplatesTree',

    rootVisible: false
});