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
            title: 'New Project', 
            icon: 'new', 
            shortcut: '', 
            action :{$: 'studio.save-components' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Open Project ...', 
            action :{$: 'studio.open-project' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Save', 
            icon: 'save', 
            shortcut: 'Ctrl+S', 
            action :{$: 'studio.save-components' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Force Save', 
            icon: 'save', 
            action :{$: 'studio.save-components', force: true }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Source ...', 
            action :{$: 'studio.open-source-dialog' }
          }
        ]
      }, 
      {$: 'pulldown.topMenuItem', 
        title: 'View', 
        controls: [
          {$: 'pulldown.menu-item', 
            spritePosition: '10,0', 
            title: 'Refresh Preview', 
            action :{$: 'studio.refresh-preview' }
          }, 
          {$: 'pulldown.menu-item', 
            spritePosition: '10,0', 
            title: 'Redraw Studio', 
            action :{$: 'studio.redraw-studio' }
          }, 
          {$: 'pulldown.menu-item', 
            spritePosition: '3,0', 
            title: 'Edit source', 
            action :{$: 'studio.editSource' }
          }, 
          {$: 'pulldown.menu-item', 
            spritePosition: '5,0', 
            title: 'Outline', 
            action :{$: 'studio.open-control-tree' }
          }, 
          {$: 'pulldown.menu-item', 
            spritePosition: '6,0', 
            title: 'jbEditor', 
            action :{$: 'studio.openjbEditor' }
          }
        ]
      }, 
      {$: 'pulldown.topMenuItem', 
        title: 'Insert', 
        controls: [
          {$: 'pulldown.menu-item', title: 'Field' }, 
          {$: 'pulldown.menu-item', title: 'Control' }, 
          {$: 'pulldown.menu-item', title: 'Group' }, 
          {$: 'pulldown.menu-item-group', title: 'input' }
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
      }, 
      {$: 'pulldown.topMenuItem', 
        title: 'Tests', 
        controls: [
          {$: 'dynamic-controls', 
            controlItems: function (ctx) {
                                        var res = jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'tests']);
                                        return Object.getOwnPropertyNames(res)
                                            .filter(function (x) { return x != 'window'; });
                                    }, 
            genericControl :{$: 'pulldown.menu-item', 
              title: '%$controlItem%', 
              action :{$: 'studio.run-test', 
                resource: function (ctx) {
                                                return jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'tests', ctx.exp('%$controlItem%')]);
                                            }, 
                id: '%$controlItem%'
              }
            }
          }, 
          {$: 'pulldown.menu-item-separator' }, 
          {$: 'pulldown.menu-item', 
            title: 'Add Test...', 
            action :{$: 'studio.add-test' }
          }, 
          {$: 'pulldown.menu-item', 
            title: 'Run All Tests...', 
            action :{$: 'studio.run-all-tests' }
          }
        ]
      }
    ], 
    features :{$: 'css.margin', top: '5' }
  }
})



