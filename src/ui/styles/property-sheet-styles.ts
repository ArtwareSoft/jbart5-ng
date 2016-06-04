import {jb} from 'jb-core';

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
    css: `.property { margin-bottom: %$vSpacing%px; display: flex }
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

jb.component('property-sheet.style-on-focus', {
  type: 'group.style',
  params: {
    vSpacing: { as: 'number', defaultValue: 20 },
    hSpacing: { as: 'number', defaultValue: 20 },
    titleWidth: { as: 'number', defaultValue: 100 },
  },
  impl :{$: 'customStyle', 
    features : {$: 'group.initGroup'},
    methods: {
        init: ctx => cmp => {
          cmp.getComp = ctrl =>
            ctrl.jb_focused && ctrl.jb_focusedComp ? ctrl.jb_focusedComp : ctrl.comp;

        },
        afterViewInit: ctx => cmp => {
          cmp.ctrls.forEach(ctrl => {
            if (ctrl.comp.jb_styleOnFocus) {
                  var cmp_prof = jb.extend({},ctrl.comp.jb_profile,{
                    style : ctrl.comp.jb_styleOnFocus
                  });
                  ctrl.jb_focusedComp = cmp.ctx.run(cmp_prof);
            }
          });
          jb.delay(1).then(() => {
            function handleFocus(e) {
                var property = $(e.target).parents().filter('.property');
                var index = property.index();
                // avoid infinite loop
                if (cmp.ctrls[index] && cmp.ctrls[index].jb_focused) return;

                // mark comp as focused and clean the sibling marking
                cmp.ctrls.forEach(ctrl=>ctrl.jb_focused = false);
                cmp.ctrls[index].jb_focused = true;
                // probably the input element will be replaced on next timer. rebind and refocus
                $(cmp.elementRef.nativeElement).find('input,select,textarea')
                    .unbind('focus',handleFocus);
                jb.delay(1).then(()=> {
                  $(cmp.elementRef.nativeElement).find('input,select,textarea')
                    .bind('focus',handleFocus);
                  property.find('input,select,textarea').focus(); // no infinite loop
                })
            };
            $(cmp.elementRef.nativeElement).find('input,select,textarea')
              .bind('focus',handleFocus);
          });
        }
    },
    template: `<div>
      <div *ngFor="let ctrl of ctrls" class="property">
        <label class="property-title">{{ctrl.title}}</label>
        <div class="input-and-toolbar">
          <jb_comp [comp]="getComp(ctrl)"></jb_comp>
          <jb_comp [comp]="ctrl.comp.jb_toolbar" class="toolbar"></jb_comp>
        </div>
      </div>
      </div>
    `,
    css: `.property { margin-bottom: %$vSpacing%px; display: flex; position: relative; height: 20px }
      .focused .input-and-toolbar { zoom: 150%; position: absolute; z-index: 500; transition: zoom 2s}
      .input-and-toolbar { display: flex;margin-right:0;  }
      .property:last-child { margin-bottom:0px }
      .property>.property-title {
        width: %$titleWidth%px;
        overflow:hidden;
        text-overflow:ellipsis;
        vertical-align:top;
        margin-top:2px;
        font-size:14px;
        margin-right: %$hSpacing%px;`
  }
})

jb.component('property-sheet.growing', {
  type: 'group.style',
  params: {
    vSpacing: { as: 'number', defaultValue: 20 },
    hSpacing: { as: 'number', defaultValue: 20 },
    titleWidth: { as: 'number', defaultValue: 100 },
  },
  impl :{$: 'customStyle', 
    features : {$: 'group.initGroup'},
    methods: {
        afterViewInit: ctx => cmp =>
          jb.delay(1).then(() =>
            $(cmp.elementRef.nativeElement).find('input,select,textarea')
              .focus(e=> {
                var property = $(e.target).parents().filter('.property');
                property.siblings().each((i,el)=>$(el).removeClass('focused'));
                property.addClass('focused');
              })
          )
    },
    template: `<div>
      <div *ngFor="let ctrl of ctrls" class="property">
        <label class="property-title">{{ctrl.title}}</label>
        <div class="input-and-toolbar">
          <jb_comp [comp]="ctrl.comp"></jb_comp>
          <jb_comp [comp]="ctrl.comp.jb_toolbar" class="toolbar"></jb_comp>
        </div>
      </div>
      </div>
    `,
    css: `.property { margin-bottom: %$vSpacing%px; display: flex; position: relative; height: 20px }
      .focused .input-and-toolbar { zoom: 150%; position: absolute; z-index: 500; transition: zoom 2s}
      .input-and-toolbar { display: flex;margin-right:0;  }
      .property:last-child { margin-bottom:0px }
      .property>.property-title {
        width: %$titleWidth%px;
        overflow:hidden;
        text-overflow:ellipsis;
        vertical-align:top;
        margin-top:2px;
        font-size:14px;
        margin-right: %$hSpacing%px;`
  }
})
