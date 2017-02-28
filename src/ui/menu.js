
jb.component('menu.menu', {
	type: 'menu.option', 
	params: [
		{ id: 'title', as: 'string', dynamic: true, essential: true },
		{ id: 'options', type: 'menu.option[]', dynamic: true, flattenArray: true, essential: true },
	    { id: 'style', type: 'menu.style', defaultValue :{$: 'menu.apply-multi-level' }, dynamic: true },
		{ id: 'features', type: 'feature[]', dynamic: true },
	],
	impl: ctx => 
    	jb_ui.ctrl(ctx)
})

jb.component('menu.init-popup-menu', {
	type: 'feature',
	params: [
	    { id: 'popupStyle', type: 'dialog.style', dynamic: true, defaultValue :{$: 'menu.context-menu-popup'}  }
	],
  	impl: ctx => 
  	({
  		destroy: cmp => {
  			jbart.jb_dialogs.dialogs
  				.filter(d=>d.id == ctx.vars.optionsParentId)
  				.forEach(d=>d.close());
  		},
 		init: cmp => {
  			cmp.title = cmp.ctx.vars.$model.title();
			cmp.mouseEnter = event => {
				if ($('.context-menu-popup')[0]) 
					cmp.openPopup(event)
			}
			cmp.openPopup = jb_ui.wrapWithLauchingElement( ctx2 => {
		        	var ctxForPopup = ctx2.setVars({
		        		popupModel: ctx.vars.$model,
		        	});
		        	var elem = 
		        	ctxForPopup.run({$: 'openDialog',
						style : _ctx =>
							ctx.params.popupStyle(_ctx), 

		    			content :{$: 'group',
							$vars: { 
								 optionsParentId: ctx => ctx.id,
								 optionsDepth: ctx=> (ctx.vars.optionsDepth || 0) + 1 
							},
				    		controls: '%$popupModel/options%'
						} 
		    		});
		        }, cmp.ctx, cmp.elementRef)
		}
  	})
})

jb.component('menu.action', {
	type: 'menu.option', 
	params: [
		{ id: 'title', as: 'string', dynamic: true, essential: true },
		{ id: 'action', type: 'action', dynamic: true, essential: true },
		{ id: 'icon', as: 'string' },
		{ id: 'shortcut', as: 'string' },
	    { id: 'style', type: 'menu-option.style', defaultValue:{$: 'menu.apply-multi-level' }, dynamic: true },
		{ id: 'features', type: 'feature[]', dynamic: true },
	],
	impl: ctx => 
    	jb_ui.ctrl(ctx).jbExtend({
		    init: cmp => {
		    	var model = ctx.params;
		        cmp.title = model.title();
		        cmp.icon = model.icon;
		        cmp.shortcut = model.shortcut;
		        cmp.action = jb_ui.wrapWithLauchingElement( _ => {
		        	model.action(cmp.ctx);
		        }, ctx, cmp.elementRef);
		      }
		  })
})

jb.component('menu.options-group', {
	type: 'menu.option',
	params: [
		{ id: 'options', type: 'menu.option[]', dynamic: true, flattenArray: true, essential: true },
	],
	impl: (ctx,options) => 
    	options()
})

jb.component('menu.option-line', {
	type: 'menu-option.style',
  	impl :{$: 'customStyle', 
	  	template: `<div class="line noselect" (click)="action()">
	  		<i class="material-icons">{{icon}}</i><span class="title">{{title}}</span><span class="shortcut">{{shortcut}}</span>
	  		</div>`,
		css: `.line { display: flex; cursor: pointer; background: #fff; font: 13px Arial; height: 24px}
			  .line.selected { background: #d8d8d8 }	
			  i { width: 24px; padding-left: 3px; padding-top: 3px; font-size:16px; }
			  span { padding-top: 3px }
	          .title { display: block; text-align: left; } 
			  .shortcut { margin-left: auto; text-align: right; padding-right: 15px }
			  .line:hover { background: #eee; }
			`,
        features: {$: 'mdl.ripple-effect'},
	}
})

jb.component('menu.option-as-icon24', {
	type: 'menu-option.style',
  	impl :{$: 'customStyle', 
	  	template: `<div class="line noselect" (click)="clicked()" title="{{title}}">
	  		<i class="material-icons">
	  		</div>`,
		css: `.line { display: flex; cursor: pointer; background: #fff; height: 24px}
			  .line.selected { background: #d8d8d8 }	
			  i { width: 24px; padding-left: 3px; padding-top: 3px; font-size:16px; }
			  .line:hover { background: #eee; }
			`
	}
})

jb.component('menu.apply-multi-level', {
	type: 'menu.style',
	// params: [
	//     { id: 'default', type: 'menu.style', dynamic: true, defaultValue: {$: 'menu.popup-as-option'}},
	// ],
  	impl: ctx => {
  		if (ctx.vars.$model.action)
  			return ctx.vars.leafOptionStyle()
  		if (ctx.vars.outerMenuStyle && ctx.vars.optionsDepth != 2)
  			return ctx.vars.outerMenuStyle(ctx)
  		else if (ctx.vars.innerMenuStyle)
  			return ctx.vars.innerMenuStyle(ctx)
  		// else
  		// 	return ctx.params.default();
  	}
})

