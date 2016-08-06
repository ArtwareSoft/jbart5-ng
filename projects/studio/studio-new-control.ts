import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jb.component('studio.openNewCtrlDialog', {
  type: 'action', 
  impl :{$: 'openDialog', 
    modal: true, 
    title: 'New Control', 
    style :{$: 'dialog.md-dialog-ok-cancel', 
      features: [
        {$: 'dialogFeature.autoFocusOnFirstInput' }, 
        {$: 'dialogFeature.maxZIndexOnClick', minZIndex: 5000 },
        {$: 'dialogFeature.nearLauncherLocation' }
      ]
    }, 
    content :{$: 'picklist', 
      databind: '%$dialogData/comp%', 
      options :{$: 'studio.tgp-type-options', type: 'control' }, 
      features :{$: 'field.subscribe', 
        action :{$: 'closeContainingPopup' }
      }
    }, 
    onOK: { $runActions: [
      {$: 'studio.onNextModifiedPath', 
      	action :{$: 'studio.openModifiedPath' }
  	  },
      {$: 'studio.insertComp', 
        path :{$: 'studio.currentProfilePath' }, 
        comp: '%$dialogData/comp%'
      }
    ]}
  }
})

jb.component('studio.onNextModifiedPath', {
	type: 'action',
	params: {
		action: { type: 'action', dynamic: true, essential: true }
	},
	impl: (ctx,action) =>  
		studio.modifyOperationsEm.take(1)
            .subscribe(e =>
            	action(ctx.setVars({ modifiedPath: e.args.modifiedPath }))
            )
})

jb.component('studio.openModifiedPath', {
	type: 'action',
	impl :{ $runActions: [
            { $: 'writeValue', to: '%$globals/profile_path%', value: '%$modifiedPath%' }
          ]}
})

jb.component('studio.openNewPage', {
  type: 'action', 
  impl :{$: 'openDialog', 
    modal: true, 
    title: 'New Page', 
    style :{$: 'dialog.md-dialog-ok-cancel', 
      features :{$: 'dialogFeature.autoFocusOnFirstInput' }
    }, 
    content :{$: 'group', 
      controls: [
        {$: 'editable-text', 
          databind: '%$dialogData/name%', 
          features :{$: 'onEnter', 
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
                        studio.model.modify(studio.model.newComp, id, { profile: profile }, ctx);
                        ctx.run({ $: 'writeValue', to: '%$globals/page%', value: '%$dialogData/name%' });
                        ctx.run({ $: 'writeValue', to: '%$globals/profile_path%', value: id });
                    }
  }
})
