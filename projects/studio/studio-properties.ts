import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui/jb-ui';
import * as studio from './studio-model';

jb.component('studio.openProperties', {
	type: 'action',
	impl :{$: 'openDialog',
		title: [
			{ $: 'object', 
				title: { $: 'studio.short-title', path: '%$globals/profile_path%' },
				comp: { $: 'studio.compName', path: '%$globals/profile_path%' }
			},
			'Properties of %comp% %title%'
		],
		style :{$: 'dialog.studioFloating', id: 'studio properties' },
		content :{$: 'group', //'tab-control',
//			style :{$: 'tab-control.studio-properties-accordion' },
			controls: [
				{ $: 'group', title: 'Properties',
//					cssClass: 'studio-properties-in-dialog',
					controls :{$: 'studio.properties', path: '%$globals/profile_path%' }
				},
				// { $: 'group', id: 'features',
				// 	$title: [
				// 			'%$globals/currentProfile/features%',
				// 			'Features (%=count({%$features%})%)' 
				// 	],
				// 	controls :{$: 'studio.propertyField',
				// 			profile: '%$globals/currentProfile%',
				// 			paramDef: [ 
				// 				{ $: 'studio.profileParamDefinitions' }, 
				// 				{ $filter: '%name% == features' } 
				// 			]
				// 	}
				// }
			]
		}
	}
})

jb.component('studio.openNewCtrlDialog', {
	type: 'action',
	impl :{$: 'openDialog',
			modal: true,
			title: 'New Control',
        	style :{$: 'dialog.md-dialog-ok-cancel', 
        		//atts: { style: 'left:20%; top:20%'},
        		styles: ['{left:20%; top:20%}'],
        		features :{$: 'dialogFeature.autoFocusOnFirstInput'}
        	},
			content :{$: 'picklist',
				databind: '%$dialogData/comp%',
				options :{$: 'studio.tgp-type-options', type: 'control' },
			},
			onOK : [
				ctx => studio.modifyOperationsEm.take(1)
						.subscribe(e=>
							ctx.run({$runActions: [
								{$: 'writeValue', 
									to: '%$globals/profile_path%',
									value: e.args.resultRef 
								},
								{$: 'studio.openProperties'}
							]
						})),
				{$: 'studio.insertComp', 
					path: '%$globals/profile_path%',
					comp: '%$dialogData/comp%'
				},
			]
		}
})

jb.component('studio.openSourceDialog', {
	type: 'action',
	impl :{$: 'openDialog',
			modal: true,
			title: 'Source',
        	style :{$: 'dialog.md-dialog-ok-cancel', css: '{left:20%; top:20%}'	},
			content :{$: 'text', 
				text :{$: 'studio.compSource'},
				style:{$: 'text.codemirror'}
			},
		}
})


jb.component('studio.properties',{
	type: 'control',
	params: { path: { as: 'string' } },
	impl :{$: 'group',
		style :{$: 'property-sheet.studio-properties'},
		features :{$: 'group.studio-watch-path', path: '%$path%'},
		controls :{$: 'dynamic-controls', 
		    controlItems :{$: 'studio.non-control-children', path: '%$path%' },
		    genericControl :{$: 'studio.propertyField', path: '%$controlItem%' } 
		}
	}
})

jb.component('studio.propertyField-Label',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'label', 
		title :{$: 'studio.prop-name', path: '%$path%' },
	}
});

jb.component('studio.propertyField-Primitive',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'group', 
		style :{$: 'layout.horizontal'},
		title :{$: 'studio.prop-name', path: '%$path%' },
		controls: [
			{ $: 'editable-text',
				cssClass: 'jb-studio-primitive-textbox',
				databind :{$: 'studio.ref', path: '%$path%' }
			},
			{ $: 'button',
				style: {$: 'button.md', flat: true},
				title: '',
				cssClass: 'jb-studio-primitive-arrow',
				action :{$: 'studio.openPrimitiveArrowPopup', 
					path: '%$path%',
					isPrimitive: true
				}
			}
		]
	}
})

jb.component('studio.propertyField-Enum',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'picklist', 
		title :{$: 'studio.prop-name', path: '%$path%' },
		databind :{$: 'studio.ref', path: '%$path%' },
		options :{$: 'studio.enum-options', path: '%$path%' },
	}
})