jb.component('menu.multi-level', {
	type: 'menu.style',
	params: [
	    { id: 'outerMenuStyle', type: 'menu.style', dynamic: true, defaultValue: {$: 'menu.popup-thumb'}},
	    { id: 'innerMenuStyle', type: 'menu.style', dynamic: true, defaultValue: {$: 'menu.popup-as-option'}},
	    { id: 'leafOptionStyle', type: 'menu-option.style', dynamic: true, defaultValue: {$: 'menu.option-line'}},
	    { id: 'layout', type: 'group.style', dynamic: true, defaultValue :{$: 'layout.horizontal'}},
	],
  	impl :{$: 'style-by-control', __innerImplementation: true,
    	modelVar: 'menuModel',
		$vars: { 
			 optionsParentId: ctx => ctx.id,
			 optionsDepth: ctx=> (ctx.vars.optionsDepth || 0) + 1 
		},
    	control :{$: 'group',
	    	$vars: {
	    		innerMenuStyle: ctx => ctx.componentContext.params.innerMenuStyle,
	    		outerMenuStyle: ctx => ctx.componentContext.params.outerMenuStyle,	
	    		leafOptionStyle: ctx => ctx.componentContext.params.leafOptionStyle,	
	    	},
    		style :{$call: 'layout'},
    		controls: '%$menuModel/options%'
		}
	}
})


jb.component('menu.popup-as-option', {
	type: 'menu.style',
	impl :{$: 'customStyle',
	  	template: `<div class="line noselect" (click)="action()">
	  		<span class="title">{{title}}</span><i class="material-icons" (mouseenter)="openPopup($event)">play_arrow</i>
	  		</div>`,
		css: `.line { display: flex; cursor: pointer; background: #fff; font: 13px Arial; height: 24px}
			  .line.selected { background: #d8d8d8 }	
			  .line:hover { background: #eee; }
			  i { width: 100%; text-align: right; font-size:16px; padding-right: 3px; padding-top: 3px; }
	          .title { display: block; text-align: left; padding-top: 3px; padding-left: 26px;} 
			`,
        features :{$: 'menu.init-popup-menu', popupStyle :{$: 'menu.context-menu-popup', rightSide: true, offsetTop: -24 } },
	}
})

jb.component('menu.popup-thumb', {
	type: 'menu.style',
	impl :{$: 'customStyle',
		template: `<div class="pulldown-top-menu-item" (mouseenter)="mouseEnter()" (click)="openPopup()">{{title}}</div>`,
        features :[
          {$: 'menu.init-popup-menu' },
          {$: 'mdl.ripple-effect'}
        ],
	}
})

jb.component('menu.pulldown', {
	type: 'menu.style',
	impl :{$: 'menu.multi-level'}
})

jb.component('menu.toolbar', {
	type: 'menu.style',
	impl :{$: 'menu.multi-level',
		leafOptionStyle :{$: 'menu.option-as-icon24' }
	}
})

jb.component('menu.context-menu-popup',{
	type: 'dialog.style',
	params: [
		{ id: 'offsetTop', as: 'number' },
		{ id: 'rightSide', as: 'boolean' },
	],
	impl :{$: 'customStyle',
			template: '<div class="jb-dialog jb-popup context-menu-popup pulldown-mainmenu-popup"><div *jbComp="contentComp"></div></div>',
			features: [
				{ $: 'dialog-feature.uniqueDialog', id: '%$optionsParentId%', remeberLastLocation: false },
				{ $: 'dialog-feature.maxZIndexOnClick' },
				{ $: 'dialog-feature.closeWhenClickingOutside' },
				{ $: 'dialog-feature.cssClassOnLaunchingControl' },
				{ $: 'dialog-feature.nearLauncherLocation', rightSide: '%$rightSide%', offsetTop: '%$offsetTop%' }
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


// jb.component('menu.context-menu', {
// 	type: 'menu.style',
//   	impl :{$: 'style-by-control', __innerImplementation: true,
//   		$vars: {
//   			popupMenuId: '%$popupMenuId%-menu'
//   		},
//     	modelVar: 'menuModel',
//     	control :{$: 'context-menu.inner-menu', title: '%$menuModel/title%',
//     		openPopup: {$: 'openDialog',
// 				style :{$: 'menu.context-menu-popup' }, 
//     			content:{$: 'group',
// 		    		controls: '%$menuModel/options%'
// 				} 
//     		}
// 		}
// 	}
// })

// jb.component('context-menu.inner-menu', {
//   type: 'control', category: 'context-menu:0',
//   params: [
//     { id: 'title', as: 'string', dynamic: true, essential: true, defaultTValue: 'click me' },
//     { id: 'openPopup', type: 'action', essential: true, dynamic: true },
//     { id: 'style', type: 'popup-menu.style', defaultValue :{$: 'popup-menu.context-menu' }, dynamic: true },
//   ],
// 	impl: ctx => 
//     	jb_ui.ctrl(ctx).jbExtend({
// 			init: cmp => {
// 				cmp.mouseEnter = _ => {
// 					if ($('.context-menu-popup')[0]) 
// 						ctx.vars.$model.openPopup()
// 				}
// 				cmp.openPopup = _ =>
// 					ctx.vars.$model.openPopup();
// 			}			
//     	})
// })


jb.component('menu.separator', {
	type: 'menu-option', 
	params: [
	    { id: 'style', type: 'menu-separator.style', defaultValue: { $: 'menu.pulldown-separator' }, dynamic: true },
	],
	impl: ctx => 
    	jb_ui.ctrl(ctx)
})

jb.component('menu.pulldown-separator', {
	type: 'menu-separator.style',
  	impl :{$: 'customStyle', 
      template: '<div class="pulldown-menu-separator"></div>'
  }
})
