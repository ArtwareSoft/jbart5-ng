import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {model} from './studio-tgp-model';
import {compAsStrFromPath,modifyOperationsEm,notifyModification,pathChangesEm} from './studio-utils';


jb.component('studio.open-properties', {
  type: 'action', 
  impl :{$: 'openDialog', 
    title: { $pipeline: [
      {$: 'object', 
        title :{$: 'studio.short-title', 
          path :{$: 'studio.currentProfilePath' }
        }, 
        comp :{$: 'studio.comp-name', 
          path :{$: 'studio.currentProfilePath' }
        }
      }, 
      'Properties of %comp% %title%'
    ]}, 
    style :{$: 'dialog.studio-floating', id: 'studio-properties', width: '492' }, 
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
				text :{$: 'studio.comp-source'},
				style:{$: 'text.codemirror'}
			},
		}
})

jb.component('studio.properties', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    title: '', 
    style :{$: 'group.studio-properties-accordion' }, 
    controls: [
      {$: 'group', 
        remark: 'properties', 
        title :{
          $pipeline: [
            {$: 'studio.val', path: '%$path%' }, 
            {$: 'count', 
              items :{
                $pipeline: [
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
              }
            }, 
            'Properties (%%)'
          ]
        }, 
        style :{$: 'property-sheet.studio-properties' }, 
        controls :{$: 'dynamic-controls', 
          controlItems :{
            $pipeline: [
              {$: 'studio.non-control-children', path: '%$path%' }, 
              {$: 'filter', 
                filter :{$: 'not', 
                  of :{$: 'endsWith', endsWith: '~features', text: '%%' }
                }
              }
            ]
          }, 
          genericControl :{$: 'studio.property-field', path: '%$controlItem%' }
        }, 
        features :{$: 'group.studio-watch-path', path: '%$path%' }
      }, 
      {$: 'group', 
        remark: 'features', 
        title :{
          $pipeline: [
            {$: 'studio.val', path: '%$path%' }, 
            {$: 'count', items: '%features%' }, 
            'Features (%%)'
          ]
        }, 
        controls :{$: 'studio.property-array', path: '%$path%~features' }, 
        features: [{$: 'group.studio-watch-path', path: '%$path%' }]
      }
    ], 
    features: [
      {$: 'group.dynamic-titles' }, 
      {$: 'hidden', 
        showCondition :{$: 'studio.has-param', path: '%$path%', param: 'features' }
      }
    ]
  }
})

jb.component('studio.properties-in-tgp',{
  type: 'control',
  params: [ {id: 'path', as: 'string' } ],
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
	params: [
		{ id: 'path', as: 'string' },
	],
	impl: function(context,path) {
		var fieldPT = 'studio.property-label';

		var val = model.val(path);
		var valType = typeof val;
		var paramDef = model.paramDef(path);
		if (!paramDef)
			jb.logError('property-field: no param def for path '+path);
		if (valType == 'function')
			fieldPT = 'studio.property-javascript';
		else if (paramDef.as == 'number')
			fieldPT = 'studio.property-slider';
		else if (paramDef.options)
			fieldPT = 'studio.property-enum';
		else if ( ['data','boolean'].indexOf(paramDef.type || 'data') != -1) {
			if ( model.compName(path) || valType == 'object')
				fieldPT = 'studio.property-script';
			else if (paramDef.type == 'boolean' && (valType == 'boolean' || val == null))
				fieldPT = 'studio.property-boolean';
			else
				fieldPT = 'studio.property-primitive';
		}
		else if ( (paramDef.type || '').indexOf('[]') != -1 && isNaN(Number(path.split('~').pop())))
			fieldPT = 'studio.property-script';
		// else if ( (paramDef.type || '').indexOf('.style') > -1 )
		//  	fieldPT = 'studio.property-Style';
    // else if ( model.compName(path) == 'customStyle')
    //   fieldPT = 'studio.property-custom-style';
		else 
			fieldPT = 'studio.property-tgp';

		return context.run({ $: fieldPT, path: path});
	}
})

jb.component('studio.property-label',{
	type: 'control',
	params: [ {id: 'path', as: 'string' } ],
	impl :{$: 'label', 
		title :{$: 'studio.prop-name', path: '%$path%' },
	}
});

jb.component('studio.property-primitive2', {
  type: 'control', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'editable-text', 
    style :{$: 'editable-text.studio-primitive-text' }, 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    databind :{$: 'studio.ref', path: '%$path%' }, 
    features: [
      {$: 'studio.undo-support', path: '%$path%' }, 
      {$: 'studio.property-toolbar-feature', path: '%$path%'},
      // {$: 'editable-text.suggestions-input-feature', 
      //   path: '%$path%', 
      //   action :{$: 'studio.jb-open-suggestions', path: '%$path%' }
      // }
    ]
  }
})

