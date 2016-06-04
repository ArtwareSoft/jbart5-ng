import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('group.div', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div class="jb-group">
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </div>`,
    features :{$: 'group.initGroup'}
  }
})


// Seems that ng.md is not too flexible and dynamic.
// Needs to build the template with the input fields before loading the comp.
// jb.component('property-sheet.md', {
//   type: 'group.style',
//   impl: function(context) { 
//     var comps = (context.vars.$model.controls.profile||[]).map(prof=>context.run(prof));
//     return {
//       init: function(cmp) {
//         comps.forEach(comp=>{
//          comp.prototype.ngOnInit.call(cmp);
//         })
//       },
//       template: comps.map(comp=>{
//         if (!Reflect.getMetadata('annotations', comp))
//           debugger;
//         var annotations = Reflect.getMetadata('annotations', comp)[0];
//         var title = comp.jb_title ? jb.val(comp.jb_title(context)) : '';
//         return `<md-input-container class="md-block" flex-gt-sm>
//                   <label>${title}</label>
//                   ${annotations.template}
//                 </md-input-container>
//                 `
//         }).join('')
//   }}
// })

jb.component('group-expandable-subgroups', {
  type: 'group.section_style',
  params: {
    icon: { as: 'string ', defaultValue: 'code' }
  },
  impl :{$: 'customStyle', 
      features :{$: 'group.initGroup' },
      methods: {
        init: ctx => cmp => {
          cmp.selected = cmp.ctrls[0];
          cmp.select = function(ctrl) {
            cmp.selected = ctrl;
          }
        }
    },
    template: `<section class="jb-group">
        <section *ngFor="let ctrl of ctrls" class="md-whiteframe-z3" [ngClass]="{'open': selected==ctrl}">
          <md-toolbar class="md-primary">
            <div class="md-toolbar-tools">
              <h3>{{ ctrl.title }}</h3>
              <span flex></span>
              <button md-button
                      class="md-icon-button"
                      aria-label="Open"
                      (click)="select(ctrl)">
                <i md-icon>%$icon%</i>
              </button>
            </div>
          </md-toolbar>
          <jb_comp *ngIf="selected==ctrl" [comp]="ctrl.comp"></jb_comp>
      </section></section>`,
  }
})

jb.component('toolbar.simple', {
  type: 'group.style',
  impl :{$: 'customStyle', 
    features :{$: 'group.initGroup' },
    template: `<div class="toolbar">
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true"></jb_comp>
      </div>`,
    css: `.toolbar { 
            display: flex;
            background: #F5F5F5; 
            height: 33px; 
            width: 100%;
            border-bottom: 1px solid #D9D9D9; 
            border-top: 1px solid #fff;
        }
        * { margin-right: 0 }`
  }
})

