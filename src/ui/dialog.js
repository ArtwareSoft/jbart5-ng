jbLoadModules(['jb-core','jb-ui','jb-ui/jb-rx']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];

jb.component('openDialog', {
	type: 'action',
	params: [
		{ id: 'id', as: 'string' },
		{ id: 'style', type: 'dialog.style', dynamic: true, defaultValue: { $:'dialog.default' }	},
		{ id: 'content', type: 'control', dynamic: true, defaultValue :{$: 'group'}, forceDefaultCreation: true },
		{ id: 'menu', type: 'control', dynamic: true },
		{ id: 'title', as: 'string', dynamic: true  },
		{ id: 'onOK', type: 'action', dynamic: true },
		{ id: 'modal', type: 'boolean', as: 'boolean' },
		{ id: 'features', type: 'dialogFeature[]', dynamic: true }
	],
	impl: function(context,id) {
		var modal = context.params.modal;
		var dialog = { 
			id: id, 
			onOK: context.params.onOK, 
			modal: modal, 
			$: $('div'), 
			em: new jb_rx.Subject(),
		};
//		dialog.em.subscribe(e=>console.log(e.type));

		var ctx = (modal ? context.setVars({dialogData: {}}) : context)
				.setVars({ $dialog: dialog });
		dialog.comp = jb_ui.ctrl(ctx).jbExtend({
			beforeInit: function(cmp) {
				cmp.title = ctx.params.title(ctx);
				cmp.dialog = dialog;
				cmp.dialog.$el = $(cmp.elementRef.nativeElement);
				cmp.dialog.$el.css('z-index',100);

				cmp.dialogClose = dialog.close;
				cmp.contentComp = ctx.params.content(ctx);
				cmp.menuComp = ctx.params.menu(ctx);
				cmp.hasMenu = !!ctx.params.menu.profile;
			}
		});
		jbart.jb_dialogs.addDialog(dialog,ctx);
	}
})

jb.component('closeContainingPopup', {
	type: 'action',
	params: [
		{ id: 'OK', type: 'boolean', as: 'boolean', defaultValue: true}
	],
	impl: function(context,OK) {
		context.vars.$dialog && context.vars.$dialog.close({OK:OK});
	}
})

jb.component('dialog.default', {
	type: 'dialog.style',
	impl :{$: 'customStyle',
		template: `<div class="jb-dialog jb-default-dialog">
				      <div class="dialog-title">{{title}}</div>
				      <button class="dialog-close" (click)="dialogClose()">&#215;</button>
				      <jb_comp [comp]="contentComp"></jb_comp>
				    </div>` 
	}
})

jb.component('dialog.popup', {
  type: 'dialog.style',
  impl :{$: 'customStyle',
      template: '<div class="jb-dialog jb-popup"><jb_comp [comp]="contentComp" class="dialog-content"></jb_comp></div>',
      features: [
        { $: 'dialogFeature.maxZIndexOnClick' },
        { $: 'dialogFeature.closeWhenClickingOutside' },
        { $: 'dialogFeature.cssClassOnLaunchingControl' },
        { $: 'dialogFeature.nearLauncherLocation' }
      ]
  }
})


jb.component('dialogFeature.uniqueDialog', {
	type: 'dialogFeature',
	params: [
		{ id: 'id', as: 'string' },
		{ id: 'remeberLastLocation', type: 'boolean', as: 'boolean' }
	],
	impl: function(context,id,remeberLastLocation) {
		if (!id) return;
		var dialog = context.vars.$dialog;
		dialog.id = id;
		dialog.em.filter(e=> 
			e.type == 'new-dialog')
			.subscribe(e=> {
				if (e.dialog != dialog && e.dialog.id == id )
					dialog.close();
		})
	}
})

function fixDialogOverflow($control,$dialog,offsetLeft,offsetTop) {
	var padding = 2,top,left;
	if ($control.offset().top + $dialog.height() + padding + (offsetTop||0) > window.innerHeight + window.pageYOffset)
		top = $control.offset().top - $dialog.height();
	if ($control.offset().left + $dialog.width() + padding + (offsetLeft||0) > window.innerWidth + window.pageXOffset)
		left = $control.offset().left - $dialog.width();
	if (top || left)
		return { top: top || $control.offset().top , left: left || $control.offset().left}
}

