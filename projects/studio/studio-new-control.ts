import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {model} from './studio-tgp-model';
import {modifyOperationsEm} from './studio-utils';
import {MdButtonModule} from '@angular/material';

jb.component('studio.open-new-control-dialog', {
  impl :{$: 'studio.open-new-tgp-dialog',
    type: 'control',
    title: 'new control',
    onOK: [
      {$: 'studio.onNextModifiedPath', 
        action: [
          {$: 'studio.openModifiedPath' }, 
          {$: 'studio.refresh-preview' }
        ]
      }, 
      {$: 'studio.insert-comp', 
        path :{$: 'studio.currentProfilePath' }, 
        comp: '%%'
      }
    ]
  }
})

jb.component('studio.select-PT', {
  type: 'control', 
  params: [
    { id: 'type', as: 'string' }, 
    { id: 'title', as: 'string' }, 
    { id: 'onSelect', type: 'action', dynamic: true }
  ], 
  impl :{$: 'group', 
    title: 'itemlist-with-find', 
    style :{$: 'layout.vertical', spacing: 3 }, 
    controls: [
      {$: 'editable-text', 
        title: 'search', 
        databind: '%$globals/ctrl_pattern%', 
        style :{$: 'editable-text.md-input' }
      }, 
      {$: 'group', 
        title: 'categories and items', 
        style :{$: 'layout.horizontal', spacing: 3 }, 
        controls: [
          {$: 'picklist', 
            options :{$: 'picklist.optionsByComma', options: 'a,b,c' }, 
          }, 
          {$: 'itemlist', 
            title: 'items', 
            items :{
              $pipeline: [
                {$: 'studio.PTs-of-type', type: '%$type%' }, 
                {$: 'search-filter', pattern: '%$globals/ctrl_pattern%' }
              ]
            }, 
            controls: [
              {$: 'button', 
                title: '%%', 
                action: [{$: 'closeContainingPopup' }, { $call: 'onSelect' }], 
                style :{$: 'button.md-flat-no-background' }, 
                features :{$: 'css', css: '!button { text-align: left; width: 250px }' }
              }
            ], 
            watchItems: true, 
            itemVariable: 'item', 
            features :{$: 'css.height', height: '400', overflow: 'scroll', minMax: '' }
          }
        ]
      }
    ], 
    features: [{$: 'css.margin', top: '10', left: '20' }]
  }
})

jb.component('studio.open-new-tgp-dialog', {
  type: 'action', 
  params: [
    { id: 'type', as: 'string' }, 
    { id: 'title', as: 'string' }, 
    { id: 'onOK', type: 'action', dynamic: true }
  ], 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-floating' }, 
    content :{$: 'studio.select-PT', type: '%$type%', onSelect: {$call: 'onOK'}} , 
    title: '%$title%', 
    modal: true, 
    features: [
      {$: 'css.height', height: '420', overflow: 'hidden' }, 
      {$: 'css.width', width: '350', overflow: 'hidden' }, 
      {$: 'dialog-feature.dragTitle', id: 'new %$type%' }, 
      {$: 'dialog-feature.nearLauncherLocation', offsetLeft: 0, offsetTop: 0 }
    ]
  }
})

jb.component('studio.onNextModifiedPath', {
	type: 'action',
	params: [
		{ id: 'action', type: 'action', dynamic: true, essential: true }
	],
	impl: (ctx,action) =>  
		modifyOperationsEm.take(1)
            .subscribe(e =>
            	action(ctx.setVars({ modifiedPath: e.args.modifiedPath }))
            )
})

jb.component('studio.openModifiedPath', {
	type: 'action',
	impl :{ $runActions: [
            { $: 'writeValue', to: '%$globals/profile_path%', value: '%$modifiedPath%' },
            {$: 'studio.open-properties'},
            {$: 'studio.open-control-tree'},
          ]}
})

jb.component('studio.openNewPage', {
  type: 'action', 
  impl :{$: 'openDialog', 
    modal: true, 
    title: 'New Page', 
    style :{$: 'dialog.md-dialog-ok-cancel', 
      features :{$: 'dialog-feature.autoFocusOnFirstInput' }
    }, 
    content :{$: 'group', 
      controls: [
        {$: 'editable-text', 
          databind: '%$dialogData/name%', 
          features :{$: 'feature.onEnter', 
            action :{$: 'closeContainingPopup' }
          }, 
          title: 'page name', 
          style :{$: 'editable-text.md-input' }
        }
      ], 
      features :{$: 'css.padding', top: '14', left: '11' }, 
      style :{$: 'group.div' }
    }, 
    onOK: function (ctx) {
        var id = ctx.exp('%$globals/project%.%$dialogData/name%');
        var profile = {
            type: 'control',
            impl: { $: 'group', title: ctx.exp('%$dialogData/name%') }
        };
        model.modify(model.newComp, id, { profile: profile }, ctx);
        ctx.run({ $: 'writeValue', to: '%$globals/page%', value: '%$dialogData/name%' });
        ctx.run({ $: 'writeValue', to: '%$globals/profile_path%', value: id });
    }
  }
})
