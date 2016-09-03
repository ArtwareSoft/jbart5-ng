import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import {Probe} from './studio-probe';
import {suggestions} from './studio-suggestions';
import {TgpModel} from './studio-tgp-model';

jb.component('suggestions-test', {
  type: 'test',
  params: [
    { id: 'expression', as: 'string' },
    { id: 'selectionStart', as: 'number', defaultValue: -1 },
    { id: 'expectedResult', type: 'boolean', dynamic: true, as: 'boolean' }
  ],
  impl :{$: 'data-test', 
    calculate: ctx => {
      var params = ctx.componentContext.params;
      var selectionStart = params.selectionStart == -1 ? params.expression.length : params.selectionStart;
      var obj = new suggestions({ value: params.expression, selectionStart: selectionStart })
        .extendWithOptions(ctx);
      return JSON.stringify(JSON.stringify(obj.options.map(x=>x.text)));
    },
    expectedResult :{$call: 'expectedResult' }
  },
})

jb.component('studio-tree-children-test', {
  type: 'test',
  params: [
    { id: 'path', as: 'string' },
    { id: 'childrenType', as: 'string', type: ',jb-editor' },
    { id: 'expectedResult', type: 'boolean', dynamic: true, as: 'boolean' }
  ],
  impl :{$: 'data-test', 
    calculate: ctx => {
      var params = ctx.componentContext.params;
      var mdl = new TgpModel('',params.childrenType);
      var titles = mdl.children(params.path)
        .map(path=>
          mdl.title(path,true));
      return JSON.stringify(titles);
    },
    expectedResult :{$call: 'expectedResult' }
  },
})


jb.component('jb-path-test', {
  type: 'test',
  params: [
    { id: 'controlWithMark', type: 'control', dynamic: true },
    { id: 'staticPath', as: 'string' },
    { id: 'expectedDynamicCounter', as: 'number' },
    { id: 'probeCheck', type: 'boolean', dynamic: true, as: 'boolean' }
  ],
  impl: (ctx,control,staticPath,expectedDynamicCounter,probeCheck)=> {
    var testId = ctx.vars.testID;

    var probProf = findProbeProfile(control.profile);
    if (!probProf)
      return;
     // ********** dynamic counter
    var static_path = testId + '~' + staticPath;
    var probeObs = new Probe(static_path, jb.ctx(ctx,{ profile: control.profile, comp: testId, path: '' } ),true).observable();
    var expectedDynamicCounterTst = probeObs.filter(res=>res.element)
        .map(res=>{
          try {
            var match = Array.from(res.element.querySelectorAll(`[jb-path="${static_path}"]`));
          } catch(e) {
            var match = [];
          }
          if (match.length ==  expectedDynamicCounter)
            return success('dynamic counter');
          else
            return failure('dynamic counter', 'jb-path error: ' + staticPath + ' found ' + match.length +' times. expecting ' + expectedDynamicCounter + ' occurrences');
      }).take(1);

    // ********** prob check
    var probeCheckTst = probeObs.filter(res=>res.finalResult)
        .map(res=>{
        if (res.finalResult[0] && probeCheck(res.finalResult[0].in) )
          return success('probe');
        else {
          return failure('probe');
        }
      }).take(1)

    return expectedDynamicCounterTst.merge(probeCheckTst);


    function failure(part,reason) { return { id: testId, title: testId + '- ' + part, success:false, reason: reason } };
    function success(part) { return { id: testId, title: testId + '- ' + part, success: true } };

    function findProbeProfile(parent) {
      if (parent.$mark)
        return parent;
      if (typeof parent == 'object')
        return jb.entries(parent)
        .map(e=>({
          prop: e[0],
          res: findProbeProfile(e[1])
        }))
        .map(e=>
          (e.res == 'markInString') ? ({$parent: parent, $prop: e.prop}) : e.res)
        .filter(x=>x)[0];

      if (typeof parent == 'string' && parent.indexOf('$mark:') == 0)
        return 'markInString';
    }
  }

})

