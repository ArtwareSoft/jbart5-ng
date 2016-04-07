import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('pulldown.MenuItemSeparator', {
	type: 'control',
	impl: ctx => jb_ui.Comp({ template: '<div class="pulldown-menu-separator"></div>'},ctx)
})

jb.component('pulldown.MenuItem', {
	type: 'control',
	params: {
		title: {},
		spritePosition: { as: 'string' },
		action: { type: 'action', dynamic: true },
		features: { type: 'feature[]', dynamic: true },
		$click: { type: 'boolean'},
	},
	impl :{$: 'button',
		title: '%$title%',
		style :{$: 'pulldown_button.menuButton', spritePosition: '{%$spritePosition%}' },
		action: [
		  { $: 'closeContainingPopup' },
		  { $call: 'action' }
		],
		features :{$call: 'features' },
		$click : '%$$click%'
	}
})

jb.component('pulldown_button.menuButton', {
  type: 'button.style',
  params: {
	  spritePosition: { as: 'string' }
  },
  impl :{$: 'customStyle',
  	template: '<span><button (click)="clicked()">{{title}}<span></span></button></span>',
	css: `button { -webkit-user-select: none;  padding: 6px 10px 6px 29px; font-size: 13px; display: block; background: #fff;  border: none; width: 100%; text-align: left; cursor: pointer;   position: relative;} 
		  button:hover { background: #eee; }
		  button:focus { outline: none; }
		  button span { width: 16px; height: 16px; display: block; position: absolute; top: 5px; left: 6px;}
`
	}
})

jb.component('pulldown.topMenuItem', {
	type: 'control',
	params: {
		title: { dynamic: true, as: 'string' },
		style: { type: 'pulldownTopMenuItem.style', dynamic: true, defaultValue: { $: 'pulldownTopMenuItem.default' } },
		controls: { type: 'control[]', dynamic: true, flattenArray: true },
		open: { type: 'boolean'},
	},
	impl: function(context) { 
		var openPopup = function(ctx,cmp) {
			return ctx.setVars({
				popupWidth: ctx.vars.$launchingElement.$el.outerWidth() - 2
			}).run({
				$: 'openDialog', 
				style: { $: 'pulldownPopup.mainMenuPopup' }, 
//				cssClass: 'jb-popup',
				content: { $: 'group', controls: (ctx) => context.params.controls(ctx) }
			})
		}

		return jb_ui.ctrl(context).jbExtend({
			init: function(cmp) {
				cmp.mouseEnter = function() {
					if ($('.pulldown-mainmenu-popup')[0]) 
						cmp.openPopup();
				}
				cmp.title = context.params.title();
				cmp.openPopup = jb_ui.wrapWithLauchingElement(openPopup, context, cmp._nativeElement || cmp.elementRef); 

				if (context.params.open)
					cmp.openPopup();
			}
		},context)
	}
})

jb.type('pulldownTopMenuItem.style');

jb.component('pulldownTopMenuItem.default',{
	type: 'pulldownTopMenuItem.style',
	impl :{$: 'customStyle',
			template: '<button class="pulldown-top-menu-item" (mouseEnter)="mouseEnter()" (click)="openPopup()">{{title}}</button>',
	}
})

jb.component('pulldownPopup.mainMenuPopup',{
	type: 'dialog.style',
	impl: function(context) {
		return {
			jbTemplate: '<div><div class="dialog-content" #content></div><div class="pulldown-menu-remove-top-border"></div></div>', 
			cssClass: 'jb-dialog pulldown-mainmenu-popup',
			styles: ['.pulldown-menu-remove-top-border { width: {%$popupWidth%}px }'],
			features: [
					{ $: 'dialogFeature.uniqueDialog', id: 'pulldown main menu popup', remeberLastLocation: false },
					{ $: 'dialogFeature.maxZIndexOnClick' },
					{ $: 'dialogFeature.closeWhenClickingOutside' },
					{ $: 'dialogFeature.cssClassOnLaunchingControl' },
					{ $: 'dialogFeature.nearLauncherLocation' }
			]
		}
	}
})

jb.component('pulldownPopup.contextMenuPopup',{
	type: 'dialog.style',
	impl: function(context) {
		return {
			jbTemplate: '<div><div class="dialog-content" #Content></div></div>',
			cssClass: 'jb-dialog pulldown-contextmenu-popup',
			features: [
				{ $: 'dialogFeature.uniqueDialog', id: 'pulldown context menu popup', remeberLastLocation: false },
				{ $: 'dialogFeature.maxZIndexOnClick' },
				{ $: 'dialogFeature.closeWhenClickingOutside' },
				{ $: 'dialogFeature.cssClassOnLaunchingControl' },
				{ $: 'dialogFeature.nearLauncherLocation' }
			]
		}
	}
})
