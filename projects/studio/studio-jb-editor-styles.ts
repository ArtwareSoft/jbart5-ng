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
        { $: 'studio.fix-suggestions-margin' } ,
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

jb.component('studio.fix-suggestions-margin', {
  type: 'dialogFeature',
  impl: ctx => {
    var input = ctx.exp('%$jbEditInput%');
    var position = input.selectionStart;
    var temp = $('<span></span>').css('font',$(input).css('font')).css('width','100%')
      .css('z-index','-1000').text($(input).val()).appendTo('body');
    var offset = temp.width();
    temp.remove();
    return {
      css: `{ margin-left: ${offset}px }`
    }
  }
})
