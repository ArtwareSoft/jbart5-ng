import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jb.component('studio.open-properties', {
  type: 'action', 
  impl :{$: 'openDialog', 
    title: [
      {$: 'object', 
        title :{$: 'studio.short-title', 
          path :{$: 'studio.currentProfilePath' }
        }, 
        comp :{$: 'studio.compName', 
          path :{$: 'studio.currentProfilePath' }
        }
      }, 
      'Properties of %comp% %title%'
    ], 
    style :{$: 'dialog.studio-floating', id: 'studio-properties', width: '500' }, 
    content :{$: 'studio.properties', 
      path :{$: 'studio.currentProfilePath' }
    }, 
  }
})

jb.component('studio.open-source-dialog', {
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

jb.component('studio.properties', {
  type: 'control', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'group', 
    style :{$: 'group.studio-properties-accordion' }, 
    controls: [
      {$: 'group', 
        title: [
          {$: 'studio.val', path: '%$path%' }, 
          {$: 'count', 
            items: [
              {$: 'objectProperties' }, 
              {$: 'filter', 
                filter :{$: 'notEquals', item1: '%%', item2: 'features' }
              }, 
              {$: 'filter', 
                filter :{$: 'notEquals', item1: '%%', item2: '$' }
              }, 
              {$: 'filter', 
                filter :{$: 'notEquals', item1: '%%', item2: 'controls' }
              }
            ]
          }, 
          'Properties (%%)'
        ], 
        style :{$: 'property-sheet.studio-properties' }, 
        controls :{$: 'dynamic-controls', 
          controlItems: [
            {$: 'studio.non-control-children', path: '%$path%' }, 
            {$: 'filter', 
              filter :{$: 'not', 
                of :{$: 'endsWith', endsWith: '~features', text: '%%' }
              }
            }
          ], 
          genericControl :{$: 'studio.property-field', path: '%$controlItem%' }
        }, 
        features :{$: 'group.studio-watch-path', path: '%$path%' }
      }, 
      {$: 'group', 
        title: [
          {$: 'studio.val', path: '%$path%' }, 
          {$: 'count', items: '%features%' }, 
          'Features (%%)'
        ], 
        features :{$: 'group.studio-watch-path', path: '%$path%' }, 
        controls: [{$: 'studio.property-array', path: '%$path%~features' }]
      }
    ], 
    features: [
      {$: 'css.width', width: '502' }, 
      {$: 'group.dynamic-sub-titles' }, 
      {$: 'css.margin', left: '-10' }, 
      {$: 'hidden', 
        showCondition :{$: 'studio.has-param', param: 'features', path: '%$path%' }
      }
    ]
  }
})

jb.component('studio.properties-in-tgp',{
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
		else if ( ['data','boolean'].indexOf(paramDef.type || 'data') != -1) {
			if ( studio.model.compName(path) || valType == 'object')
				fieldPT = 'studio.property-data-script';
			else if (paramDef.type == 'boolean' && (valType == 'boolean' || val == null))
				fieldPT = 'studio.property-boolean';
			else
				fieldPT = 'studio.property-primitive';
		}
		else if ( (paramDef.type || '').indexOf('[]') != -1 && isNaN(Number(path.split('~').pop())))
			fieldPT = 'studio.property-array';
		// else if ( (paramDef.type || '').indexOf('.style') > -1 )
		//  	fieldPT = 'studio.property-Style';
    // else if ( studio.model.compName(path) == 'customStyle')
    //   fieldPT = 'studio.property-custom-style';
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

jb.component('studio.property-primitive', {
  type: 'control', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'editable-text', 
    style :{$: 'editable-text.studio-primitive-text' }, 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    databind :{$: 'studio.ref', path: '%$path%' }, 
    features: [
      {$: 'studio.undo-support', path: '%$path%' }, 
      {$: 'studio.property-toobar-feature', path: '%$path%'},
      {$: 'editable-text.suggestions-input-feature', 
        path: '%$path%', 
        action :{$: 'studio.jb-open-suggestions', path: '%$path%' }
      }
    ]
  }
})

jb.component('studio.property-data-script', {
  type: 'control', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'group', 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    features: [
          {$: 'studio.undo-support', path: '%$path%' }, 
          {$: 'studio.property-toobar-feature', path: '%$path%' }, 
    ],
    controls :{$: 'button', 
        title :{$: 'studio.data-script-summary', path: '%$path%' }, 
        action :{$: 'studio.open-jb-editor',path: '%$path%' } ,
        style :{$: 'button.studio-data-script'}
    }
  }
})

jb.component('studio.data-script-summary', {
  type: 'data', 
  params: {
    path: { as: 'string' }
  }, 
  impl: (ctx,path) => {
  	var val = studio.model.val(path);
  	if (studio.model.compName(path))
  		return studio.model.compName(path);
  	if (Array.isArray(val))
  		return jb.prettyPrint(val);
  	if (typeof val == 'function')
  		return 'javascript';
  }
})

jb.component('studio.property-boolean',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'editable-boolean',
		style: {$: 'editable-boolean.studio-slide-toggle'},
		title :{$: 'studio.prop-name', path: '%$path%' },
		databind :{$: 'studio.ref', path: '%$path%' },
		features : [
			{$: 'studio.undo-support', path: '%$path%' },
			{$: 'studio.property-toobar-feature', path: '%$path%' }
		],
	}
})
jb.component('studio.property-enum',{
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'picklist', 
		style :{$: 'picklist.studio-enum'},
		title :{$: 'studio.prop-name', path: '%$path%' },
		databind :{$: 'studio.ref', path: '%$path%' },
		options :{$: 'studio.enum-options', path: '%$path%' },
	}
})

