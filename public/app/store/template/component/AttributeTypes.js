Ext.define('Spelled.store.template.component.AttributeTypes', {
    extend: 'Ext.data.Store',

	fields: ['type', 'name'],

	data : [
		{
			"type":"spellednumberfield",
			"name":"number"
		},
		{
			"type":"spelledobjectfield",
			"name":"object"
		},
		{
			"type":"spelledtextfield",
			"name":"string"
		},
		{
			"type":"spelledvec2field",
			"name":"vec2"
		},
		{
			"type":"spelledvec3field",
			"name":"vec3"
		},
		{
			"type":"spelledvec4field",
			"name":"vec4"
		},
		{
			"type":"spelledlistfield",
			"name":"list"
		},
		{
			"type":"spelledintegerfield",
			"name":"integer"
		},
		{
			"type":"spelledbooleanfield",
			"name":"boolean"
		},
		{
			"type":"spelledanimatedappearancefield",
			"name":"assetId:animation"
		},
		{
			"type":"spelledappearancefield",
			"name":"assetId:appearance"
		},
		{
			"type":"spelledtextappearancefield",
			"name":"assetId:font"
		},
		{
			"type":"spelledsoundfield",
			"name":"assetId:sound"
		},
		{
			"type":"spelledkeyaction",
			"name":"assetId:keyToActionMap"
		},
		{
			"type":"spelledkeyframeanimationfield",
			"name":"assetId:keyFrameAnimation"
		}
	]
});
