import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import {Directive, Component, View, DynamicComponentLoader, ElementRef, Injector, Input, NgZone, EventEmitter} from 'angular2/core';
//import {bootstrap} from 'angular2/platform/browser';

jb.component('openDialog', {
	type: 'action',
	params: {
		id: { as: 'string' },
		modal: { as: 'boolean' },
		style: { type: 'dialog.style', dynamic: true, defaultValue: { $:'dialog.default' }	},
		content: { type: 'control', dynamic: true },
		title: { as: 'string', dynamic: true  },
		onOK: { type: 'action', dynamic: true },
		features: { type: 'dialogFeature[]', dynamic: true }
	},
	impl: function(context,id,modal) {
		var dialog = { id: id, onOK: context.params.onOK, modal: modal, $: $('div') };
		var ctx = (modal ? context.setVars({dialogData: {}}) : context).setVars({ $dialog: dialog });
		dialog.comp = jb_ui.ctrl(ctx).jbExtend({
			beforeInit: function(cmp) {
				cmp.title = ctx.params.title(ctx);
				cmp.dialog = dialog;
				cmp.dialog.$el = $(cmp.elementRef.nativeElement);
				cmp.dialog.$el.css('z-index',100);

				cmp.dialogClose = dialog.close;
				var content = ctx.params.content(ctx);
				jb_ui.loadIntoLocation(content, cmp, 'content',ctx).then(function(ref) { // clean Redundent Parents
					$(ref.location.nativeElement).addClass('dialog-content');
					jb.trigger(cmp.dialog, 'attach')
				})
			},
		});
		jb_dialogs.addDialog(dialog,ctx);
	}
})