jb.component('studio.property-slider', {
	type: 'control',
	params: { path: { as: 'string'} },
	impl :{$: 'editable-number', 
		$vars: { 
			paramDef :{$: 'studio.paramDef', path: '%$path%' } 
		},
		title :{$: 'studio.prop-name', path: '%$path%' },
		databind :{$: 'studio.ref', path: '%$path%' },
		style :{$: 'editable-number.slider', width: '120' },
		min: '%$paramDef/min%',
		max: '%$paramDef/max%',
		step: '%$paramDef/step%',
		features :{$: 'css', css: '{ margin-left: -5px; }' },
	}
})

jb.component('studio.property-tgp', {
  type: 'control', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'group', 
    $vars: {
      tgpCtrl :{$: 'object', expanded: true }
    }, 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    features: [
      {$: 'studio.property-toobar-feature', path: '%$path%' }, 
      {$: 'studio.bindto-modifyOperations', 
        data: '%$tgpCtrl/expanded%', 
        path: '%$path%'
      }
    ], 
    controls: [
      {$: 'group', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'editable-boolean', 
            databind: '%$tgpCtrl/expanded%', 
            style :{$: 'editable-boolean.expand-collapse' }, 
            features: [
              {$: 'css', 
                css: '{ position: absolute; margin-left: -20px; margin-top: 2px }'
              }, 
              {$: 'hidden', 
                showCondition :{ 
                  $and: 
                  [
                    { $notEmpty :{$: 'studio.non-control-children', path: '%$path%' } },
                    { $notEmpty :{$: 'studio.val', path: '%$path%' } },
                    { $: 'notEquals', 
                      item1 :{$: 'studio.compName', path: '%$path%' }, 
                      item2: 'customStyle'
                    }
                  ]
                }
              }  
            ]
          }, 
          {$: 'picklist', 
            databind :{$: 'studio.compName-ref', path: '%$path%' }, 
            options :{$: 'studio.tgp-path-options', path: '%$path%' }, 
            style :{$: 'picklist.groups' }, 
            features: [
              {$: 'css', 
                css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
              }, 
              {$: 'picklist.dynamic-options', 
                recalcEm: function (ctx) {
                                                return studio.modifyOperationsEm.filter(function (e) { return e.newComp; });
                                            }
              }
            ]
          }
        ], 
        features :{$: 'css', css: '{ position: relative }' }
      }, 
      {$: 'group', 
        controls :{$: 'studio.properties-in-tgp', path: '%$path%' }, 
        features: [
          {$: 'group.watch', 
            data :{$: 'studio.compName', path: '%$path%' }
          }, 
          {$: 'hidden', 
          showCondition :{ 
            $and: 
            [
              '%$tgpCtrl.expanded%',
              { $notEmpty :{$: 'studio.non-control-children', path: '%$path%' } },
              { $notEmpty :{$: 'studio.val', path: '%$path%' } },
              { $: 'notEquals', 
                item1 :{$: 'studio.compName', path: '%$path%' }, 
                item2: 'customStyle'
              }
            ]
          }
        },  
          {$: 'css', 
            css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'
          }
        ]
      }
    ]
  }
})

jb.component('studio.property-custom-style', {
  type: 'control', 
  params: { path: { as: 'string' } }, 
  impl :{$: 'group', 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    features : [
      {$: 'studio.property-toobar-feature', path: '%$path%' }, 
    ],
    controls :{$: 'picklist', 
            databind :{$: 'studio.compName-ref', path: '%$path%' }, 
            options :{$: 'studio.tgp-path-options', path: '%$path%' }, 
            style :{$: 'picklist.groups' }, 
            features : [
            {$: 'css', 
              css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
            },
            { $: 'picklist.dynamic-options', 
              recalcEm: ctx => 
                studio.modifyOperationsEm.filter(e=>e.newComp)
            }
         ],
    }
  }
})


