jb.component('pulldown.menu-item-separator', {
	type: 'control', 
	impl: ctx => 
		jb_ui.Comp({ template: '<div></div>', css: '{ margin: 6px 0; border-bottom: 1px solid #EBEBEB}'},ctx)
})

jb.component('pulldown.menu-item-group', {
	type: 'control',
	params: [
		{ id: 'title', as: 'string', dynamic: true, essential: true },
	],
	impl: ctx => 
		jb_ui.Comp({ template: '<div class="pulldown-menu-separator"></div>'},ctx)
})

jb.component('pulldown.menu-item', {
	type: 'control',
	params: [
		{ id: 'title', as: 'string', dynamic: true, essential: true },
		{ id: 'icon', as: 'string' },
		{ id: 'shortcut', as: 'string' },
		{ id: 'action', type: 'action', dynamic: true },
	    { id: 'style', type: 'pulldown-menu-item.style', defaultValue: { $: 'pulldown-menu-item.default' }, dynamic: true },
		{ id: 'features', type: 'feature[]', dynamic: true },
		{ id: '$click', type: 'boolean'},
	],
	  impl: function(context,title,icon,shortcut) {
	    if (context.params.$click) try { context.params.action() } catch (e) { jb.logException(e) } // for test debug
	    return jb_ui.ctrl(context).jbExtend({
	      beforeInit: function(cmp) {
	        cmp.title = title();
	        cmp.icon = icon;
	        cmp.shortcut = shortcut;
	        cmp.clicked = jb_ui.wrapWithLauchingElement( _ => {
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
  params: [
	  { id: 'icon', as: 'string' }
  ],
  impl :{$: 'customStyle',
  	template: `<div><div class="line noselect" (click)="clicked()">
  		<i class="material-icons">{{icon}}</i><span class="title">{{title}}</span><span class="shortcut">{{shortcut}}</span>
  		</div></div>`,
	css: `.line { display: flex; width1: 100%; cursor: pointer; background: #fff; font: 13px Arial; height: 24px}
		  .line.selected { background: #d8d8d8 }	
		  i { width: 24px; padding-left: 3px; padding-top: 3px; font-size:16px; }
		  span { padding-top: 3px }
          .title { display: block; text-align: left; } 
		  .shortcut { margin-left: auto; text-align: right; padding-right: 15px }
		  .line:hover { background: #eee; }
		`
	}
})

jb.component('pulldown.top-menu-item', {
	type: 'control',
	params: [
		{ id: 'title', dynamic: true, as: 'string' },
		{ id: 'style', type: 'pulldown-top-item.style', dynamic: true, defaultValue: { $: 'pulldown-top-item.default' } },
		{ id: 'controls', type: 'control[]', dynamic: true, flattenArray: true },
		{ id: 'open', type: 'boolean'},
	],
	impl: function(context) { 
		var openPopup = function(ctx,cmp) {
			return ctx.setVars({
				popupWidth: ctx.vars.$launchingElement.$el.outerWidth()
			}).run({
				$: 'openDialog', 
				style :{$: 'pulldown-popup.main-menu-popup' }, 
				content :{$: 'group', 
					controls: ctx => 
						context.params.controls(ctx) 
				}
			})
		}

		return jb_ui.ctrl(context).jbExtend({
			init: function(cmp) {
				cmp.mouseEnter = function() {
					if ($('.pulldown-mainmenu-popup')[0]) 
						cmp.openPopup();
				}
				cmp.title = context.params.title();
				cmp.openPopup = jb_ui.wrapWithLauchingElement(openPopup, context, cmp.elementRef); 

				if (context.params.open)
					cmp.openPopup();
			}
		},context)
	}
})

jb.component('pulldown.inner-menu', {
	type: 'control',
	params: [
		{ id: 'title', dynamic: true, as: 'string' },
		{ id: 'style', type: 'pulldown-inner-menu.style', dynamic: true, defaultValue: { $: 'pulldown-inner-menu.default' } },
		{ id: 'controls', type: 'control[]', dynamic: true, flattenArray: true },
	],
	impl: function(context) { 
		var openPopup = function(ctx,cmp) {
			cmp.innerPopup = ctx.setVars({
				popupWidth: ctx.vars.$launchingElement.$el.outerWidth()
			}).run({
				$: 'openDialog', 
				style :{$: 'pulldown-popup.context-menu-popup' }, 
				content :{$: 'group', 
					controls: ctx => 
						context.params.controls(ctx) 
				}
			})
		}

		return jb_ui.ctrl(context).jbExtend({
			init: function(cmp) {
				cmp.title = context.params.title();
				cmp.openPopup = jb_ui.wrapWithLauchingElement(openPopup, context, cmp.elementRef); 
				cmp.closePopup = _ => {
					this.innerPopup && this.innerPopup.close();
				} 
			}
		},context)
	}
})


jb.component('pulldown-top-item.default', {
	type: 'pulldown-top-item.style',
	impl :{$: 'customStyle',
			template: '<button class="pulldown-top-menu-item" (mouseEnter)="mouseEnter()" (click)="openPopup()">{{title}}</button>',
	}
})

jb.component('pulldown-inner-menu.default', {
	type: 'pulldown-inner-menu.style',
	impl :{$: 'customStyle',
			template: '<button class="pulldown-top-menu-item" (mouseEnter)="openPopup()" (mouseLeave)="closePopup()">{{title}}</button>',
	}
})

jb.component('pulldown-popup.main-menu-popup',{
	type: 'dialog.style',
	impl :{$: 'customStyle',
			template: `<div class="jb-dialog jb-popup pulldown-mainmenu-popup">
							<div *jbComp="contentComp" class="dialog-content"></div>
							<div class="pulldown-menu-remove-top-border"></div>
						</div>`, 
			css: '.pulldown-menu-remove-top-border { width: %$popupWidth%px }',
			features: [
					{ $: 'dialog-feature.uniqueDialog', id: 'pulldown main menu popup', remeberLastLocation: false },
					{ $: 'dialog-feature.maxZIndexOnClick' },
					{ $: 'dialog-feature.closeWhenClickingOutside' },
					{ $: 'dialog-feature.cssClassOnLaunchingControl' },
					{ $: 'dialog-feature.nearLauncherLocation' }
			]
	}
})

jb.component('pulldown-popup.context-menu-popup',{
	type: 'dialog.style',
	impl :{$: 'customStyle',
			template: '<div class="jb-dialog jb-popup pulldown-mainmenu-popup"><div *jbComp="contentComp"></div></div>',
			features: [
				{ $: 'dialog-feature.uniqueDialog', id: 'pulldown context menu popup', remeberLastLocation: false },
				{ $: 'dialog-feature.maxZIndexOnClick' },
				{ $: 'dialog-feature.closeWhenClickingOutside' },
				{ $: 'dialog-feature.cssClassOnLaunchingControl' },
				{ $: 'dialog-feature.nearLauncherLocation' }
			]
	}
})

jb.component('group.menu-keyboard-selection', {
  type: 'feature',
  params: [
    { id: 'autoFocus', type: 'boolean' }
  ],
  impl: ctx => 
  	({
	  observable: () => {},
      init: function(cmp) {
        cmp.keydownSrc = new jb_rx.Subject();
        cmp.keydown = cmp.keydownSrc
          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') );

        if (ctx.params.autoFocus)
            setTimeout(()=> {
              jb_logPerformance('focus','menu-keyboard-selection init autoFocus');
              cmp.elementRef.nativeElement.focus();
              $(cmp.elementRef.nativeElement).find('>*').first()
              	.addClass('selected')
              	.find('>*').addClass('selected'); // adding selected class at the inner componenet level
            })
        cmp.keydown
        	.filter(e=>e.keyCode == 13)
            .subscribe(e => {
	            var selected = $(cmp.elementRef.nativeElement).find('>.selected');
            	var selectedCtx = (cmp.ctrls[selected.index()] || {}).comp.ctx;
            	if (selectedCtx && selectedCtx.params.action)
					jb_ui.wrapWithLauchingElement(selectedCtx.params.action, selectedCtx, 
						$(cmp.elementRef.nativeElement).find('>.selected')[0])()
            })

        cmp.keydown
        	.filter(e=>e.keyCode == 27)
            .subscribe(e => 
            	ctx.run({$:'closeContainingPopup'}))

        cmp.keydown
        	.filter(e=>e.keyCode == 38 || e.keyCode == 40)
            .subscribe(e => {
              e.stopPropagation();
              var diff = event.keyCode == 40 ? 1 : -1;
              var elems = $(cmp.elementRef.nativeElement).find('>*');
              var selected = $(cmp.elementRef.nativeElement).find('>.selected');
              var newSelected = elems[selected.index()+diff] || selected;
              $(cmp.elementRef.nativeElement).find('>*,>*>*').removeClass('selected');
              $(newSelected).addClass('selected');
              $(newSelected).find('>*').addClass('selected'); /// adding the selected class at the inner componenet level
        })
      },
      host: {
        '(keydown)': 'keydownSrc.next($event)',
        'tabIndex' : '0',
      }
    })
})
