import {jb} from 'jb-core';

jb.component('dialog.studio-jb-editor-popup', {
  type: 'dialog.style',
  impl: {$: 'customStyle',
      template: `<div class="jb-dialog jb-popup">
              <button class="dialog-close" (click)="dialogClose()">&#215;</button>
              <jb_comp [comp]="contentComp" class="dialog-content"></jb_comp>
            </div>`, 
      css: `{ background: #fff; position: absolute }
        .dialog-close {
            position: absolute; 
            cursor: pointer; 
            right: -7px; top: -22px; 
            font: 21px sans-serif; 
            border: none; 
            background: transparent; 
            color: #000; 
            text-shadow: 0 1px 0 #fff; 
            font-weight: 700; 
            opacity: .2;
        }
        .dialog-close:hover { opacity: .5 }
        `,
      features: [
        { $: 'dialogFeature.maxZIndexOnClick' },
        { $: 'dialogFeature.closeWhenClickingOutside' },
        { $: 'dialogFeature.cssClassOnLaunchingControl' },
        { $: 'dialogFeature.nearLauncherLocation' },
        { $: 'dialogFeature.uniqueDialog', id: 'studio-jb-editor-popup' },
        {$: 'css.box-shadow', 
          blurRadius: 5, 
          spreadRadius: 0, 
          shadowColor: '#000000', 
          opacity: 0.75, 
          horizontal: 0, 
          vertical: 0, 
        }
   ]
  }
})

jb.component('dialog.studio-suggestions-popup',{
  type: 'dialog.style',
  impl: {$: 'customStyle',
      template: `<div class="jb-dialog jb-popup">
              <jb_comp [comp]="contentComp" class="dialog-content"></jb_comp>
            </div>`, 
      css: `{ background: #fff; position: absolute; padding: 3px 5px }`,
      features: [
        { $: 'dialogFeature.maxZIndexOnClick' },
        { $: 'dialogFeature.closeWhenClickingOutside' },
        { $: 'dialogFeature.cssClassOnLaunchingControl' },
        { $: 'dialogFeature.nearLauncherLocation' },
//        { $: 'studio.fix-suggestions-margin' } ,
        { $: 'dialogFeature.uniqueDialog', id: 'studio-suggestions-popup' },
        { $: 'css.box-shadow', 
          blurRadius: 5, 
          spreadRadius: 0, 
          shadowColor: '#000000', 
          opacity: 0.75, 
          horizontal: 0, 
          vertical: 0, 
        }
   ]
  }
})

// jb.component('studio.fix-suggestions-margin', {
//   type: 'dialogFeature',
//   impl: ctx => {
//     var e = ctx.exp('%$jbEditEvent%');
//     var temp = $('<span></span>').css('font',$(e.input).css('font')).css('width','100%')
//       .css('z-index','-1000').text($(e.input).val().substr(0,e.pos)).appendTo('body');
//     var offset = temp.width();
//     temp.remove();
//     return {
//       css: `{ margin-left: ${offset}px }`
//     }
//   }
// })

// jb.component('editable-text.studio-jb-edit-input',{
//   type: 'editable-text.style',
//   impl :{$: 'customStyle', 
//    features :{$: 'editable-text.bindField' },
//    template: `<span><md-input [(ngModel)] = "jbModel" placeholder=""></md-input></span>`,
//       css: 'md-input { width: 220px }',
//       directives: 'MdInput'
//   }
// })
