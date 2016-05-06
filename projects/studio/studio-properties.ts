import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jb.component('studio.openProperties', {
	type: 'action',
	impl :{$: 'openDialog',
		title: [
			{ $: 'object', 
				title: { $: 'studio.short-title', path: { $: 'studio.currentProfilePath' } },
				comp: { $: 'studio.compName', path: { $: 'studio.currentProfilePath' } }
			},
			'Properties of %comp% %title%'
		],
		style :{$: 'dialog.studioFloating', id: 'studio properties' },
		content :{$: 'studio.properties', path: { $: 'studio.currentProfilePath' } }
	}
})

jb.component('studio.openSourceDialog', {
	type: 'action',
	impl :{$: 'openDialog',
			modal: true,
			title: 'Source',
        	style :{$: 'dialog.md-dialog-ok-cancel' },
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
		    genericControl :{$: 'studio.property-field', path: '%$controlItem%' } 
		}
	}
})

jb.component('studio.property-field',{
	type: 'control',
	params: {
		path: { as: 'string' },
	},
	impl: function(context,path) {
		var fieldPT = 'studio.property-label';

		var val = studio.model.val(path);
		var valType = typeof val;
		var paramDef = studio.model.paramDef(path);
		if (!paramDef)
			jb.logError('property-field: no param def for path '+path);
		if (valType == 'function')
			fieldPT = 'studio.property-javascript';
		else if (paramDef.as == 'number')
			fieldPT = 'studio.property-slider';
		else if (paramDef.options)
			fieldPT = 'studio.property-enum';
		else if ( ['data','boolean'].indexOf(paramDef.type || 'data') != -1 && ['number','string','undefined'].indexOf(valType) != -1) {
			if ( studio.model.compName(path))
				fieldPT = 'studio.property-JBEditor';
			else
				fieldPT = 'studio.property-primitive';
		}
		else if ( (paramDef.type || '').indexOf('[]') != -1 && isNaN(Number(path.split('~').pop())))
			fieldPT = 'studio.property-array';
		// else if ( (paramDef.type || '').indexOf('.style') > -1 )
		//  	fieldPT = 'studio.property-Style';
		else 
			fieldPT = 'studio.property-tgp';

		return context.run({ $: fieldPT, path: path});
	}
})

jb.component('studio.property-label',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'label', 
		title :{$: 'studio.prop-name', path: '%$path%' },
	}
});

jb.component('studio.property-primitive',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'group', 
		style :{$: 'layout.horizontal', spacing: 2 },
		title :{$: 'studio.prop-name', path: '%$path%' },
		controls: [
			{ $: 'editable-text',
				features : [
					{$: 'css', css: 'input { font-size: 12px; padding-left: 2px; width: 145px;}' },
					{$: 'studio.undo-support', path: '%$path%' }
				],
				databind :{$: 'studio.ref', path: '%$path%' }
			},
			{ $: 'button' ,
				title: 'more',
				style :{$: 'button.studio-properties-toolbar', icon: 'more_vert' }, 
				action :{$: 'studio.open-property-menu', path: '%$path%' },
			}
		]
	}
})

jb.component('studio.property-enum',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'picklist', 
		title :{$: 'studio.prop-name', path: '%$path%' },
		databind :{$: 'studio.ref', path: '%$path%' },
		options :{$: 'studio.enum-options', path: '%$path%' },
	}
})

jb.component('studio.property-slider',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'editable-number', 
		title :{$: 'studio.prop-name', path: '%$path%' },
		databind :{$: 'studio.ref', path: '%$path%' },
		style :{$: 'editable-number.slider', width: '120px' },
		features :{$: 'css', css: '{ margin-left: -5px; }' },
	}
})