jb.component('closeContainingPopup', {
	type: 'action',
	params: {
		OK: { type: 'boolean', as: 'boolean', defaultValue: true}
	},
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
				      <div #content></div>
				    </div>` 
	}
})

jb.component('dialog.md-dialog-ok-cancel', {
	type: 'dialog.style',
	params: {
		okLabel: { as: 'string', defaultValue: 'OK' },
		cancelLabel: { as: 'string', defaultValue: 'Cancel' },
	},
	impl :{$: 'customStyle',
		template: `
				<div class="jb-dialog jb-default-dialog">
				      <div class="dialog-title">{{title}}</div>
				      <button class="dialog-close" (click)="dialogClose()">&#215;</button>
				      <div #content></div>
					  <div>
							<button md-button="" type="button" (click)="dialogClose({OK:false})">
							  	<span class="md-button-wrapper">
								      <span>%$cancelLabel%</span>
    							</span>
    						</button>
							<button class="md-primary" md-button="" (click)="dialogClose({OK:true})" type="button">
									<span class="md-button-wrapper">
							      		<span>%$okLabel%</span>
							    	</span>
							</button>
						</div>
				</div>		
		`
	}
})

jb.component('dialogFeature.uniqueDialog', {
	type: 'dialogFeature',
	params: {
		id: { as: 'string' },
		remeberLastLocation: { type: 'boolean', as: 'boolean' }
	},
	impl: function(context,id,remeberLastLocation) {
		if (!id) return;
		var dialog = context.vars.$dialog;
		dialog.id = id;
		jb.bind(dialog, 'otherDialogCreated', function(otherDialog) {
			if (otherDialog.id == id)
				dialog.close();
		})
	}
})

jb.component('dialogFeature.nearLauncherLocation', {
	type: 'dialogFeature',
	params: {
		offsetLeft: { as: 'number', defaultValue: 0 },
		offsetTop: { as: 'number' , defaultValue: 0 },
	},
	impl: function(context,offsetLeft,offsetTop) {
		return {
			afterViewInit: function(cmp) {
				if (!context.vars.$launchingElement)
					return console.log('no launcher for dialog');
				var $control = context.vars.$launchingElement.$el;
				var pos = $control.offset();
				var $jbDialog = $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-dialog');
				$jbDialog.css('left', `${pos.left + offsetLeft}px`)
					.css('top', `${pos.top + $control.outerHeight() + offsetTop}px`)
					.css('display','block');
			}
		}
	}
})

jb.component('dialogFeature.launcherLocationNearSelectedNode', {
	type: 'dialogFeature',
	params: {
		offsetLeft: { as: 'number' },
		offsetTop: { as: 'number' },
	},
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

jb.component('dialogFeature.closeWhenClickingOutside', {
	type: 'dialogFeature',
	impl: function(context) { 
		var dialog = context.vars.$dialog;
		jb.delay(10).then(() => // close older before
			window.onmousedown = function(e) {
				if ($(e.target).closest(dialog.$el[0]).length) return;
				dialog.close();
			})
		jb.bind(dialog, 'close', function() {
			window.onmousedown = null;
		});
	}
})

jb.component('dialogFeature.autoFocusOnFirstInput', {
	type: 'dialogFeature',
	impl: function(context) {
		var dialog = context.vars.$dialog;
		return { 
			afterViewInit: function(cmp) {
				jb.delay(1).then(()=>dialog.$el.find('input,textarea,select').first().focus());
			}
		}
	}
})

jb.component('dialogFeature.cssClassOnLaunchingControl', {
	type: 'dialogFeature',
	impl: function(context) {
		var dialog = context.vars.$dialog;
		var $control = context.vars.$launchingElement.$el;
		jb.bind(dialog,'attach',function() {
			$control.addClass('dialog-open');
		});
		jb.bind(dialog,'close',function() {
			$control.removeClass('dialog-open');
		});
	}
})

jb.component('dialogFeature.maxZIndexOnClick', {
	type: 'dialogFeature',
	params: {
		minZIndex: { as: 'number'}
	},
	impl: function(context,minZIndex) {
		var dialog = context.vars.$dialog;
		jb.bind(dialog, 'attach', function() {
			setAsMaxZIndex();
			dialog.$el.mousedown(setAsMaxZIndex);
		});

		function setAsMaxZIndex() {
			var maxIndex = jb_dialogs.dialogs.reduce(function(max,d) { 
				return Math.max(max,(d.$el && parseInt(d.$el.css('z-index')) || 100)+1)
			}, minZIndex || 100)

			dialog.$el.css('z-index',maxIndex);
		}
	}
})

jb.component('dialogFeature.dragTitle', {
	type: 'dialogFeature',
	params: {
		id: { as: 'string' }
	},
	impl: function(context, id) { 
		var dialog = context.vars.$dialog;
		return {
		      innerhost: { '.dialog-title' : {
		      	'(mouseup)': 'mouseup.next($event)', 
		      	'(mousedown)': 'mousedown.next($event)', 
		       }},
		       css: '.dialog-title { cursor: pointer; user-select: none }',
		       init: function(cmp) {
				  if (id && sessionStorage.getItem(id)) {
						var pos = JSON.parse(sessionStorage.getItem(id));
					    dialog.$el[0].style.top  = pos.top  + 'px';
					    dialog.$el[0].style.left = pos.left + 'px';
				  }

				  cmp.mouseup   = new EventEmitter();
				  cmp.mousedown = new EventEmitter();
				  var storedPos = new EventEmitter();
				  var mousedrag = cmp.mousedown.map(event => {
				        event.preventDefault();
				        return {
				          left: event.clientX - dialog.$el[0].getBoundingClientRect().left,
				          top:  event.clientY - dialog.$el[0].getBoundingClientRect().top
				        };
				      })
				      .flatMap(imageOffset => jb_rx.Observable.fromEvent(document, 'mousemove').map(pos => ({
				        top:  pos.clientY - imageOffset.top,
				        left: pos.clientX - imageOffset.left
				      }))
				      .takeUntil(cmp.mouseup));

				  mousedrag.merge(storedPos).debounceTime(3).distinctUntilChanged().subscribe(pos => {
			        dialog.$el[0].style.top  = pos.top  + 'px';
			        dialog.$el[0].style.left = pos.left + 'px';
			        if (id) sessionStorage.setItem(id, JSON.stringify(pos))
			      });
			  }
	       }
	}
});


export var jb_dialogs = {
	dialogs: [],
	_initDialogs: function() {
	},
	addDialog: function(dialog,context) {
		this._initDialogs();
		dialog.context = context;
		var dialogs = this.dialogs;
		dialogs.forEach(d=> jb.trigger(d, 'otherDialogCreated', dialog));
		dialogs.push(dialog);
		if (dialog.modal)
			$('body').prepend('<div class="modal-overlay"></div>');

		jb_ui.apply(context);

		dialog.close = function(args) {
			jb.trigger(dialog, 'close');
			var index = dialogs.indexOf(dialog);
			if (index != -1)
				dialogs.splice(index, 1);
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
	},
	closeAll: function() {
		this.dialogs.forEach(d=>d.close());
	}
}
