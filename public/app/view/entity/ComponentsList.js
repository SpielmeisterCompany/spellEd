Ext.define('Spelled.view.entity.ComponentsList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.entitycomponentslist',

	padding: '5px',

	border: false,

	autoScroll: true,

	buttonAlign:'left',

	sortByTitle: function() {
		this.items.items = this.items.items.sort(
			function( a, b ) {
				return ( a.title > b.title )
			}
		)
	}
});