jb.component('studio.property-tgp',{
	type: 'control',
	params: { 
		path: { as: 'string'},
		inArray: { type: 'boolean'}
	},
	impl :{$: 'group',
		title :{$: 'studio.prop-name', path: '%$path%' },
		$vars: {
			'tgpCtrl' : {$: 'object' , expanded: true }
		},
		controls: [
			{ $: 'group',
			  style :{$: 'layout.horizontal' },
			  controls: [
					{ 	$: 'editable-boolean',
						style :{$: 'editable-boolean.expand-collapse'},
						features :{$: 'css', css: '{ position: absolute; margin-left: -20px; margin-top: 2px }' },
						databind: '%$tgpCtrl/expanded%',
					},
					{ $: 'picklist',
						features :{$: 'css', css: 'select { width: 150px; font-size: 12px; height: 23px;}' },
						databind :{$: 'studio.compName-ref', path: '%$path%' },
						options :{$: 'studio.tgp-path-options', path: '%$path%' },
					},
					{ $: 'button' ,
						title: 'more',
						style :{$: 'button.studio-properties-toolbar', icon: 'more_vert' }, 
						action :{$: 'studio.open-property-menu', path: '%$path%' },
					},
			  ]
			},
			{ $: 'group',
				controls :{$: 'studio.properties', 	path: '%$path%' },
				features : [ 
					{$: 'group.watch', data :{$: 'studio.compName', path: '%$path%' } },
					{$: 'hidden', showCondition: '%$tgpCtrl.expanded%' },
					{$: 'css', 
						css :{$if: '%$inArray%',
							then: '{ margin-top: 9px; margin-left: -100px; margin-bottom: 4px;}',
							else: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'
						}
					}
				],
			}
		]
	}
})

jb.component('studio.property-array',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'group',
		$vars: {
			'arrayCtrl' : {$: 'object' , expanded: true }
		},
		title :{$: 'studio.prop-name', path: '%$path%' },
		controls: [
			{ $: 'group',
			  style :{$: 'layout.horizontal' },
			  features :{$: 'css', css: '{ height: 28px; margin-left: 174px; }' },
			  controls: [
					{ 	$: 'editable-boolean',
						style :{$: 'editable-boolean.studio-expand-collapse-in-toolbar'},
						features :{$: 'css', css: '.material-icons { font-size: 16px }' },
						databind: '%$arrayCtrl/expanded%',
					},
			      { $: 'button', 
			        title: 'add', 
			        style :{$: 'button.studio-properties-toolbar', icon: 'add' },
			        action :{$: 'studio.newArrayItem', path: '%$path%' },
					features :{$: 'css', css: '.material-icons { font-size: 16px }' },
			      },
			  ]
			},

		  {$: 'itemlist',
				items :{$: 'studio.array-children', path: '%$path%' },
				itemVariable: 'arrayItem',
				controls :{$:'group',
					style :{$: 'property-sheet.studio-properties'},
					controls :{$: 'studio.property-tgp', path: '%$arrayItem%', inArray: true },
				},
				features : [
					{$: 'hidden', showCondition: '%$arrayCtrl.expanded%' },
					{$: 'css', css: `{ margin-left: -80px}` },
					{$: 'itemlist.divider'},
					{$: 'itemlist.drag-and-drop'},
				]
		  }
		],
	}
})


jb.component('studio.open-property-menu',{
	type: 'action',
	params: { 
		path: { as: 'string' },
	},
	impl :{$: 'openDialog',
		style :{$: 'pulldownPopup.contextMenuPopup' },
		content :{$: 'group',
			controls: [
	 		    { $: 'pulldown.menu-item', title: 'Delete', icon: 'delete', shortcut: 'Delete',
					action : [ 
						{$: 'writeValue', value: false, to: '%$TgpTypeCtrl.expanded%'},
						{$: 'studio.delete', path: '%$path%' },
					],
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'javascript editor', icon: 'code',
				    action :{$: 'studio.editSource', path: '%$path%' }
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'Goto sublime',
				    action :{$: 'studio.openSublime', path: '%$path%' }
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'Customize Style', icon: 'build',
				    action :{$: 'studio.openStyleEditor', path: '%$path%' },
				    features :{$: 'hidden', showCondition :{$: 'endsWith', text: '%$path%', endsWith: '~style' } }
	 		    },
			]
		}
	}
})