jb.component('dialogFeature.nearLauncherLocation', {
	type: 'dialogFeature',
	params: [
		{ id: 'offsetLeft', as: 'number', defaultValue: 0 },
		{ id: 'offsetTop', as: 'number' , defaultValue: 0 },
	],
	impl: function(context,offsetLeft,offsetTop) {
		return {
			afterViewInit: function(cmp) {
				if (!context.vars.$launchingElement)
					return console.log('no launcher for dialog');
				var $control = context.vars.$launchingElement.$el;
				var pos = $control.offset();
				var $jbDialog = $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-dialog');
				var fixedPosition = fixDialogOverflow($control,$jbDialog,offsetLeft,offsetTop);
				if (fixedPosition)
					$jbDialog.css('left', `${fixedPosition.left}px`)
						.css('top', `${fixedPosition.top}px`)
						.css('display','block');
				else
					$jbDialog.css('left', `${pos.left + offsetLeft}px`)
						.css('top', `${pos.top + $control.outerHeight() + offsetTop}px`)
						.css('display','block');
			}
		}
	}
})

jb.component('dialogFeature.launcherLocationNearSelectedNode', {
	type: 'dialogFeature',
	params: [
		{ id: 'offsetLeft', as: 'number' },
		{ id: 'offsetTop', as: 'number' },
	],
	impl: function(context, offsetLeft, offsetTop) {
		return {
			afterViewInit: function(cmp) {
				var $elem = context.vars.$launchingElement.$el;
				var $control = $elem.closest('.selected').first();
				var pos = $control.offset();
				$(cmp.elementRef.nativeElement).findIncludeSelf('.jb-dialog').css('left', `${pos.left + offsetLeft}px`);
				$(cmp.elementRef.nativeElement).findIncludeSelf('.jb-dialog').css('top', `${pos.top + $control.outerHeight() + offsetTop}px`);
			}
		}
	}
})

jb.component('dialogFeature.onClose', {
	type: 'dialogFeature',
	params: [
		{ id: 'action', type: 'action', dynamic: true}
	],
	impl: function(context,action) { 
		context.vars.$dialog.em
			.filter(e => e.type == 'close')
			.take(1)
			.subscribe(()=>
				action())
	}
})

jb.component('dialogFeature.closeWhenClickingOutside', {
	type: 'dialogFeature',
	impl: function(context) { 
		var dialog = context.vars.$dialog;
		jb.delay(10).then(() =>  { // delay - close older before    		
			var clickoutEm = jb_rx.Observable.fromEvent(document, 'mousedown')
			      			.merge(jb_rx.Observable.fromEvent(
			      				(jbart.previewWindow || {}).document, 'mousedown'))
			      			.filter(e =>
			      				$(e.target).closest(dialog.$el[0]).length == 0)
   					 		.takeUntil(dialog.em.filter(e => e.type == 'close'));

		 	clickoutEm.take(1)
		  		.subscribe(()=>
		  			dialog.close())
  		})


		// function clickOutHandler(e) {
		// 	if ($(e.target).closest(dialog.$el[0]).length == 0)
		// 		dialog.close();
		// }
		// jb.delay(10).then( function() { // delay - close older before
		// 	window.onmousedown = clickOutHandler;
		// 	if (jbart.previewWindow)
		// 		jbart.previewWindow.onmousedown = clickOutHandler;
		// })
		// dialog.filter(x=>x.type == 'close').
		// 	subscribe(() =>{
		// 		window.onmousedown = null;
		// 		if (jbart.previewWindow) 
		// 			jbart.previewWindow.onmousedown = null;
		// 	})
	}
})

jb.component('dialogFeature.autoFocusOnFirstInput', {
	type: 'dialogFeature',
	impl: context => ({ 
			afterViewInit: cmp =>
				jb.delay(1).then(()=>
					context.vars.$dialog.$el.find('input,textarea,select').first().focus())
	})
})