jb.component('studio.property-script', {
  type: 'control', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'group', 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    features: [
          {$: 'studio.undo-support', path: '%$path%' }, 
          {$: 'studio.property-toolbar-feature', path: '%$path%' }, 
    ],
    controls :{$: 'button', 
        title :{$: 'studio.data-script-summary', path: '%$path%' }, 
        action :{$: 'studio.open-jb-editor',path: '%$path%' } ,
        style :{$: 'button.studio-script'}
    }
  }
})

jb.component('studio.data-script-summary', {
  type: 'data', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl: (ctx,path) => {
  	var val = model.val(path);
  	if (model.compName(path))
  		return model.compName(path);
  	if (Array.isArray(val))
  		return jb.prettyPrint(val);
  	if (typeof val == 'function')
  		return 'javascript';
  }
})

jb.component('studio.property-boolean', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'editable-boolean', 
    databind :{$: 'studio.ref', path: '%$path%' }, 
    style :{$: 'editable-boolean.flipswitch' }, 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    features: [
      {$: 'studio.undo-support', path: '%$path%' }, 
      {$: 'studio.property-toolbar-feature', path: '%$path%' }
    ]
  }
})
jb.component('studio.property-enum',{
	type: 'control',
	params: [ {id: 'path', as: 'string' } ],
	impl :{$: 'picklist', 
		style :{$: 'picklist.studio-enum'},
		title :{$: 'studio.prop-name', path: '%$path%' },
		databind :{$: 'studio.ref', path: '%$path%' },
		options :{$: 'studio.enum-options', path: '%$path%' },
	}
})

jb.component('studio.property-slider', {
	type: 'control',
	params: [ {id: 'path', as: 'string' } ],
	impl :{$: 'editable-number', 
		$vars: { 
			paramDef :{$: 'studio.param-def', path: '%$path%' } 
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
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    $vars: {
      tgpCtrl :{$: 'object', expanded: true }
    }, 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    controls: [
      {$: 'group', 
        style :{$: 'layout.horizontal', spacing: '0' }, 
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
                  $and: [
                    {
                      $notEmpty :{$: 'studio.non-control-children', path: '%$path%' }
                    }, 
                    {
                      $notEmpty :{$: 'studio.val', path: '%$path%' }
                    }, 
                    {$: 'notEquals', 
                      item1 :{$: 'studio.comp-name', path: '%$path%' }, 
                      item2: 'customStyle'
                    }
                  ]
                }
              }
            ]
          }, 
          {$: 'picklist', 
            databind :{$: 'studio.comp-name-ref', path: '%$path%' }, 
            options :{$: 'studio.tgp-path-options', path: '%$path%' }, 
            promote :{$: 'picklist.promote', 
              groups :{$: 'list', items: ['layout'] }
            }, 
            style :{$: 'picklist.groups' }, 
            features: [
              {$: 'css', 
                css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
              }, 
              {$: 'studio.refresh-options-watch'}
            ]
          }
        ], 
        features :{$: 'css', css: '{ position: relative }' }
      }, 
      {$: 'group', 
        controls :{$: 'studio.properties-in-tgp', path: '%$path%' }, 
        features: [
          {$: 'group.watch', 
            data :{$: 'studio.comp-name', path: '%$path%' }
          }, 
          {$: 'hidden', 
            showCondition :{
              $and: [
                '%$tgpCtrl.expanded%', 
                {
                  $notEmpty :{$: 'studio.non-control-children', path: '%$path%' }
                }, 
                {
                  $notEmpty :{$: 'studio.val', path: '%$path%' }
                }, 
                {$: 'notEquals', 
                  item1 :{$: 'studio.comp-name', path: '%$path%' }, 
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
    ], 
    features: [
      {$: 'studio.property-toolbar-feature', path: '%$path%' }, 
      {$: 'studio.bindto-modifyOperations', 
        path: '%$path%', 
        data: '%$tgpCtrl/expanded%'
      }
    ]
  }
})

jb.component('studio.property-custom-style', {
  type: 'control', 
  params: [ {id: 'path', as: 'string' } ], 
  impl :{$: 'group', 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    features : [
      {$: 'studio.property-toolbar-feature', path: '%$path%' }, 
    ],
    controls :{$: 'picklist', 
            databind :{$: 'studio.comp-name-ref', path: '%$path%' }, 
            options :{$: 'studio.tgp-path-options', path: '%$path%' }, 
            style :{$: 'picklist.groups' }, 
            features : [
            {$: 'css', 
              css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
            },
            { $: 'picklist.dynamic-options', 
              recalcEm: ctx => 
                modifyOperationsEm.filter(e=>e.newComp)
            }
         ],
    }
  }
})


jb.component('studio.property-tgp-in-array', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    $vars: {
      tgpCtrl :{$: 'object', expanded: false }
    }, 
    controls: [
      {$: 'group', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'editable-boolean', 
            databind: '%$tgpCtrl/expanded%', 
            style :{$: 'editable-boolean.expand-collapse' }, 
            features: [
              {$: 'studio.bindto-modifyOperations', 
                path: '%$path%', 
                data: '%$tgpCtrl/expanded%'
              }, 
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
            databind :{$: 'studio.comp-name-ref', path: '%$path%' }, 
            options :{$: 'studio.tgp-path-options', path: '%$path%' }, 
            style :{$: 'picklist.groups' }, 
            features: [
              {$: 'css', 
                css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
              }
            ]
          }, 
          {$: 'studio.property-toolbar', path: '%$path%' }, 
          {$: 'label', 
            title :{$: 'studio.summary', path: '%$path%' }, 
            style :{$: 'label.span' }
          }
        ], 
        features: [{$: 'css', css: '{ position: relative; margin-left2: -80px }' }]
      }, 
      {$: 'group', 
        controls :{$: 'studio.properties-in-tgp', path: '%$path%' }, 
        features: [
          {$: 'group.watch', 
            data :{$: 'studio.comp-name', path: '%$path%' }
          }, 
          {$: 'feature.if', showCondition: '%$tgpCtrl.expanded%' }, 
          {$: 'css', 
            css: '{ margin-top: 9px; margin-left2: -100px; margin-bottom: 4px;}'
          }
        ]
      }
    ], 
    features: [
      {$: 'studio.bindto-modifyOperations', 
        path: '%$path%', 
        data: '%$tgpCtrl/expanded%'
      }, 
      {$: 'css', css: '{ position: relative; margin-left: -80px }' }
    ]
  }
})

