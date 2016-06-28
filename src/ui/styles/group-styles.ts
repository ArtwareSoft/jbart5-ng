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

jb.component('group.expandable', {
  type: 'group.style',
  impl :{$: 'customStyle', 
      template: `<section class="jb-group">
       <div class="header">
        <div class="title">{{title}}</div>
        <button md-icon-button md-button (click)="toggle()" title="{{expand_title()}}">
        <i *ngIf="show" class="material-icons">keyboard_arrow_down</i>
        <i *ngIf="!show" class="material-icons">keyboard_arrow_right</i>
        </button>
      </div>
      <div *ngIf="show">
          <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp"></jb_comp>
      </div>
</section>`, 
      methods: {
        init: function (ctx) {
            return function (cmp) {
                cmp.show = true;
                cmp.expand_title = () => cmp.show ? 'collapse' : 'expand';
                cmp.toggle = function () { cmp.show = !cmp.show; };
            };
        }
      }, 
      css: `.header { display: flex; flex-direction: row; }
        button:hover { background: none }
        button { margin-left: auto }
        .title { margin: 5px }`, 
      features :{$: 'group.initGroup' }
    }, 
})


jb.component('group.expandable-subgroups', {
  type: 'group.style',
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

