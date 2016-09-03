import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import {Probe} from './studio-probe';
import {suggestions} from './studio-suggestions';
import {TgpModel} from './studio-tgp-model';

jb.component('suggestions-test', {
  type: 'test',
  params: {
    expression: { as: 'string' },
    selectionStart: { as: 'number', defaultValue: -1 },
    expectedResult: { type: 'boolean', dynamic: true, as: 'boolean' }
  },
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
  params: {
    path: { as: 'string' },
    childrenType: { as: 'string', type: ',jb-editor' },
    expectedResult: { type: 'boolean', dynamic: true, as: 'boolean' }
  },
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
  params: {
    controlWithMark: { type: 'control', dynamic: true },
    staticPath: { as: 'string' },
    expectedDynamicCounter: { as: 'number' },
    probeCheck: { type: 'boolean', dynamic: true, as: 'boolean' }
  },
  impl: (ctx,control,staticPath,expectedDynamicCounter,probeCheck)=> {
    var testId = ctx.vars.testID;

    // ********** static path
    var probProf = findProbeProfile(control.profile);
    if (!probProf)
      return;
    // var static_path = jb_ui.profilePath(probProf.$parent ? probProf.$parent : probProf);
    // if (probProf.$parent)
    //   static_path += '~' + probProf.$prop;
    // var static_path = static_path.replace('~controlWithMark','');
    // var staticPathTst = (static_path.split('controlWithMark~')[1] == staticPath) ? jb_rx.Observable.of(success('static path')) :
    //   jb_rx.Observable.of(failure('static path','static paths match error: ' + staticPathTst + ' expected ' + staticPath ));

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


// jb.component('studio-test', {
//   params: {
//     project : { as: 'string', defaultValue: 'hello-world'},
//     page : { as: 'string', defaultValue: 'group1'},
//     profile_path: { as: 'string', defaultValue: 'hello-world.group1'},
//     control: { type: 'control', dynamic: true },
//     expectedHtmlResult: { type: 'boolean', dynamic: true, as: 'boolean' },
//   },
//   impl :{$: 'ng2-ui-test', 
//     control :{$: 'group',
//       features :
//         [ 
//           { $: 'feature.init', action:
//             [
//               { $: 'writeValue', to: '%$globals/project%', value: '%$project%' },
//               { $: 'writeValue', to: '%$globals/page%', value: '%$page%' },
//               { $: 'writeValue', to: '%$globals/profile_path%', value: '%$profile_path%' },
//             ]
//           },
//           { $: 'feature.emitter', varName: 'studioTestEm' }
//         ],
//       controls: [
//         { $: 'studio.renderWidget' },
//         { $: 'group', 
//             controls :{$: 'group',
//                 features :{$: 'feature.afterLoad', action :{$: 'rx.emit', from: 'ready', to: '%$studioTestEm%' }},
//                 controls :{$call: 'control' } 
//             },
//             features :{$: 'group.wait', for :{$: 'studio.waitForPreviewIframe' }}
//         }
//       ]
//     },
//     expectedHtmlResult: { $call: 'expectedHtmlResult' }
//   }
// })

// jb.component('run-studio-test', {
//   params: { 
//     project : { as: 'string', defaultValue: 'hello-world'},
//     page : { as: 'string', defaultValue: 'group1'},
//     profile_path: { as: 'string', defaultValue: 'hello-world.group1'},
//     control : { dynamic: true },
//   },
//   impl :{$: 'group',
//     features :{$: 'feature.init', action: [
//       { $: 'writeValue', to: '%$globals/project%', value: '%$project%' },
//       { $: 'writeValue', to: '%$globals/page%', value: '%$page%' },
//       { $: 'writeValue', to: '%$globals/profile_path%', value: '%$profile_path%' },
//     ] },
//     controls: [
//       { $: 'studio.renderWidget' },
//       { $: 'group', controls: { $call: 'control' }, 
//           atts: {style: 'margin-left: 100px'},
//           features : [
//             { $: 'group.wait', for :{$: 'studio.waitForPreviewIframe' }},
//           ]
//         }
//     ]
//   }
// })

// 