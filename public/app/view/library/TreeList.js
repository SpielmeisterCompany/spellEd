Ext.define('Spelled.view.library.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.librarytreelist',

	requires: [
		'Ext.container.ButtonGroup'
	],

	title: "Library - Navigator",
	header: false,

    animate: false,
    animCollapse: false,
    store : 'Library',

    rootVisible: false,

	tbar: [
		{
			text: 'Create',
			icon: 'images/icons/add.png',
			menu: {
				items: [
					{
						xtype: 'buttongroup',
						title: 'Asset',
						columns: 1,

						items: [
							{
								text: "2D Static Appearance (Image)",
								action: "showCreateAsset",
								type: 'appearance',
								icon: 'images/icons/asset-2dstatic.png'
							},
							{
								text: "2D Sprite Sheet",
								action: "showCreateAsset",
								type: 'spriteSheet',
								icon: 'images/icons/asset-spritesheet.png'
							},
							{
								text: "2D Animation",
								action: "showCreateAsset",
								type: 'animation',
								icon: 'images/icons/asset-2danimation.png'
							},
							{
								text: "Keyframe animation",
								action: "showCreateAsset",
								type: 'keyFrameAnimation',
								icon: 'images/icons/asset-keyframeanimation.png'
							},
//							{
//								text: "2D Static Domvas Appearance",
//								action: "showCreateAsset",
//								type: 'domvas',
//								icon: 'images/icons/asset-2dstatic.png'
//							},
							{
								text: "Font",
								action: "showCreateAsset",
								type: 'font',
								icon: 'images/icons/asset-font.gif'
							},
							{
								text: "Sound",
								action: "showCreateAsset",
								type: 'sound',
								icon: 'images/icons/asset-sound.png'
							},
							{
								text: "Keyboard mapping",
								action: "showCreateAsset",
								type: 'keyToActionMap',
								icon: 'images/icons/keyboard.png'
							}
						]
					},
					{
						xtype: 'buttongroup',
						title: 'Template',
						columns: 1,
						items: [
							{
								icon: "images/icons/component.png",
								action: 'showCreateTemplate',
								text: 'Component',
								type: 'component'
							},
							{
								icon: "images/icons/entity.png",
								action: 'showCreateTemplate',
								text: 'Entity',
								type: 'entityTemplate'
							},
							{
								icon: "images/icons/system.png",
								action: 'showCreateTemplate',
								text: 'System',
								type: 'system'
							}
						]
					},
					{
						xtype: 'buttongroup',
						title: 'Script',
						columns: 1,
						items:[
							{
								icon: "images/icons/script.png",
								action: 'showCreateScript',
								text: 'Script'
							}
						]
					}
				]
			}
		}
	]
});