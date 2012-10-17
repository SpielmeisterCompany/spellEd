Ext.define('Spelled.data.reader.Project', {
    extend: 'Spelled.data.reader.Reader',
	alias: 'reader.project',

	read: function( response ) {
		var result = this.convertResponse( response, Ext.amdModules.projectConverter.toEditorFormat )

		if( !Ext.isArray(response) ) this.convertProjectScenes( result )

		return result
	},

	convertProjectScenes: function( result ) {

		Ext.Array.each(
			result.records,
			function( record ) {
				record.getScenes().removeAll()

				var scenes = Ext.Array.map(
					record.raw.scenes,
					function( sceneId ) {
						return Ext.getStore( 'config.Scenes' ).findRecord( 'sceneId', sceneId )
					}
				)

				record.getScenes().add( scenes )
			}
		)
	}
});