jb.component('studio.property-tgp-in-array', {
  type: 'control', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'group', 
    $vars: {
      tgpCtrl :{$: 'object', expanded: false }
    }, 
    features: [
      {$: 'studio.bindto-modifyOperations', 
        data: '%$tgpCtrl/expanded%', 
        path: '%$path%'
      }, 
      {$: 'css', css: '{ position: relative; margin-left: -80px }' },
      //{$: 'studio.property-toobar-feature', path: '%$path%' }
    ], 
    controls: [
      {$: 'group', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'editable-boolean', 
            databind: '%$tgpCtrl/expanded%', 
            style :{$: 'editable-boolean.expand-collapse' }, 
            features: [
              {$: 'css', 
                css: '{ position: absolute; margin-left: -20px; margin-top: 2px }'
              }, 
              {$: 'hidden', 
                showCondition :{
                  $notEmpty :{$: 'studio.non-control-children', path: '%$path%' }
                }
              }
            ]
          }, 
          {$: 'picklist', 
            databind :{$: 'studio.compName-ref', path: '%$path%' }, 
            options :{$: 'studio.tgp-path-options', path: '%$path%' }, 
            style :{$: 'picklist.groups' }, 
            features: [
              {$: 'css', 
                css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
              }, 
            ]
          },
          {$: 'studio.property-toobar', path: '%$path%' }
        ], 
        features: [
          {$: 'css', css: '{ position: relative; margin-left2: -80px }' }, 
        ]
      }, 
      {$: 'group', 
        controls :{$: 'studio.properties-in-tgp', path: '%$path%' }, 
        features: [
          {$: 'group.watch', 
            data :{$: 'studio.compName', path: '%$path%' }
          }, 
          {$: 'hidden', showCondition: '%$tgpCtrl.expanded%' }, 
          {$: 'css', 
            css: '{ margin-top: 9px; margin-left2: -100px; margin-bottom: 4px;}'
          }
        ]
      }
    ]
  }
})

jb.component('studio.property-array', {
  type: 'control', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'group', 
    $vars: {
      arrayCtrl :{$: 'object', expanded: true }
    }, 
    controls: [
      {$: 'group', 
        controls: [
          {$: 'itemlist', 
            items :{$: 'studio.array-children', path: '%$path%' }, 
            controls :{$: 'group', 
              style :{$: 'property-sheet.studio-plain' }, 
              controls :{$: 'studio.property-tgp-in-array', path: '%$arrayItem%' }
            }, 
            itemVariable: 'arrayItem', 
            features: [
              {$: 'hidden', showCondition: true }, 
              {$: 'itemlist.divider' }, 
              {$: 'itemlist.drag-and-drop' }
            ]
          }
        ], 
        title: 'items'
      }, 
      {$: 'button', 
        title: 'new feature', 
        action :{$: 'studio.newArrayItem', path: '%$path%' }, 
        style :{$: 'button.href' }, 
        features :{$: 'css.margin', top: '20', left: '20' }
      }
    ], 
    features: [], 
    style :{$: 'layout.vertical', spacing: '7' }
  }
})


jb.component('studio.tgp-path-options',{
	type: 'picklist.options',
	params: { 
		path: { as: 'string' },
	},
	impl: (context,path) => 
		[{code:'',text:''}]
			.concat(studio.model.PTsOfPath(path).map(op=> ({ code: op, text: op})))
})

jb.component('studio.tgp-type-options',{
	type: 'picklist.options',
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
  			if (cmp.codeMirror) {
  				cmp.codeMirror.on('focus',()=>
  					before = studio.compAsStrFromPath(path)
  				);
  				cmp.codeMirror.on('blur',()=>{
  					if (before != studio.compAsStrFromPath(path))
						studio.notifyModifcation(path,before,ctx)
  				});
  			} else {
  			$(cmp.elementRef.nativeElement).findIncludeSelf('input')
  				.focus(e=> {
  					before = studio.compAsStrFromPath(path)
  				})
  				.blur(e=> {
  					if (before != studio.compAsStrFromPath(path))
						studio.notifyModifcation(path,before,ctx)
  				})
  			}
  		}
  })
})

jb.component('studio.bindto-modifyOperations', {
  type: 'feature',
  params: {
    path: { essential: true, as: 'string' },
    data: { as: 'ref' }
  },
  impl: function(context, path,_data) {
        studio.modifyOperationsEm
          .filter(e=>
            e.path == path)
          .subscribe(e=>
              jb.writeValue(_data,true)
          )
    }
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


