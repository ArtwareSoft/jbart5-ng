import {jb} from 'jb-core';
import * as studio from './studio-model';
import * as jb_rx from 'jb-ui/jb-rx';

export class Probe {
  constructor(public pathToTrace, public context, public depth) {
    this.probe = {};
    this.circuit = this.context.profile;
  }

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
  //     var compName = studio.model.compName(path);
  //     var ctx = _win.jb_ctx(context, { profile: context.profile[prop], path: prop});
  //     var propCtx = _win.jb_prepare(ctx).ctx;
  //     this.probe[path] = [{in: propCtx }];
  //     jb.entries(bridge[compName])
  //       .map(p=>path+'~'+p[0])
  //       .forEach(inner_path=> {
  //           this.probe[inner_path] = [{in: propCtx }]
  //         })
  // }
  setTrace() {
    this.clearTrace();
    var profile = studio.profileFromPath(this.pathToTrace);
    if (jb.compName(profile))
      profile.$jbProbe = true;
    else if (typeof profile == 'string') {
      var profileRef = studio.profileRefFromPath(this.pathToTrace);
      jb.writeValue(profileRef,`$jbProbe:${profile}`)
    }
  }
  clearTrace() {
    var profile = studio.profileFromPath(this.pathToTrace);
    if (jb.compName(profile))
      delete profile.$jbProbe;
    else if (typeof profile == 'string' && profile.indexOf('$jbProbe:') == 0) {
      var profileRef = studio.profileRefFromPath(this.pathToTrace);
      jb.writeValue(profileRef,profile.substr(7))
    }
  }
  runCircuitNoGaps() {
    var _win = jbart.previewWindow || window;
    if (studio.model.isCompNameOfType(jb.compName(this.circuit),'control')) { // running circuit in a group to get the 'ready' event
      return testControl(this.context, this.em);
    } else if (! studio.model.isCompNameOfType(jb.compName(this.circuit),'action')) {
      return Promise.resolve(_win.jb_run(this.context));
    }
  }
  observable() {
    this.em = new jb_rx.Subject();
    var _jbart = studio.jbart_base();
    _jbart.probe = this;
    this.probe[this.pathToTrace] = [];
    this.setTrace();
    this.runCircuitNoGaps().then(()=>{
        _jbart.probe = null;
        this.clearTrace();
        this.em.next({finalResult: this.probe[this.pathToTrace]});
        this.em.complete();
    })
    return this.em;
      // return this.runCircuitNoGaps().then(()=>{
      //   if (this.probe[this.pathToTrace].length > 0) {
      //     _jbart.probe = null;
      //     return this.probe[this.pathToTrace];
      //   } else {
      //     return this.rerunCircuit();
      //   }
      // })
  }
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
  record(context,parentParam) {
      var input = context.ctx({});
      input.noprobe = true;
      var out = input.runItself(parentParam);
      this.probe[this.pathToTrace].push({in: input, out: jb_val(out)});
      return out;
  }
  // bridge(path,inCtx) {
  //   var compName = studio.model.compName(studio.parentPath(path));
  //   var prop = path.split('~').pop();
  //   if (!bridge[compName] || !bridge[compName][prop])
  //     return;
  //   if (bridge[compName][prop] == 'default')
  //     return jb.ctx(ctx,{ profile: profile[prop], path: prop })
  //   return bridge[compName][prop](path,inCtx);
  // }
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

jb.component('studio.probe', {
  type:'data',
  params: { path: { as: 'string', dynamic: true } },
  impl: (ctx,path) => {
      var _jbart = studio.jbart_base();
      var _win = jbart.previewWindow || window;
      var circuit = ctx.exp('%$circuit%') || ctx.exp('%$globals/project%.%$globals/page%');
      var context = _win.jb_ctx(_jbart.initialCtx,{ profile: {$: circuit}, comp: circuit, path: '', data: '', fullPath: circuit} );
      return new Probe(path(),context).observable().toPromise();
    }
})


function testControl(ctx,emitter) {
  // test the control as a dialog
  return new Promise((resolve,reject)=> {
    var _jbart = studio.jbart_base();
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
            emitter.next({ element : cmp.elementRef.nativeElement })
            jb.delay(1).then(()=>dialog.close()); // delay to avoid race conditin with itself
            resolve();
            console.log('close test dialog');
          })
          ,

        css: '{display: none}'  
      })
    }
    console.log('add test dialog');

    _win.jbart.jb_dialogs.addDialog(dialog,ctx);
    _win.setTimeout(()=>{},1); // refresh
  })
}
