import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';
import * as jb_rx from 'jb-ui/jb-rx';

class Probe {
  constructor(public pathToTrace, public context, public depth) {
    this.probe = {};
    this.circuit = this.context.profile;
  }

  traceGaps(context,parentParam) {
    if (context.path.indexOf('data-tests') == 0)
      console.log('running at',context.path, 'looking for ' + this.pathToTrace);
    if (typeof context.profile == 'object' && jb.compName(context.profile))
      jb.entries(context.profile)
        .filter(p=>
          p[0].indexOf('on') == 0 || p[0].indexOf('action') == 0)
        .forEach(p => 
          this.doTraceGaps(p[0],context))
  }
  doTraceGaps(prop,context) { // for action paths
      var _win = jbart.previewWindow || window;
      var path = context.path + '~' + prop;
      var compName = studio.model.compName(path);
      var ctx = _win.jb_ctx(context, { profile: context.profile[prop], path: prop});
      var propCtx = _win.jb_prepare(ctx).ctx;
      this.probe[path] = [{in: propCtx }];
      jb.entries(bridge[compName])
        .map(p=>path+'~'+p[0])
        .forEach(inner_path=> {
            this.probe[inner_path] = [{in: propCtx }]
          })
  }
  runCircuitNoGaps() {
    var _win = jbart.previewWindow || window;
    if (studio.model.isCompNameOfType(jb.compName(this.circuit),'control')) // running circuit in a group to get the 'ready' event
      return testControl(this.context);
    else if (! studio.model.isCompNameOfType(jb.compName(this.circuit),'action'))
      return Promise.resolve(_win.jb_run(this.context));
  }
  runCircuitWithGaps() {
    var _jbart = studio.jbart_base();
      _jbart.probe = this;
      this.probe[this.pathToTrace] = [];
      return this.runCircuitNoGaps().then(()=>{
        if (this.probe[this.pathToTrace].length > 0) {
          _jbart.probe = null;
          return this.probe[this.pathToTrace];
        } else {
          return this.rerunCircuit();
        }
      })
  }
  rerunCircuit() {
    var path_parts = this.pathToTrace.split('~');
    var sub_paths = path_parts.map((e,i)=>
      path_parts.slice(0,i+1).join('~')).reverse();
    var gapToRun = sub_paths
      .filter(p=>
        this.probe[p] && this.probe[p].length)
      .map(p=>
        this.bridge(p,this.probe[p][0].in))
      .filter(x=>x)
      [0];
    if (gapToRun)
      return new Probe(this.pathToTrace,gapToRun,(this.depth||0)+1).runCircuitWithGaps();
  }
  record(context,parentParam) {
      var input = new jbCtx(context,{});
      var out = jb_run(context,parentParam,{ noprobe: true })
      this.probe[context.path].push({in: input, out: jb_val(out)});
      return out;
  }
  bridge(path,inCtx) {
    var compName = studio.model.compName(studio.parentPath(path));
    var prop = path.split('~').pop();
    if (!bridge[compName] || !bridge[compName][prop])
      return;
    if (bridge[compName][prop] == 'default')
      return jb.ctx(ctx,{ profile: profile[prop], path: prop })
    return bridge[compName][prop](path,inCtx);
  }
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
      var context = _win.jb_ctx(_jbart.initialCtx,{ profile: {$: circuit}, comp: circuit, path: '', data: ''} );
      return new Probe(path(),context).runCircuitWithGaps();
    }
})


function testControl(ctx) {
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
              dialog.close();resolve()
          })
          .subscribe(x=>{
            dialog.close();resolve()
            console.log('close dialog');
          }),

        css: '{display: none}'  
      })
    }
    console.log('add dialog');

    _win.jbart.jb_dialogs.addDialog(dialog,ctx);
    _win.setTimeout(()=>{},1); // refresh
  })
}