jb.component('studio.property-array', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    $vars: {
      arrayCtrl :{$: 'object', expanded: true }
    }, 
    style :{$: 'layout.vertical', spacing: '7' }, 
    controls: [
      {$: 'group', 
        title: 'items', 
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
        ]
      }, 
      {$: 'button', 
        title: 'new feature', 
        action :{$: 'studio.open-new-feature-dialog', 
          type: 'feature', 
          title: 'new feature',
          onSelect: {$: 'studio.add-array-item', 
            path: '%$path%',
            toAdd: {$object : {$: '%%'} }
          }
        }, 
        style :{$: 'button.href' }, 
        features :{$: 'css.margin', top: '20', left: '20' }
      }
    ], 
    features: []
  }
})


jb.component('studio.tgp-path-options',{
	type: 'picklist.options',
	params: [ 
		{ id: 'path', as: 'string' },
	],
	impl: (context,path) => 
		[{code:'',text:''}]
			.concat(model.PTsOfPath(path).map(op=> ({ code: op, text: op})))
})

jb.component('studio.refresh-options-watch', {
  type: 'feature',
  impl :{$: 'picklist.dynamic-options', 
        recalcEm: () => 
          modifyOperationsEm.filter(e => 
            e.newComp)
  }
})

jb.component('studio.undo-support', {
  type: 'feature',
  params: [
    { id: 'path', essential: true, as: 'string' },
  ],
  impl: (ctx,path) => 
  	({
  		// saving state on focus and setting the change on blur
  		init: cmp => {
  			var before = compAsStrFromPath(path);
  			if (cmp.codeMirror) {
  				cmp.codeMirror.on('focus',()=>
  					before = compAsStrFromPath(path)
  				);
  				cmp.codeMirror.on('blur',()=>{
  					if (before != compAsStrFromPath(path))
						notifyModification(path,before,ctx)
  				});
  			} else {
  			$(cmp.elementRef.nativeElement).findIncludeSelf('input')
  				.focus(e=> {
  					before = compAsStrFromPath(path)
  				})
  				.blur(e=> {
  					if (before != compAsStrFromPath(path))
						notifyModification(path,before,ctx)
  				})
  			}
  		}
  })
})

jb.component('studio.bindto-modifyOperations', {
  type: 'feature',
  params: [
    { id: 'path', essential: true, as: 'string' },
    { id: 'data', as: 'ref' }
  ],
  impl: (context, path,data_ref) => ({
      init: cmp =>  
        modifyOperationsEm
          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') )
          .filter(e=>
            e.path == path)
          .subscribe(e=>
              jb.writeValue(data_ref,true)
          ),
      observable: () => {} // to create jbEmitter
    })
})