jb.component('dialogFeature.cssClassOnLaunchingControl', {
	type: 'dialogFeature',
	impl: context => ({ 
			afterViewInit: cmp => {
				var dialog = context.vars.$dialog;
				var $control = context.vars.$launchingElement.$el;
				$control.addClass('dialog-open');
				dialog.em.filter(e=>
					e.type == 'close')
					.take(1)
					.subscribe(()=> {
						$control.removeClass('dialog-open');
					})
			}
	})
})

jb.component('dialogFeature.maxZIndexOnClick', {
	type: 'dialogFeature',
	params: [
		{ id: 'minZIndex', as: 'number'}
	],
	impl: function(context,minZIndex) {
		var dialog = context.vars.$dialog;

		return ({
			afterViewInit: cmp => {
				setAsMaxZIndex();
				dialog.$el.mousedown(setAsMaxZIndex);
			}
		})

		function setAsMaxZIndex() {
			var maxIndex = jbart.jb_dialogs.dialogs.reduce(function(max,d) { 
				return Math.max(max,(d.$el && parseInt(d.$el.css('z-index')) || 100)+1)
			}, minZIndex || 100)

			dialog.$el.css('z-index',maxIndex);
		}
	}
})

jb.component('dialogFeature.dragTitle', {
	type: 'dialogFeature',
	params: [
		{ id: 'id', as: 'string' }
	],
	impl: function(context, id) { 
		var dialog = context.vars.$dialog;
		return {
		      innerhost: { '.dialog-title' : {
		      	'(mousedown)': 'mousedown.next($event)', 
		       }},
		       css: '.dialog-title { cursor: pointer }',
		       init: function(cmp) {
		       	  cmp.mousedown = cmp.mousedown || new jb_rx.Subject();
		       	  
				  if (id && sessionStorage.getItem(id)) {
						var pos = JSON.parse(sessionStorage.getItem(id));
					    dialog.$el[0].style.top  = pos.top  + 'px';
					    dialog.$el[0].style.left = pos.left + 'px';
				  }

				  var mouseMoveEm = jb_rx.Observable.fromEvent(document, 'mousemove')
				      			.merge(jb_rx.Observable.fromEvent(
				      				(jbart.previewWindow || {}).document, 'mousemove'));
				  var mouseUpEm = jb_rx.Observable.fromEvent(document, 'mouseup')
				      			.merge(jb_rx.Observable.fromEvent(
				      				(jbart.previewWindow || {}).document, 'mouseup'));

				  var mousedrag = cmp.mousedown.map(event => {
				        event.preventDefault();
				        return {
				          left: event.clientX - dialog.$el[0].getBoundingClientRect().left,
				          top:  event.clientY - dialog.$el[0].getBoundingClientRect().top
				        };
				      })
				      .flatMap(imageOffset => 
				      			 mouseMoveEm.takeUntil(mouseUpEm)
				      			 	.map(pos => ({
							        top:  pos.clientY - imageOffset.top,
							        left: pos.clientX - imageOffset.left
							     }))
				      	);

				  mousedrag.debounceTime(3).distinctUntilChanged().subscribe(pos => {
			        dialog.$el[0].style.top  = pos.top  + 'px';
			        dialog.$el[0].style.left = pos.left + 'px';
			        if (id) sessionStorage.setItem(id, JSON.stringify(pos))
			      });
			  }
	       }
	}
});


class jbDialogs {
	constructor() {
	 	this.dialogs = []
	}
	addDialog(dialog,context) {
		var self = this;
		dialog.context = context;
		this.dialogs.forEach(d=>
			d.em.next({ type: 'new-dialog', dialog: dialog }));
		this.dialogs.push(dialog);
		if (dialog.modal)
			$('body').prepend('<div class="modal-overlay"></div>');

		jb_ui.apply(context);

		dialog.close = function(args) {
			dialog.em.next({type: 'close'});
			dialog.em.complete();
			var index = self.dialogs.indexOf(dialog);
			if (index != -1)
				self.dialogs.splice(index, 1);
			if (dialog.onOK && args && args.OK) 
				try { 
					dialog.onOK(context);
				} catch (e) {
					console.log(e);
				}
			if (dialog.modal)
				$('.modal-overlay').first().remove();
			jb_ui.apply(context);
		}
	}
	closeAll() {
		this.dialogs.forEach(d=>
			d.close());
	}
}

jbart.jb_dialogs = new jbDialogs;

})