// jb.component('studio.property-Style',{
// 	type: 'control',
// 	params: { path: { as: 'string' } },
// 	impl :{$: 'group',
// 		title :{$: 'studio.prop-name', path: '%$path%' },
// 		$vars: {
// 			'TgpTypeCtrl' :{$: 'object' , expanded: true }
// 		},
// 		controls: [
// 			{ $: 'group',
// 			  style :{$: 'layout.horizontal' },
// 			  controls: [
// 					{ $: 'picklist',
// 						cssClass: 'jb-studio-tgpType-picklist',
// 						databind :{$: 'studio.compName-ref', path: '%$path%' },
// 						options :{$: 'studio.tgp-path-options', path: '%$path%' },
// 					},
// 					{ $: 'group',
// 			  			style :{$: 'layout.horizontal' },
// 			  			controls:
// 			  			[
// 			  				{ $: 'editable-boolean',
// 								style :{$: 'editable-boolean.expand-collapse'},
// 								databind: '%$TgpTypeCtrl/expanded%',
// 								features :{$: 'hidden', showCondition :{$not: { $: 'studio.isCustomStyle', path: '%$path%' } }}
// 							},
// 							{ $: 'button' ,
// 								title: 'customize style',
// 								style :{$: 'button.studio-properties-toolbar', icon: 'build' }, 
// 								action : [ 
// 									{$: 'studio.makeLocal', path: '%$path%' },
// 									{$: 'studio.openEditStyle', path: '%$path%' },
// 								],
// 								features :{$: 'hidden', showCondition :{$not :{$: 'studio.isCustomStyle', path: '%$path%' } }}
// 							},
// 							{ $: 'button' ,
// 								title: 'open sublime',
// 								style :{$: 'button.studio-properties-toolbar', icon: 'code' },
// 								action :{$: 'studio.openSublime', path: '%$path%' },
// 							},
// 							{ $: 'button' ,
// 								title: 'edit custom style',
// 								style :{$: 'button.md-icon', icon: 'input' }, 
// 								action :{$: 'studio.openEditStyle', path: '%$path%' },
// 								features :{$: 'hidden', showCondition :{$: 'studio.isCustomStyle', path: '%$path%' } }
// 							},
// 							{ $: 'button' ,
// 								title: 'share style',
// 								style :{$: 'button.md-icon', icon: 'add' }, 
// 								action :{$: 'studio.shareStyle', path: '%$path%' },
// 								features :{$: 'hidden', showCondition : false } //{$: 'studio.isCustomStyle', path: '%$path%' } }
// 							},
// 					  ]
// 					},
// 				]
// 			},
// 			{ $: 'group',
// 				controls :{$: 'studio.properties', 	path: '%$path%' },
// 				features : [ 
// 					{$: 'group.watch', data :{$: 'studio.compName', path: '%$path%' }},
// 					{$: 'hidden', showCondition: {$and: 
// 						[
// 							'%$TgpTypeCtrl.expanded%', 
// 							{$not: { $: 'studio.isCustomStyle', path: '%$path%' } }
// 						] 
// 					}},
// 					{$: 'css', css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'},
// 				],
// 			}
// 		]
// 	}
// })

// jb.component('studio.property-JBEditor',{
// 	type: 'control',
// 	params: { path: { as: 'string'} },
// 	impl :{$: 'group',
// 		title :{$: 'studio.prop-name', path: '%$path%' },
// 		controls: [
// 			{ $: 'button',
// 				title: '(..)',
// //				cssStyle: 'jb-studio-primitive-jbeditor',
// 				action :{$: 'studio.openjbEditor', path: '%$path%'} 
// 			},
// 			{ $: 'button', 
// 				style: {$: 'button.popup-menu' },
// 				action: { $: 'studio.openPrimitiveArrowPopup', 
// 					path: '%$path%', 
// 					isPrimitive: false 
// 				}
// 			}
// 		]
// 	}
// })

// jb.component('studio.property-Javascript',{
// 	type: 'control',
// 	params: { path: { as: 'string'} },
// 	impl :{$: 'group',
// 		title :{$: 'studio.prop-name', path: '%$path%' },
// 		controls: [
// 			{ $: 'button',
// 				text: '(..)',
// 				cssClass: 'jb-studio-primitive-javascript',
// 				action: { $: 'studio.openjsEditor', path: '%$path%'	}
// 			},
// 			{ $: 'button' ,
// 				title: 'more',
// 				style :{$: 'button.studio-properties-toolbar', icon: 'more_vert' }, 
// 				action :{$: 'studio.open-property-menu', path: '%$path%' },
// 			},
// 		]
// 	}
// })

