jb.component('group.div', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div *ngFor="let ctrl of ctrls"><div *jbComp="ctrl"></div></div>`,
    features :{$: 'group.init-group'}
  }
})

jb.component('group.ul-li', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<ul class="jb-itemlist">
      <li *ngFor="let ctrl of ctrls" class="jb-item" [class.heading]="ctrl.comp.ctx.data.heading" #jbItem>
        <div *jbComp="ctrl.comp"></div>
      </li>
      </ul>`,
    css: 'ul, li { list-style: none; padding: 0; margin: 0;}'
  },
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
      <template [ngIf]="show">
        <div *ngFor="let ctrl of ctrls"><div *jbComp="ctrl"></div></div>
      </template>
</section>`, 
      css: `.header { display: flex; flex-direction: row; }
        button:hover { background: none }
        button { margin-left: auto }
        i { color: #}
        .title { margin: 5px }`, 
      features :[ 
        {$: 'group.init-group' },
        {$: 'group.init-expandable' },
      ]
    }, 
})

jb.component('group.init-expandable', {
  type: 'feature', category: 'group:0',
  impl: ctx => ({
        init: cmp => {
            cmp.show = true;
            cmp.expand_title = () => cmp.show ? 'collapse' : 'expand';
            cmp.toggle = function () { cmp.show = !cmp.show; };
        },
  })
})

jb.component('group.accordion', {
  type: 'group.style',
  impl :{$: 'customStyle', 
      template: `<section class="jb-group">
      <div *ngFor="let ctrl of ctrls" class="accordion-section">
        <div class="header">
          <div class="title">{{ctrl.title}}</div>
          <button md-icon-button md-button (click)="toggle(ctrl)" title="{{expand_title(ctrl)}}">
                <i *ngIf="ctrl.show" class="material-icons">keyboard_arrow_down</i>
                <i *ngIf="!ctrl.show" class="material-icons">keyboard_arrow_right</i>
          </button>
        </div>
      <template [ngIf]="ctrl.show">
        <div *jbComp="ctrl.comp"></div>
      </template>
      </div>
  </section>`, 
      css: `.header { display: flex; flex-direction: row; }
        button:hover { background: none }
        button { margin-left: auto }
        i { color: #}
        .title { margin: 5px }`, 
      features : [ 
        {$: 'group.init-group' },
        {$: 'group.init-accordion' },
      ]
    }, 
})

jb.component('group.init-accordion', {
  type: 'feature', category: 'group:0',
  impl: ctx => ({
    init: cmp => {
      cmp.expand_title = ctrl => 
        ctrl.show ? 'collapse' : 'expand';
      cmp.toggle = newCtrl => 
        cmp.ctrls.forEach(ctrl=>
          ctrl.show = ctrl == newCtrl ? !ctrl.show : false)
    },
    afterViewInit: cmp => {
      if (cmp.ctrls && cmp.ctrls[0])
         cmp.ctrls[0].show = true;
    },
  })
})

jb.component('toolbar.simple', {
  type: 'group.style',
  impl :{$: 'customStyle', 
    features :{$: 'group.init-group' },
    template: `<div class="toolbar">
        <div *ngComps="ctrls"></div>
      </div>`,
    css: `{ 
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

