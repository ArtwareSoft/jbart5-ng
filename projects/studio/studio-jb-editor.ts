import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import * as studio from './studio-model';

jb.component('studio.jb-editor', {
  type: 'control', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'group', 
    title: 'main', 
    controls: [
      {$: 'tree', 
        cssClass: 'jb-control-tree studio-control-tree', 
        nodeModel :{$: 'studio.jb-editor.nodes', path: '%$path%' }, 
        features: [
          {$: 'tree.selection', 
            autoSelectFirst: true, 
            databind: '%$globals/jb_editor_selection%'
          }, 
          {$: 'tree.keyboard-selection', 
            onEnter :{$: 'studio.openProperties' }
          }, 
          {$: 'tree.drag-and-drop' }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl-C', 
            action :{$: 'studio.copy', path: '%%' }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl-V', 
            action :{$: 'studio.paste', path: '%%' }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl-Z', 
            action :{$: 'studio.undo', path: '%%' }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl-Y', 
            action :{$: 'studio.redo', path: '%%' }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Delete', 
            action :{$: 'studio.delete', path: '%%' }
          }, 
          {$: 'studio.control-tree.refreshPathChanges' }, 
          {$: 'css.width', width: '500' }
        ]
      }, 
      {$: 'group', 
        title: 'input-output', 
        features :{$: 'group.data', data: '%$globals/jb_editor_selection%' }, 
        controls :{$: 'group', 
          features :{$: 'group.wait', 
            for :{$: 'studio.probe', path: '%$globals/jb_editor_selection%' }
          }, 
          title: 'wait for probe', 
          controls :{$: 'itemlist', 
            items: '%%', 
            controls: [
              {$: 'studio.data-browse', data: '%data[0]/in/data%', title: 'in' }, 
              {$: 'studio.data-browse', data: '%data[0]/out%', title: 'out' }
            ]
          }
        }
      }
    ], 
    style :{$: 'layout.horizontal', spacing: 3 }
  }
})

jb.component('studio.data-browse', {
  type: 'control',
  params: { 
    data: { },
    title: { as: 'string'}
  },
  impl :{$: 'group', 
    title: '%$title%',
    controls :{$: 'tree', cssClass: 'jb-control-tree', 
        nodeModel :{$: 'tree.json-read-only', 
          object: '%$data%', rootPath: '%$title%' 
        },
        features: [
            { $: 'tree.selection' },
            { $: 'tree.keyboard-selection'} 
        ] 
     },
    }
 })

function runCircuit(path,ctx) {
  var circuit = ctx.exp('%$circuit%') || 'studio.refreshPreview';
  jb_run(new jbCtx(ctx, {profile: {$: circuit}, comp: circuit, path: '', data: ''}));
}

studio.modifyOperationsEm.subscribe(e=>{
  var jbart = studio.jbart_base();
  if (jbart.probe)
    jbart.probe.sample = {};
})

jb.component('studio.probe', {
  type:'data',
  params: { path: { as: 'string', dynamic: true } },
  impl: (ctx,path) => {
      var _path = path();
      if (!_path) return;
      var jbart = studio.jbart_base();
      jbart.probe = jbart.probe || { sample: {} };
      if (jbart.probe.sample[_path])
        return Promise.resolve(jbart.probe.sample[_path]);

      jbart.probe.sample[_path] = [];
      jbart.probe.trace = _path;
//      jbart.trace_paths = true;
      runCircuit(_path,ctx);
      return jb.delay(1).then(()=> {
        jbart.probe.trace = '';
        return jbart.probe.sample[_path];
      })
    }
})

jb.component('studio.jb-editor.nodes', {
	type: 'tree.nodeModel',
	params: { path: { as: 'string'} },
	impl: function(context,path) {
		return new studio.ControlModel(path,'jb-editor');
	}
})
