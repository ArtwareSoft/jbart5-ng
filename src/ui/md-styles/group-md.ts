import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {MdButton} from '@angular2-material/button/button.js';

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
      },
      directives: [MdButton]
  }
})