jb.component('studio.propertyField-TgpType',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'group',
		title :{$: 'studio.prop-name', path: '%$path%' },
		$vars: {
			'TgpTypeCtrl' : {$: 'object' , expanded: true }
		},
		controls: [
			{ $: 'group',
			  style :{$: 'layout.horizontal' },
			  controls: [
					{ $: 'picklist',
						cssClass: 'jb-studio-tgpType-picklist',
						databind :{$: 'studio.compName-ref', path: '%$path%' },
						options :{$: 'studio.tgp-path-options', path: '%$path%' },
					},
					{ 	$: 'editable-boolean',
						style :{$: 'editable-boolean.expand-collapse'},
						databind: '%$TgpTypeCtrl/expanded%',
					},
					{ $: 'button' ,
						title: 'customize style',
						style :{$: 'button.studio-edit-js' },
						action : [ 
							{$: 'studio.makeLocal', path: '%$path%' },
							{$: 'studio.openEditStyle', path: '%$path%' },
						],
						features :{$: 'hidden', showCondition :{$: 'endsWith', text: '%$path%', endsWith: '~style' }}
					},
					{ $: 'button' ,
						title: 'delete',
						style :{$: 'button.studio-delete' },
						action : [ 
							{$: 'writeValue', value: false, to: '%$TgpTypeCtrl.expanded%'},
							{$: 'studio.delete', path: '%$path%' },
						],
						features :{$: 'hidden', showCondition :{$: 'studio.compName-ref', path: '%$path%' }}
					},
			  ]
			},
			{ $: 'group',
				controls :{$: 'studio.properties', 	path: '%$path%' },
				features : [ 
					{$: 'group.watch', data :{$: 'studio.compName', path: '%$path%' } },
					{$: 'hidden', showCondition: '%$TgpTypeCtrl.expanded%' },
					{$: 'css', css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'},
				],
			}
		]
	}
})

jb.component('studio.propertyField-Style',{
	type: 'control',
	params: { path: { as: 'string' } },
	impl :{$: 'group',
		title :{$: 'studio.prop-name', path: '%$path%' },
		$vars: {
			'TgpTypeCtrl' : {$: 'object' , expanded: true }
		},
		controls: [
			{ $: 'group',
			  style :{$: 'layout.horizontal' },
			  controls: [
					{ $: 'picklist',
						cssClass: 'jb-studio-tgpType-picklist',
						databind :{$: 'studio.compName-ref', path: '%$path%' },
						options :{$: 'studio.tgp-path-options', path: '%$path%' },
					},
					{ $: 'group',
			  			style :{$: 'layout.horizontal' },
			  			controls:
			  			[
			  				{ $: 'editable-boolean',
								style :{$: 'editable-boolean.expand-collapse'},
								databind: '%$TgpTypeCtrl/expanded%',
								features :{$: 'hidden', showCondition :{$not: { $: 'studio.isCustomStyle', path: '%$path%' } }}
							},
							{ $: 'button' ,
								title: 'customize style',
								style :{$: 'studio_button.toolbarButton', spritePosition: '21,0' },
								action : [ 
									{$: 'studio.makeLocal', path: '%$path%' },
									{$: 'studio.openEditStyle', path: '%$path%' },
								],
								features :{$: 'hidden', showCondition :{$not: { $: 'studio.isCustomStyle', path: '%$path%' } }}
							},
							{ $: 'button' ,
								title: 'edit custom style',
								style :{$: 'studio_button.toolbarButton', spritePosition: '22,0' },
								action :{$: 'studio.openEditStyle', path: '%$path%' },
								features :{$: 'hidden', showCondition :{$: 'studio.isCustomStyle', path: '%$path%' } }
							},
							{ $: 'button' ,
								title: 'share style',
								style :{$: 'studio_button.toolbarButton', spritePosition: '23,0' },
								action :{$: 'studio.shareStyle', path: '%$path%' },
								features :{$: 'hidden', showCondition : false } //{$: 'studio.isCustomStyle', path: '%$path%' } }
							},
					  ]
					},
				]
			},
			{ $: 'group',
				controls :{$: 'studio.properties', 	path: '%$path%' },
				features : [ 
					{$: 'group.watch', data :{$: 'studio.compName', path: '%$path%' }},
					{$: 'hidden', showCondition: {$and: 
						[
							'%$TgpTypeCtrl.expanded%', 
							{$not: { $: 'studio.isCustomStyle', path: '%$path%' } }
						] 
					}},
					{$: 'css', css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'},
				],
			}
		]
	}
})

jb.component('studio.propertyField-JBEditor',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'group',
		title :{$: 'studio.prop-name', path: '%$path%' },
		controls: [
			{ $: 'button',
				title: '(..)',
//				cssStyle: 'jb-studio-primitive-jbeditor',
				action :{$: 'studio.openjbEditor', path: '%$path%'} 
			},
			{ $: 'button', 
				cssClass: 'jb-studio-primitive-arrow',
				action: { $: 'studio.openPrimitiveArrowPopup', 
					path: '%$path%', 
					isPrimitive: false 
				}
			}
		]
	}
})

