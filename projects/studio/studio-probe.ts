import {jb} from 'jb-core';
import * as jb_rx from 'jb-ui/jb-rx';

import {model} from './studio-tgp-model';
import {jbart_base} from './studio-utils';
import {parentPath} from './studio-path';


export class Probe {
  constructor(public context, public depth, public forTests) {
    this.probe = {};
    context.probe = this;
    this.circuit = this.context.profile;
  }

  runCircuit(pathToTrace) {
    this.pathToTrace = pathToTrace;
    this.probe[this.pathToTrace] = [];
    this.probe[this.pathToTrace].visits = 0;

    return this.simpleRun().then( res =>
          this.handleGaps().then( res2 =>
            jb.extend({finalResult: this.probe[this.pathToTrace]},res,res2)
    ))
  }

  simpleRun() {
      var _win = jbart.previewWindow || window;
      if (model.isCompNameOfType(jb.compName(this.circuit),'control')) { // running circuit in a group to get the 'ready' event
        return testControl(this.context, this.forTests);
      } else if (! model.isCompNameOfType(jb.compName(this.circuit),'action')) {
        return Promise.resolve(_win.jb_run(this.context));
      }
  }

  handleGaps() {
    if (this.probe[this.pathToTrace].length == 0) {
      // find closest path
      var _path = parentPath(this.pathToTrace);
      while (!this.probe[_path] && _path.indexOf('~') != -1)
        _path = parentPath(_path);
      if (this.probe[_path])
        this.probe[this.pathToTrace] = this.probe[_path];
    }
    return Promise.resolve();
  }

  record(context,parentParam) {
      var path = context.path;
      var input = context.ctx({});
      var out = input.runItself(parentParam,{noprobe: true});

      if (!this.probe[path]) {
        this.probe[path] = [];
        this.probe[path].visits = 0;
      }
      this.probe[path].visits++;
      var found;
      this.probe[path].forEach(x=>{
        found = jb_compareArrays(x.in.data,input.data) ? x : found;
      })
      if (found)
        found.counter++;
      else 
        this.probe[path].push({in: input, out: jb_val(out), counter: 0});
      return out;
  }
}

jb.component('studio.probe', {
  type:'data',
  params: [ { id: 'path', as: 'string', dynamic: true } ],
  impl: (ctx,path) => {
      var context = ctx.exp('%$globals/last_pick_selection%');
      if (!context) {
        var _jbart = jbart_base();
        var _win = jbart.previewWindow || window;
        var circuit = ctx.exp('%$circuit%') || ctx.exp('%$globals/project%.%$globals/page%');
        context = _win.jb_ctx(_jbart.initialCtx,{ profile: {$: circuit}, comp: circuit, path: '', data: null} );
      }
      return new Probe(context).runCircuit(path());
    }
})

// function initJbEditorProbe() {
//   var _jbart = jbart_base();
//   if (!_jbart.studioJbEditorProbe) {
//     var _win = jbart.previewWindow || window;
//     var circuit = ctx.exp('%$circuit%') || ctx.exp('%$globals/project%.%$globals/page%');
//     var context = _win.jb_ctx(_jbart.initialCtx,{ profile: {$: circuit}, comp: circuit, path: '', data: null} );
//     _jbart.studioJbEditorProbe = new Probe(context);
//   }
//   return _jbart.studioJbEditorProbe;
// }


// jb.component('studio.probe-set-path-to-trace', {
//   type:'action',
//   params: [ 
//     { id: 'pathToTrace', as: 'string', dynamic: true } 
//     { id: 'result', as: 'ref' } 
//   ],
//   impl: (ctx,pathToTrace) => {
//     var probe = initJbEditorProbe();
//     probe.pathToTrace = pathToTrace;
//   }

// })

