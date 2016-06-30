import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('studio.main-menu', {
  type: 'control', 
  impl :{$: 'group', 
    style :{$: 'layout.horizontal', spacing: 3 }, 
    controls: [
      {$: 'pulldown.topMenuItem', 
        title: 'File', 
        controls: [
          {$: 'pulldown.menu-item', 
            title: 'Open Project ...', 
            action :{$: 'studio.open-project' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Save', 
            icon: 'save', 
            action :{$: 'studio.saveComponents' }, 
            shortcut: 'Ctrl+S'
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Force Save', 
            icon: 'save', 
            action :{$: 'studio.saveComponents', force: true }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Source ...', 
            action :{$: 'studio.openSourceDialog' }
          }
        ]
      }, 
      {$: 'pulldown.topMenuItem', 
        title: 'View', 
        controls: [
          {$: 'pulldown.menu-item', 
            title: 'Refresh', 
            spritePosition: '10,0', 
            action :{$: 'studio.refreshPreview' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Edit source', 
            spritePosition: '3,0', 
            action :{$: 'studio.editSource' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Outline', 
            spritePosition: '5,0', 
            action :{$: 'studio.open-control-tree' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'jbEditor', 
            spritePosition: '6,0', 
            action :{$: 'studio.openjbEditor' }
          }
        ]
      }, 
      {$: 'pulldown.topMenuItem', 
        title: 'Insert', 
        controls: [
          {$: 'pulldown.menu-item', 
            title: 'Field', 
            action :{$: 'studio.refreshPreview' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Control', 
            action :{$: 'studio.editSource' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Group', 
            action :{$: 'studio.open-control-tree' }
          }
        ]
      }, 
      {$: 'pulldown.topMenuItem', 
        title: 'Data', 
        controls: [
          {$: 'dynamic-controls', 
            controlItems: function (ctx) {
                                        var res = jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'resources']);
                                        return Object.getOwnPropertyNames(res)
                                            .filter(function (x) { return x != 'window'; });
                                    }, 
            genericControl :{$: 'pulldown.menu-item', 
              title: '%$controlItem%', 
              action :{$: 'studio.open-resource', 
                resource: function (ctx) {
                                                return jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'resources', ctx.exp('%$controlItem%')]);
                                            }, 
                id: '%$controlItem%'
              }
            }
          }, 
          {$: 'pulldown.menu-item-separator' }, 
          {$: 'pulldown.menu-item', 
            title: 'Add Data Resource...', 
            action :{$: 'studio.addDataResource' }
          }
        ]
      }
    ]
  }
})