jb.component('studio.propertyField-Javascript',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'group',
		title :{$: 'studio.prop-name', path: '%$path%' },
		controls: [
			{ $: 'button',
				text: '(..)',
				cssClass: 'jb-studio-primitive-javascript',
				action: { $: 'studio.openjsEditor', path: '%$path%'	}
			},
			{ $: 'button',
				cssClass: 'jb-studio-primitive-arrow',
				action: { $: 'studio.openPrimitiveArrowPopup', 
					path: '%$path%', 
					isPrimitive: false 
				}
			}
		]
	}
})

jb.component('studio.propertyField-Array',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'group',
		title :{$: 'studio.prop-name', path: '%$path%' },
		controls: [
		// { $: 'label', text: '{{param}}:' },
		{ $: 'itemlist',
			cssClass: 'jb-studio-array',
			items :{$: 'studio.children', path: '%$path%' },
			itemVariable: 'optionProfile',
			controls: [
			  { $: 'expandableSection', title: { $: 'studio.propertyArrayItemName' },
			  	style: { $: 'expandableSection.studioExpandableInArray'},
			    controls :{$: 'studio.properties', topProfile: '{{$optionProfile}}' }
			  },
			  { $: 'button' , text: [ 'Delete {{$param}}', { $: 'replace', find: 's$', replace: '' } ], 
			    style: { $: 'customCssStyle', base: { $: 'button.imageOnly' }, cssClass: 'jb-studio-delete-array-item' },
			    action: { $: 'studio.deleteArrayItem', profile: '{{$profile}}', param: '{{$param}}', item: '{{$optionProfile}}' }
			  }
			],
			features: [
			  { $show: function(context) {
			  	  return context.vars.control.items.length > 0;
			    }
			  }
			]
		},
		{ $: 'button', 
		  text: [ 'Add {{$param}}', { $: 'replace', find: 's$', replace: '' } ],
		  style: 'jb-studio-add-array-item',
		  action: { 
		  	$: 'studio.selectPT',
		  	type: '{{$paramDef.type}}',
		  	selectAction: [ 
		  	  { $: 'studio.addToProfileArray', profile: '{{$profile}}', param: '{{$param}}' },
		  	  function(context) {
		  	  	setTimeout(function() {
		  	  		// auto open the last added profile
		  	  		var $button = context.vars.$dialog.originalContext.vars.control.$el;
		  	  		var $lastPanel = $button.parent().find('.panel').last();
		  	  		$lastPanel.find('.panel-heading').first().click();	
		  	  		$lastPanel.find('input,textarea').first().focus();
		  	  	},20);
		  	  }
		  	]
		  }
		}
		],
		features: [
		  { $: 'hidePropertyTitle' }
		]
	}
});

jb.component('studio.openPrimitiveArrowPopup',{
	type: 'action',
	params: { 
		path: { as: 'string' },
		isPrimitive: { type: 'boolean', as: 'boolean'}
	},
	impl :{$: 'openDialog',
		style :{$: 'pulldownPopup.contextMenuPopup' },
		cssClass: 'jb-popup pulldown-mainmenu-popup',
		content :{$: 'group',
			controls: [
	 		    { $: 'pulldown.MenuItem', title: 'Edit in jbEditor', spritePosition: '6,0', 
				    action :{$: 'studio.openjbEditor', path: '%$path%' }
	 		    },
			    { $: 'pulldown.MenuItem', title: 'Delete script', 
			    	atts: { '[hidden]' : '%$isPrimitive%' },
				    action: [
				      { $: 'closeContainingPopup' },
				      { $: 'studio.delete', path: '%$path%' }
				    ],
	 		    }
			]
		}
	}
})

jb.component('studio.propertyField',{
	type: 'control',
	params: {
		path: { as: 'string' },
	},
	impl: function(context,path) {
		var fieldPT = 'studio.propertyField-Label';

		var val = studio.model.val(path);
		var valType = typeof val;
		var paramDef = studio.model.paramDef(path);
		if (valType == 'function')
			fieldPT = 'studio.propertyField-Javascript';
		else if (paramDef.options)
			fieldPT = 'studio.propertyField-Enum';
		else if ( ['data','boolean'].indexOf(paramDef.type || 'data') != -1 && ['number','string','undefined'].indexOf(valType) != -1) {
			if ( studio.model.compName(path))
				fieldPT = 'studio.propertyField-JBEditor';
			else
				fieldPT = 'studio.propertyField-Primitive';
		}
		// TBD: Array
		// else if ( (paramDef.type || 'data').indexOf('[]') > -1) {
		// 	val = val || [];
		// 	if (val && !Array.isArray(val)) val = [ val ];
		// 	fieldPT = 'studio.propertyField-Array';
		// }
		else if ( (paramDef.type || '').indexOf('.style') > -1 )
		 	fieldPT = 'studio.propertyField-Style';
		else 
			fieldPT = 'studio.propertyField-TgpType';

		return context.run({ $: fieldPT, path: path});
	}
})

// ********************* styles **********************