// jb.component('studio.openPrimitiveArrowPopup',{
// 	type: 'action',
// 	params: { 
// 		path: { as: 'string' },
// 		isPrimitive: { type: 'boolean', as: 'boolean'}
// 	},
// 	impl :{$: 'openDialog',
// 		style :{$: 'pulldownPopup.contextMenuPopup' },
// 		cssClass: 'jb-popup pulldown-mainmenu-popup',
// 		content :{$: 'group',
// 			controls: [
// 	 		    { $: 'pulldown.menu-item', title: 'Edit in jbEditor', spritePosition: '6,0', 
// 				    action :{$: 'studio.openjbEditor', path: '%$path%' }
// 	 		    },
// 			    { $: 'pulldown.menu-item', title: 'Delete script', 
// 			    	atts: { '[hidden]' : '%$isPrimitive%' },
// 				    action: [
// 				      { $: 'closeContainingPopup' },
// 				      { $: 'studio.delete', path: '%$path%' }
// 				    ],
// 	 		    }
// 			]
// 		}
// 	}
// })


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
        <label class="property-title">{{ctrl.comp.jb_title()}}</label>
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

jb.component('button.studio-properties-toolbar', {
  type: 'button.style',
  params: {
    icon: { as: 'string', default: 'code' },
  },
  impl :{$: 'customStyle', 
      template: `<span><button md-icon-button md-button aria-label="%$aria%" (click)="clicked()" title="{{title}}">
                <i class="material-icons">%$icon%</i>
              </button></span>`,
      css: `button { width: 24px; height: 24px; padding: 0; margin-top: -3px;}
     	.material-icons { font-size:12px;  }
      `
  }
})

jb.component('editable-boolean.studio-expand-collapse-in-toolbar', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle',
      template: `<span><button md-icon-button md-button (click)="toggle()" title="{{yesNo ? 'collapse' : 'expand'}}">
      	<i class="material-icons">{{yesNo ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>
      	</button></span>`,
      css: `button { width: 24px; height: 24px; padding: 0; margin-top: -3px;}
     	.material-icons { font-size:12px;  }
      `,
      methods: {
        afterViewInit: ctx => cmp => cmp.bindViaSettings()
      }
   }
})

// jb.component('button.studio-edit-js', {
//   type: 'button.style',
//   impl :{$: 'customStyle',  
//   	template: '<span><button (click)="clicked()" [title]="title">{}</button></span>',
//   	css: `{ margin-top: -2px; margin-left: -3px; margin-right: -5px;}
//   		 button { cursor: pointer; 
//             font: 12px sans-serif; 
//             border: none; 
//             background: transparent; 
//             color: #91B193; 
//             text-shadow: 0 1px 0 #fff; 
//             font-weight: 700; 
//             opacity: .8;
//         }
//         button:hover { opacity: 1 }`
//   }
// })

// jb.component('button.studio-delete', {
//   type: 'button.style',
//   impl :{$: 'customStyle',  
//       template: '<span><button (click)="clicked()" [title]="title">&#215;</button></span>',
//       css: `{ margin-left: -4px; margin-top: -1px }
//       button {
//             cursor: pointer; 
//             font: 16px sans-serif; 
//             border: none; 
//             background: transparent; 
//             color: #000; 
//             text-shadow: 0 1px 0 #fff; 
//             font-weight: 700; 
//             opacity: .2;
//         }
//         button:hover { opacity: .5 }`
//   }
// })

jb.component('button.popup-menu', {
  type: 'button.style',
  impl :{$: 'customStyle',  
      template: '<span><button (click)="clicked()" [title]="title"></button></span>',
      css: `
		button { border: none; cursor: pointer;  width: 0px;  height: 0px;  
			margin: 8px 0 0 6px;  border-top: 5px solid #91B193;  border-bottom: 3px solid transparent;  border-right: 4px solid transparent;  border-left: 4px solid transparent;
		  display: inline-block;  vertical-align: top; padding: 0; background: transparent;}
		button:hover { border-top: 5px solid #6A886C; }
		button:focus { outline: none; }
		`
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
	impl: (context,type) => 
		studio.model.PTsOfType(type).map(op=>({ code: op, text: op}))
})

jb.component('studio.undo-support', {
  type: 'feature',
  params: {
    path: { essential: true, as: 'string' },
  },
  impl: (ctx,path) => 
  	({
  		// saving state on focus and setting the change on blur
  		init: cmp => {
  			var before = studio.compAsStrFromPath(path);
  			$(cmp.elementRef.nativeElement).findIncludeSelf('input')
  				.focus(e=> {
  					before = studio.compAsStrFromPath(path)
  				})
  				.blur(e=> {
  					if (before != studio.compAsStrFromPath(path))
						studio.notifyModifcation(path,before,ctx)
  				})
  		}
  })
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