function testControl(ctx,forTests) {
  // test the control as a dialog
  return new Promise((resolve,reject)=> {
    var _jbart = jbart_base();
    var _win = jbart.previewWindow || window;
    var dialog = { 
      id: 'test-control', 
      em: new jb_rx.Subject(),
      comp: _win.jb_run(ctx).jbExtend({
        observable: (cmp_obs,cmp) =>
          cmp_obs.filter(e=>
            e == 'ready')
          .take(1)
          .catch(e=> {
              debugger;
              dialog.close();resolve()
          })
          .subscribe(x=>{
            if (!forTests)
              jb.delay(1).then(()=>dialog.close()); // delay to avoid race conditin with itself
            resolve({ element : cmp.elementRef.nativeElement });
//            console.log('close test dialog');
          })
          ,

        css: '{display: none}'  
      })
    }
//    console.log('add test dialog');

    _win.jbart.jb_dialogs.addDialog(dialog,ctx);
    _win.setTimeout(()=>{},1); // refresh
  })
}

var bridge = {
  openDialog: {
    content: (path,inCtx) => {
      return jb.ctx(inCtx, { 
        profile: inCtx.profile.content, 
        path: 'content', 
        vars: { dialogData: {} }
      })
    }
  },
  writeValue: {
    to: 'default',
    value: 'default',
  }
}

  // bridge(path,inCtx) {
  //   var compName = model.compName(studio.parentPath(path));
  //   var prop = path.split('~').pop();
  //   if (!bridge[compName] || !bridge[compName][prop])
  //     return;
  //   if (bridge[compName][prop] == 'default')
  //     return jb.ctx(ctx,{ profile: profile[prop], path: prop })
  //   return bridge[compName][prop](path,inCtx);
  // }

      // return this.runCircuit().then(()=>{
      //   if (this.probe[this.pathToTrace].length > 0) {
      //     _jbart.probe = null;
      //     return this.probe[this.pathToTrace];
      //   } else {
      //     return this.rerunCircuit();
      //   }
      // })
  // rerunCircuit() {
  //   var path_parts = this.pathToTrace.split('~');
  //   var sub_paths = path_parts.map((e,i)=>
  //     path_parts.slice(0,i+1).join('~')).reverse();
  //   var gapToRun = sub_paths
  //     .filter(p=>
  //       this.probe[p] && this.probe[p].length)
  //     .map(p=>
  //       this.bridge(p,this.probe[p][0].in))
  //     .filter(x=>x)
  //     [0];
  //   if (gapToRun)
  //     return new Probe(this.pathToTrace,gapToRun,(this.depth||0)+1).run();
  // }

  // traceGaps(context,parentParam) {
  //   if (context.path.indexOf('data-tests') == 0)
  //     console.log('running at',context.path, 'looking for ' + this.pathToTrace);
  //   if (typeof context.profile == 'object' && jb.compName(context.profile))
  //     jb.entries(context.profile)
  //       .filter(p=>
  //         p[0].indexOf('on') == 0 || p[0].indexOf('action') == 0)
  //       .forEach(p => 
  //         this.doTraceGaps(p[0],context))
  // }
  // doTraceGaps(prop,context) { // for action paths
  //     var _win = jbart.previewWindow || window;
  //     var path = context.path + '~' + prop;
  //     var compName = model.compName(path);
  //     var ctx = _win.jb_ctx(context, { profile: context.profile[prop], path: prop});
  //     var propCtx = _win.jb_prepare(ctx).ctx;
  //     this.probe[path] = [{in: propCtx }];
  //     jb.entries(bridge[compName])
  //       .map(p=>path+'~'+p[0])
  //       .forEach(inner_path=> {
  //           this.probe[inner_path] = [{in: propCtx }]
  //         })
  // }
  // setTrace() {
  //   this.clearTrace();
  //   var profile = studio.profileFromPath(this.pathToTrace);
  //   if (jb.compName(profile))
  //     profile.$jbProbe = true;
  //   else if (typeof profile == 'string') {
  //     var profileRef = studio.profileRefFromPath(this.pathToTrace);
  //     jb.writeValue(profileRef,`$jbProbe:${profile}`)
  //   }
  // }
  // clearTrace() {
  //   var profile = studio.profileFromPath(this.pathToTrace);
  //   if (jb.compName(profile))
  //     delete profile.$jbProbe;
  //   else if (typeof profile == 'string' && profile.indexOf('$jbProbe:') == 0) {
  //     var profileRef = studio.profileRefFromPath(this.pathToTrace);
  //     jb.writeValue(profileRef,profile.substr(7))
  //   }
  // }