jb.component('tabControl.studioPropertiesAccordion',{
	type: 'tabControl.style',
	impl: function() {
		return {
			jbTemplate: '<div><div class="panel"><div class="panel-heading"><div class="panel-title"><div class="panel-toggle"/><a href="javascript:()"/></div></div><div class="panel-collapse"><div class="panel-body"></div></div></div>',
			cssClass: "jb-studio-accordion",
			init: function(cmp) { 
				control.$('.panel-body').css('max-height',$(window).height()-250); 
				jb_accordion(cmp); 
			}
		}
	}
})

jb.component('expandableSection.studioExpandableInArray',{
	type: 'expandableSection.style',
	impl: function() {
		return {
			jbTemplate: '<div class="panel"><div class="panel-heading"><div class="panel-title"><div class="panel-toggle"/><a href="javascript:()"/></div></div><div class="panel-collapse"><div class="panel-body"></div></div>',
			cssClass: "jb-studio-array-expandable",
			init: function(cmp) { 
				jb_expandableSection(cmp)
			}
}}})

jb.component('property-sheet.studio-properties', {
  type: 'group.style',
  impl :{$: 'customStyle',
    features :{$: 'group.initGroup' },
  	template: `<div>
      <div *ngFor="var ctrl of ctrls" class="property">
        <label class="property-title">{{ctrl.title}}</label>
        <jb_comp [comp]="ctrl.comp" class="property-ctrl"></jb_comp>
      </div>
      </div>
    `,
    css: `.property { margin-bottom: 5px; display: flex }
      .property:last-child { margin-bottom:0px }
      .property>.property-title {
        min-width: 90px;
        width: 90px;
        overflow:hidden;
        text-overflow:ellipsis;
        vertical-align:top;
        margin-top:2px;
        font-size:14px;
        margin-right: 10px;
      },
      .property>*:last-child { margin-right:0 }`
  }
})

jb.component('button.studio-edit-js', {
  type: 'button.style',
  impl :{$: 'customStyle',  
  	template: '<span><button (click)="clicked()" [title]="title">{}</button></span>',
  	css: `{ margin-top: -2px; margin-left: -3px; margin-right: -5px;}
  		 button { cursor: pointer; 
            font: 12px sans-serif; 
            border: none; 
            background: transparent; 
            color: #91B193; 
            text-shadow: 0 1px 0 #fff; 
            font-weight: 700; 
            opacity: .8;
        }
        button:hover { opacity: 1 }`
  }
})

jb.component('button.studio-delete', {
  type: 'button.style',
  impl :{$: 'customStyle',  
      template: '<span><button (click)="clicked()" [title]="title">&#215;</button></span>',
      css: `{ margin-left: -4px; margin-top: -1px }
      button {
            cursor: pointer; 
            font: 16px sans-serif; 
            border: none; 
            background: transparent; 
            color: #000; 
            text-shadow: 0 1px 0 #fff; 
            font-weight: 700; 
            opacity: .2;
        }
        button:hover { opacity: .5 }`
  }
})

jb.component('studio.tgp-path-options',{
	type: 'picklist.options',
	params: { 
		path: { as: 'string' },
	},
	impl: (context,path) => studio.model.PTsOfPath(path).map(op=> { return { code: op, text: op}})
})

jb.component('studio.tgp-type-options',{
	type: 'picklist.oopions',
	params: { 
		type: { as: 'string'} 
	},
	impl: (context,type) => studio.model.PTsOfType(type).map(op=> { return { code: op, text: op}})
})


jb.component('group.studio-watch-path', {
  type: 'feature',
  params: {
    path: { essential: true, as: 'string' },
  },
  impl: function(context, initialPath) {
  	var path = initialPath;
  	studio.pathChangesEm.subscribe(fixer => { path = fixer.fix(path) });
    return {
      ctrlsEmFunc: function(originalCtrlsEmFunc,ctx,cmp) {
        return cmp.jbEmitter
          .map(()=> profileChildren(path)) 
          .distinctUntilChanged()
          .filter(x=>x && x!='undefined')
          .map(x=>{console.log('group.studio-watch-path changed',x);return x})
          .flatMap(function(val) {
              return originalCtrlsEmFunc(ctx)
            }
          );
      },
      observable: () => {} // to create jbEmitter
	}

	function profileChildren() {
	  	return studio.model.nonControlParams(path).join(' ');
	}
	// function profileAsStr() {
	//   	return jb.prettyPrint(jb.val(studio.profileRefFromPath(path)))
	// }
  }
})


function jb_studioCopyDefaultValue(profile,param) {
	if (profile[param]) return;
	var comp = jb_compName(profile);
	if (!comp) return;
	var params = ((jb_jbart().comps[comp] || {}).params || {});
	if (params[param] && typeof params[param].defaultValue != 'undefined')
		profile[param] = jb_cloneData(params[param].defaultValue)
}

