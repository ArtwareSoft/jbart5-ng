import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('pulldown.menu-item-separator', {
	type: 'control',
	impl: ctx => 
		jb_ui.Comp({ template: '<div class="pulldown-menu-separator"></div>'},ctx)
})

jb.component('pulldown.MenuItem', {
	type: 'control',
	params: {
		title: { as: 'string', dynamic: true, essential: true },
		icon: { as: 'string' },
		shortcut: { as: 'string' },
		action: { type: 'action', dynamic: true },
	    style: { type: 'pulldown-menu-item.style', defaultValue: { $: 'pulldown-menu-item.default' }, dynamic: true },
		features: { type: 'feature[]', dynamic: true },
		$click: { type: 'boolean'},
	},
	  impl: function(context,title,icon,shortcut) {
	    if (context.params.$click) try { context.params.action() } catch (e) { jb.logException(e) } // for test debug
	    return jb_ui.ctrl(context).jbExtend({
	      beforeInit: function(cmp) {
	        cmp.title = title();
	        cmp.icon = icon;
	        cmp.shortcut = shortcut;
	        cmp.clicked = jb_ui.wrapWithLauchingElement(() => {
	        	context.vars.$dialog && context.vars.$dialog.close(); // close dialog
	        	context.params.action();
	        } , context, cmp.elementRef);
	      }
	    })
	  }
	// impl :{$: 'button',
	// 	title: '%$title%',
	// 	style :{$: 'pulldown_button.menuButton', icon: '{%$icon%}' },
	// 	action: [
	// 	  { $: 'closeContainingPopup' },
	// 	  { $call: 'action' }
	// 	],
	// 	features :{$call: 'features' },
	// 	$click : '%$$click%'
	// }
})

jb.component('pulldown-menu-item.default', {
  type: 'button.style',
  params: {
	  icon: { as: 'string' }
  },
  impl :{$: 'customStyle',
  	template: `<div><div class="line" (click)="clicked()">
  		<i class="material-icons">{{icon}}</i><span class="title">{{title}}</span><span class="shortcut">{{shortcut}}</span>
  		</div></div>`,
	css: `.line { display: flex; user-select: none; width1: 100%; cursor: pointer; background: #fff; font: 13px Arial; height: 24px}
		  i { width: 24px; padding-left: 3px; padding-top: 3px; font-size:16px; }
		  span { padding-top: 3px}
          .title { display: block; text-align: left; } 
		  .shortcut { margin-left: auto; text-align: right; padding-right: 15px }
		  .line:hover { background: #eee; }
		`
	}
})
// 		  button span { width: 16px; height: 16px; display: block; position: absolute; top: 5px; left: 6px;}

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
				popupWidth: ctx.vars.$launchingElement.$el.outerWidth()
			}).run({
				$: 'openDialog', 
				style :{$: 'pulldownPopup.mainMenuPopup' }, 
				content :{$: 'group', controls: (ctx) => context.params.controls(ctx) }
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
	impl :{$: 'customStyle',
			template: '<div class="jb-dialog jb-popup pulldown-mainmenu-popup"><div class="dialog-content" #content></div><div class="pulldown-menu-remove-top-border"></div></div>', 
			css: '.pulldown-menu-remove-top-border { width: %$popupWidth%px }',
			features: [
					{ $: 'dialogFeature.uniqueDialog', id: 'pulldown main menu popup', remeberLastLocation: false },
					{ $: 'dialogFeature.maxZIndexOnClick' },
					{ $: 'dialogFeature.closeWhenClickingOutside' },
					{ $: 'dialogFeature.cssClassOnLaunchingControl' },
					{ $: 'dialogFeature.nearLauncherLocation' }
			]
	}
})

jb.component('pulldownPopup.contextMenuPopup',{
	type: 'dialog.style',
	impl: function(context) {
		return {
			jbTemplate: '<div><div class="dialog-content" #Content></div></div>',
			cssClass: 'jb-dialog jb-popup pulldown-mainmenu-popup',
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
