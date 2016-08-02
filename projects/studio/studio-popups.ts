import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jb.component('studio.open-multiline-edit', {
	type: 'action',
	params: {
	    path: { as: 'string' }
	}, 
	impl: {
		$: 'openDialog',
		style :{$: 'dialog.studio-multiline-edit' },
		content :{$: 'editable-text', 
			databind :{$: 'studio.ref', path: '%$path%' },
			style :{$: 'editable-text.codemirror', 
				mode :{$: 'studio.code-mirror-mode', path: '%$path%'} 
			},
			features: {$: 'studio.undo-support', path: '%$path%' },
		}
	}
})

jb.component('dialog.studio-floating', {
	type: 'dialog.style',
	params: {
		id: { as: 'string' },
		width: { as: 'number', default: 300},
		height: { as: 'number', default: 100},
	},
	impl :{$: 'customStyle',
			$vars: { dialogID: '%$id%' },
			template: `<div class="jb-dialog jb-default-dialog">
				      		  <div class="dialog-title noselect">{{title}}</div>
				      		  <jb_comp *ngIf="hasMenu" class="dialog-menu" [comp]="menuComp"></jb_comp>
							  <button class="dialog-close" (click)="dialogClose()">&#215;</button>
							  <div class="jb-dialog-content-parent">
 								<jb_comp [comp]="contentComp" class="dialog-content"></jb_comp>
						  	  </div>
						</div>`,
			features: [
					{$: 'dialogFeature.dragTitle', id: '%$dialogID%'}, 
					{$: 'dialogFeature.uniqueDialog', id: '%$dialogID%', remeberLastLocation: true },
					{$: 'dialogFeature.maxZIndexOnClick', minZIndex: 5000 },
					{$: 'studio-dialogFeature.studioPopupLocation' },
			],
			css: `{ position: fixed;
						background: #F9F9F9; 
						width: %$width%px; 
						max-width: 800px;
						min-height: %$height%px; 
						overflow: auto;
						border-radius: 4px; 
						padding: 0 12px 12px 12px; 
						box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12)
				}
				.dialog-title { background: none; padding: 10px 5px; }
				.jb-dialog-content-parent { padding: 8px; overflow-y: auto; max-height: 500px }
				.dialog-close {
						position: absolute; 
						cursor: pointer; 
						right: 4px; top: 4px; 
						font: 21px sans-serif; 
						border: none; 
						background: transparent; 
						color: #000; 
						text-shadow: 0 1px 0 #fff; 
						font-weight: 700; 
						opacity: .2;
				}
				.dialog-menu {
						position: absolute; 
						cursor: pointer; 
						right: 24px; top: 0; 
						font: 21px sans-serif; 
						border: none; 
						background: transparent; 
						color: #000; 
						text-shadow: 0 1px 0 #fff; 
						font-weight: 700; 
						opacity: .2;
				}
				.dialog-close:hover { opacity: .5 }`
	}
})

jb.component('studio-dialogFeature.studioPopupLocation',{
	type: 'dialogFeature',
	impl: function(context) {
		var dialog = context.vars.$dialog;

		jb.bind(dialog,'attach',function() {
			if (sessionStorage[dialog.id]) return;
			if (dialog.id == 'studio properties')
				dialog.$el.css('top','100px').css('left',(window.outerWidth-320)+'px');
				//dialog.$el.css('top','110px').css('right','600px').css('left','600px');
			if (dialog.id == 'studio control tree')
				//dialog.$el.css('top','0px').css('right','306px').css('left','initial');
				dialog.$el.css('top','100px').css('left',(window.outerWidth-320-310)+'px');
			if (dialog.id == 'studio main window')
				dialog.$el.css('top','0px').css('right','0px').css('left','initial');
			if (dialog.id == 'studio templates')
				dialog.$el.css('top','73px').css('right','0px').css('left','initial');
			if (dialog.id == 'studio template code')
				dialog.$el.css('bottom','0px').css('left','0px').css('top','initial');
			if (dialog.id == 'code-mirror')
				dialog.$el.css('top','0px').css('left','0px');
			dialog.$el.addClass('default-location');
		});
	}
})

jb.component('studio.code-mirror-mode',{
	params: { path: { as: 'string' }},
	impl: function(ctx,path) {
		if (path.match(/css/))
			return 'css';
		if (path.match(/template/) || path.match(/html/))
			return 'htmlmixed';
		return 'javascript'
	}
})

jb.component('studio.open-responsive-phone-popup', {
  type: 'action', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-floating', id: 'responsive' }, 
    content :{$: 'tabs', 
      tabs :{$: 'dynamic-controls', 
        controlItems: [
          {
            width: { min: 320, max: 479, default: 400 }, 
            height: { min: 300, max: 700, default: 600 }, 
            id: 'phone'
          }, 
          {
            width: { min: 480, max: 1024, default: 600 }, 
            height: { min: 300, max: 1440, default: 850 }, 
            id: 'tablet'
          }, 
          {
            width: { min: 1024, max: 2048, default: 1280 }, 
            height: { min: 300, max: 1440, default: 520 }, // avoid scroll by default 
            id: 'desktop'
          }
        ], 
        genericControl :{$: 'group', 
          controls: [
            {$: 'editable-number', 
              databind: '%$globals/responsive/{%$controlItem/id%}/width%', 
              min: '%$controlItem/width/min%', 
              max: '%$controlItem/width/max%', 
              style :{$: 'editable-number.slider' }, 
              title: 'width', 
              features: [
                {$: 'field.default', value: '%$controlItem/width/default%' }, 
                {$: 'field.subscribe', 
                  action :{$: 'studio.setPreviewSize', width: '%%' }, 
                  includeFirst: true
                }
              ]
            }, 
            {$: 'editable-number', 
              databind: '%$globals/responsive/{%$controlItem/id%}/height%', 
              min: '%$controlItem/height/min%', 
              max: '%$controlItem/height/max%', 
              style :{$: 'editable-number.slider' }, 
              title: 'height', 
              features: [
                {$: 'field.default', value: '%$controlItem/height/default%' }, 
                {$: 'field.subscribe', 
                  action :{$: 'studio.setPreviewSize', height: '%%' }, 
                  includeFirst: true
                }
              ]
            }
          ], 
          style :{$: 'property-sheet.titles-above' }, 
          title: '%$controlItem/id%', 
          features: [{$: 'css', css: '{ padding-left: 12px; padding-top: 7px }' }]
        }
      }, 
      style :{$: 'tabs.md-tabs' }
    }, 
    title: 'responsive'
  }
})
