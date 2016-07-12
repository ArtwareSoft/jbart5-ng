import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';
import * as jb_rx from 'jb-ui/jb-rx';

jb.component('studio.probe', {
  type:'data',
  params: { path: { as: 'string', dynamic: true } },
  impl: (ctx,path) => {
      var _path = path();
      if (!_path) 
        return [];
      var _jbart = studio.jbart_base();
      var _win = (jbart.previewWindow || window);
      _jbart.probe = _jbart.probe || {};
      _jbart.probe[_path] = [];
      _jbart.probe.trace = _path;
//     _jbart.trace_paths = true;
      var circuit = ctx.exp('%$circuit%') || ctx.exp('%$globals/project%.%$globals/page%');
      var context = _win.jb_ctx(_jbart.initialCtx,{ profile: {$: circuit}, comp: circuit, path: '', data: ''} );

      return runCircuit(context,circuit).then(() => {
        if (_jbart.probe[_path].length == 0)
          _jbart.probe[_path].push({in: context });
        return _jbart.probe[_path];
      });
    }
})

function runCircuit(context,circuit) {
  if (studio.model.isOfType(circuit,'control')) // running circuit in a group to get the 'ready' event
    return testControl(circuit,context);
  else // not a control
    return Promise.resolve(_win.jb_run(context));
}

function testControl(compName,ctx) {
  return new Promise((resolve,reject)=> {
      ctx.run( {$:'openDialog', 
        content :{$: compName }, 
        features: ctx2 => ({
          observable: cmp_obs =>
            cmp_obs.filter(x=>
              x == 'ready')
            .take(1)
            .catch(e=> 
              resolve())
            .subscribe(x=>{
              resolve();
              ctx2.run({$:'closeContainingPopup'})
            }),
          css: '{display: none}'
      })
    })
  })
}
