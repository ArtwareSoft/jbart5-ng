import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('group.md-expandable2', {
  type: 'group.style',
  params: {},
  impl: function(context) { return {
    init: function(cmp) {
      cmp.initGroup();
      cmp.open = true;
      cmp.toggle = () => {cmp.show = !cmp.show }
    },
    jbTemplate: `<section class="jb-group">
          <md-toolbar class="md-primary">
            <div class="md-toolbar-tools">
              <button md-button class="md-icon-button" aria-label="Open" (click)="toggle()">
                <i md-icon>code</i>
              </button>
              <h3>{{title}}</h3>
              <span flex></span>
            </div>
          </md-toolbar>
          <jb_comp [hidden]="show" *ngFor="let ctrl of ctrls" [comp]="ctrl.comp"></jb_comp>
      </section>`
  } }
})


jb.component('group.md-expandable', {
  type: 'group.style',
  impl :{$: 'customStyle', 
      template: `<section class="jb-group">
          <md-toolbar class="md-primary">
            <div class="md-toolbar-tools">
              <button md-button class="md-icon-button" aria-label="Open" (click)="toggle()">
                <i md-icon>code</i>
              </button>
              <h3>{{title}}</h3>
              <span flex></span>
            </div>
          </md-toolbar>
          <jb_comp [hidden]="show" *ngFor="let ctrl of ctrls" [comp]="ctrl.comp"></jb_comp>
      </section>`,
      features :{$: 'group.initGroup' },
      methods: {
        init: ctx => cmp => {
          cmp.open = true;
          cmp.toggle = function() {cmp.show = !cmp.show }
        }
      }
  }
})

jb.component('group.div', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div class="jb-group">
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </div>`,
    features :{$: 'group.initGroup'}
  }
})

jb.component('layout.vertical', {
  type: 'group.style',
  params: {
    spacing: { as: 'number', defaultValue: 3 }
  },
  impl :{$: 'customStyle',
    template: `<div class="jb-group">
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </div>`,
      css: `.group-item { margin-bottom: %$spacing%px; display: block }
        .group-item:last-child { margin-bottom:0 }`,
    features :{$: 'group.initGroup'}
  }
})

jb.component('layout.horizontal', {
  type: 'group.style',
  params: {
    spacing: { as: 'number', defaultValue: 3 }
  },
  impl :{$: 'customStyle',
    template: `<div class="jb-group">
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </div>`,
    css: `{display: flex}
        .group-item { margin-right: %$spacing%px }
        .group-item:last-child { margin-right:0 }`,
    features :{$: 'group.initGroup'}
  }
})


jb.component('property-sheet.titles-above', {
  type: 'group.style',
  params: {
    spacing: { as: 'number', defaultValue: 20 }
  },
  impl :{$: 'customStyle', 
    features :{$: 'group.initGroup'},
    template: `<div>
      <div *ngFor="let ctrl of ctrls" class="property">
        <label class="property-title">{{ctrl.title}}</label>
        <jb_comp [comp]="ctrl.comp"></jb_comp>
      </div>
      </div>
    `,
    css: `.property { margin-bottom: %$spacing%px }
      .property:last-child { margin-bottom:0 }
      .property>.property-title {
        width:100px;
        overflow:hidden;
        text-overflow:ellipsis;
        vertical-align:top;
        margin-top:2px;
        font-size:14px;
      }
      .property>div { display:inline-block }`
  }
})

jb.component('property-sheet.titles-above-float-left', {
  type: 'group.style',
  params: {
    spacing: { as: 'number', defaultValue: 20 },
    fieldWidth: { as: 'number', defaultValue: 200 },
  },
  impl :{$: 'customStyle', 
    features :{$: 'group.initGroup'},
    template: `<div>
        <div *ngFor="let ctrl of ctrls" class="property">
          <label class="property-title">{{ctrl.title}}</label>
          <jb_comp [comp]="ctrl.comp"></jb_comp>
        </div>
        <div class="clearfix"></div>
      </div>
    `,
    css: `.property { 
          float: left;
          width: %$fieldWidth%px;
          margin-right: %$spacing}%px 
        }
      .clearfix { clear: both }
      .property:last-child { margin-right:0 }
      .property>.property-title {
        margin-bottom: 3px;
        overflow:hidden;
        text-overflow:ellipsis;
        vertical-align:top;
        font-size:14px;
      }`,
  }
})

jb.component('property-sheet.titles-left', {
  type: 'group.style',
  params: {
    vSpacing: { as: 'number', defaultValue: 20 },
    hSpacing: { as: 'number', defaultValue: 20 },
    titleWidth: { as: 'number', defaultValue: 100 },
  },
  impl :{$: 'customStyle', 
    features :{$: 'group.initGroup'},
    template: `<div>
      <div *ngFor="let ctrl of ctrls" class="property">
        <label class="property-title">{{ctrl.title}}</label>
        <jb_comp [comp]="ctrl.comp" class="property-ctrl"></jb_comp>
      </div>
    </div>`,
    styles: `.property { margin-bottom: %$vSpacing%px; display: flex }
      .property:last-child { margin-bottom:0px }
      .property>.property-title {
        width: %$titleWidth%px;
        overflow:hidden;
        text-overflow:ellipsis;
        vertical-align:top;
        margin-top:2px;
        font-size:14px;
        margin-right: %$hSpacing%px;
      }
      .property>*:last-child { margin-right:0 }`
  }
})

// Seems that ng.md is not too flexible and dynamic.
// Needs to build the template with the input fields before loading the comp.
jb.component('property-sheet.md', {
  type: 'group.style',
  impl: function(context) { 
    var comps = (context.vars.$model.controls.profile||[]).map(prof=>context.run(prof));
    return {
      init: function(cmp) {
        comps.forEach(comp=>{
         comp.prototype.ngOnInit.call(cmp);
        })
      },
      template: comps.map(comp=>{
        if (!Reflect.getMetadata('annotations', comp))
          debugger;
        var annotations = Reflect.getMetadata('annotations', comp)[0];
        var title = comp.jb_title ? jb.val(comp.jb_title(context)) : '';
        return `<md-input-container class="md-block" flex-gt-sm>
                  <label>${title}</label>
                  ${annotations.template}
                </md-input-container>
                `
        }).join('')
  }}
})

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

