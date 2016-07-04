import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';
import * as jb_rx from 'jb-ui/jb-rx';

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


// jb.component('studio.showProbeData', {
//   type: 'action',
//   impl: {
//     $: 'openDialog',
//       title: 'probe - %$globals/profile_path%',
//       style :{$: 'dialog.studio-floating', id: 'probe', width: 600 },
//       features :{$: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}'},
//       content :{$: 'group', 
//         $vars: { selected : {$: 'object' } },
//         controls:
//           [
//             {$: 'itemlog', 
//               title: 'input',
//               items :{$: 'studio.start-probe', path :{$: 'studio.currentProfilePath' } },
//               controls :{$: 'studio.context-view' },
//               features :{$: 'itemlog.selection', databind: '%$selected/ctx%'},
//             },
//             {$: 'group', 
//               features :{$: 'group.watch', data: '%$selected/ctx%'},
//               controls :{$: 'studio.output-view', path :{$: 'studio.currentProfilePath' }, ctx: '%$selected/ctx%' }
//             }
//           ]
//       }
//     }
// })

// jb.component('studio.context-view', {
//   type: 'control',
//   impl :{$: 'label', title :{$: 'studio.contextToString'} }
// })

// jb.component('studio.output-view', {
//   type: 'control',
//   params: {
//     path: { as: 'string' },
//     ctx: { as: 'single' },
//   },
//   impl: function(context,path,ctx) {
//     var res = ctx.run(studio.profileValFromPath(path));
//     var ctrl = 'single';

//     if (res.jb_title)
//       ctrl = 'comp';
//     else if (Array.isArray(res))
//       ctrl = 'array';

//     return context.setVars({toShow: res}).run({ $: 'studio.output-' + ctrl });
//   }
// })

// jb.component('studio.output-comp', {
//   type: 'control',
//   params: {
//     toShow: { as: 'single' },
//   },
//   impl :{$: 'label', title :{$: 'studio.compToString' , toShow: '%$toShow%'} }
// })


// jb.component('studio.contextToString', {
//   type: 'data',
//   impl: function(context) {
//     return jb_toarray(context.data.data || context.data.vars)
//       .map(val =>(typeof val == 'object') ? JSON.stringify(val,null,' ') : val)
//       .join('\n');
//   }
// });

// jb.component('studio.compToString', {
//   type: 'data',
//   impl: function(context) {
//     var comp = context.vars.toShow;
//     var annotations = Reflect.getMetadata('annotations', comp)[0];
//     return [
//       comp.jb$title, 
//       annotations.template, 
//       JSON.stringify(jb.extend({},annotations.host))
//     ].join('\n');
//   }
// });