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
        {$: 'dialogFeature.nearLauncherLocation' }
      ]
    }, 
    content :{$: 'picklist', 
      databind: '%$dialogData/comp%', 
      options :{$: 'studio.tgp-type-options', type: 'control' }, 
      features :{$: 'field.onChange', 
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
    content :{$: 'editable-text', 
      databind: '%$dialogData/name%',
      features :{$: 'onEnter', action :{$: 'closeContainingPopup'} }
    }, 
    onOK: ctx => {
        var id = ctx.exp('%$globals/project%.%$dialogData/name%'); 
        jbart.previewjbart.comps[id] = jbart.previewjbart.comps[id] || {
          type: 'control', 
          impl :{$: 'group', title: ctx.exp('%$dialogData/name%') }
        };
        ctx.run({ $: 'writeValue', to: '%$globals/page%', value: '%$dialogData/name%' });
        ctx.run({ $: 'writeValue', to: '%$globals/profile_path%', value: id });
    }
  }
})
