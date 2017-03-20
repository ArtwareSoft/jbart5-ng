import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('studio.pickAndOpen', {
	type: 'action',
	params: [
		{ id: 'from', options: 'studio,preview', as: 'string', defaultValue: 'preview'}
	],
	impl :{$: 'studio.pick',
		from: '%$from%',
	  	onSelect: [
      {$: 'writeValue', to: '%$globals/last_pick_selection%', value: '%%' },
      {$: 'writeValue', to: '%$globals/profile_path%', value: '%path%' },
			{$: 'studio.open-control-tree'},
      {$: 'studio.open-properties'},
 		],
	} 
})

jb.component('studio.toolbar', {
  type: 'control', 
  impl :{$: 'group', 
    style :{$: 'studio-toolbar' }, 
    controls: [
      {$: 'label', 
        title: '', 
        features :{$: 'css', css: '{ width: 170px }' }
      }, 
      {$: 'button', 
        title: 'Select', 
        action :{$: 'studio.pickAndOpen' }, 
        style :{$: 'button.mdl-icon', 
          features :{$: 'css', css: '{transform: scaleX(-1)}' }, 
          icon: 'call_made'
        }
      }, 
      {$: 'button', 
        title: 'Save', 
        action :{$: 'studio.save-components' }, 
        style :{$: 'button.mdl-icon', icon: 'save' }
      }, 
      {$: 'button', 
        title: 'Refresh Preview', 
        action :{$: 'studio.refresh-preview' }, 
        style :{$: 'button.mdl-icon', icon: 'refresh' }
      }, 
      {$: 'button', 
        title: 'Javascript', 
        action :{$: 'studio.editSource' }, 
        style :{$: 'button.mdl-icon', icon: 'code' }
      }, 
      {$: 'button', 
        title: 'Outline', 
        action :{$: 'studio.open-control-tree' }, 
        style :{$: 'button.mdl-icon', icon: 'format_align_left' }
      }, 
      {$: 'button', 
        title: 'Properties', 
        action :{$: 'studio.open-properties', focus: 'true' }, 
        style :{$: 'button.mdl-icon', icon: 'storage' }
      }, 
      {$: 'button', 
        title: 'jbEditor', 
        action :{$: 'studio.open-jb-editor', path: '%$globals/profile_path%' }, 
        style :{$: 'button.mdl-icon', icon: 'build' }
      }, 
      {$: 'button', 
        title: 'show data', 
        action :{$: 'studio.showProbeData' }, 
        style :{$: 'button.mdl-icon', icon: 'input' }
      }, 
      {$: 'button', 
        title: 'insert control', 
        action :{$: 'studio.open-new-profile-dialog', type: 'control', insertControl: 'true' }, 
        style :{$: 'button.mdl-icon', icon: 'add' }
      }, 
      {$: 'button', 
        title: 'responsive-phone', 
        action :{$: 'studio.open-responsive-phone-popup' }, 
        style :{$: 'button.mdl-icon', icon: 'tablet_android' }
      }
    ], 
    features: [
      {$: 'feature.keyboard-shortcut', 
        key: 'Alt+C', 
        action :{$: 'studio.pickAndOpen' }
      }, 
      {$: 'feature.keyboard-shortcut', 
        key: 'Alt+R', 
        action :{$: 'studio.redraw' }
      }, 
      {$: 'feature.keyboard-shortcut', 
        key: 'Alt+N', 
        action :{$: 'studio.pickAndOpen', from: 'studio' }
      }
    ]
  }
})

jb.component('studio_button.toolbarButton', {
	type: 'button.style',
	params: [
		{ id: 'spritePosition', as: 'string', defaultValue: '0,0' }
	],
	impl: function(context, spritePosition) {
		return {
			template: '<button class="studio-btn-toolbar" (click)="clicked()"><span style="background-position: {{pos}}" title="{{title}}"></span></button>',
			init: function(cmp) {
				cmp.pos = spritePosition.split(',').map(item => (-parseInt(item) * 16) + 'px').join(' ');
			}
		}
	}
})

//            position: absolute; top: 60px; height: 33px; left: 0px;right:0; 

jb.component('studio-toolbar', {
  type: 'group.style',
  impl :{$: 'customStyle', 
    features :{$: 'group.init-group' },
    template: '<section><div *ngFor="let ctrl of ctrls"><div *jbComp="ctrl"></div></div></section>',
    css: `section { 
            display: flex;
            height: 33px; 
            width: 100%;
        }
        section>*:not(:last-child) { padding-right: 8px }
        section>* { margin-right: 0 }`
  }
})


