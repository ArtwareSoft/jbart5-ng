System.register(['js/jb', 'ui/jb-ui', 'ui/jb-rx', 'angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui, jb_rx, core_1;
    var jb_dialogs;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            jb_1.jb.component('openDialog', {
                type: 'action',
                params: {
                    id: { as: 'string' },
                    modal: { as: 'boolean' },
                    style: { type: 'dialog.style', dynamic: true, defaultValue: { $: 'dialog.default' } },
                    content: { type: 'control', dynamic: true },
                    title: { as: 'string', dynamic: true },
                    onOK: { type: 'action', dynamic: true },
                    features: { type: 'dialogFeature[]', dynamic: true }
                },
                impl: function (context, id, modal) {
                    var ctx = modal ? context.setVars({ dialogData: {} }) : context;
                    var dialog = { id: ctx.params.id, onOK: ctx.params.onOK, modal: modal };
                    dialog.comp = jb_ui.ctrl(ctx.setVars({ $dialog: dialog })).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.title = ctx.params.title(ctx);
                            cmp.dialog = dialog;
                            cmp.dialog.$el = $(cmp.elementRef.nativeElement).find('>*');
                            cmp.dialogClose = dialog.close;
                            var content = ctx.params.content(ctx);
                            jb_ui.loadIntoLocation(content, cmp, 'content', ctx).then(function (ref) {
                                $(ref.location.nativeElement).addClass('dialog-content');
                                jb_1.jb.trigger(cmp.dialog, 'attach');
                            });
                        },
                    });
                    jb_dialogs.addDialog(dialog, ctx);
                }
            });
            jb_1.jb.component('closeContainingPopup', {
                type: 'action',
                impl: function (context) {
                    context.vars.$dialog && context.vars.$dialog.close();
                }
            });
            jb_1.jb.component('dialog.default', {
                type: 'dialog.style',
                impl: function (context) {
                    return { jbTemplate: "<div class=\"jb-dialog jb-default-dialog\">\n\t\t\t\t      <div class=\"dialog-title\">{{title}}</div>\n\t\t\t\t      <button class=\"dialog-close\" (click)=\"dialogClose()\">&#215;</button>\n\t\t\t\t      <div #content></div>\n\t\t\t\t    </div>",
                    };
                }
            });
            jb_1.jb.component('dialog.md-dialog', {
                type: 'dialog.style',
                impl: function (context) {
                    return {
                        jbTemplate: "<div class=\"jb-dialog md-dialog md-dialog-absolute md-active\"><md-dialog-basic>\n\t\t\t\t\t\t\t  <h2 class=\"md-title\">{{title}}</h2>\n\t\t\t\t\t\t\t  <div #content></div>\n\t\t\t\t\t\t\t </md-dialog-basic></div>",
                    };
                }
            });
            jb_1.jb.component('dialog.md-dialog-with-close', {
                type: 'dialog.style',
                params: {
                    closeLabel: { as: 'string', defaultValue: 'Close' },
                },
                impl: function (context, closeLabel) {
                    return {
                        jbTemplate: "<div class=\"jb-dialog md-dialog md-dialog-absolute md-active\"><md-dialog-basic>\n\t\t\t\t\t\t\t  <h2 class=\"md-title\">{{title}}</h2>\n\t\t\t\t\t\t\t  <div #content></div>\n\t\t\t\t\t\t\t<md-dialog-actions>\n\t\t\t\t\t\t\t<button class=\"md-primary\" md-button=\"\" (click)=\"dialogClose({OK:true})\" type=\"button\">\n\t\t\t\t\t\t\t\t\t<span class=\"md-button-wrapper\">\n\t\t\t\t\t\t\t      \t\t<span>" + closeLabel + "</span>\n\t\t\t\t\t\t\t    \t</span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</md-dialog-actions>\n\t\t\t\t\t\t\t </md-dialog-basic></div>",
                    };
                }
            });
            jb_1.jb.component('dialog.md-dialog-ok-cancel', {
                type: 'dialog.style',
                params: {
                    okLabel: { as: 'string', defaultValue: 'OK' },
                    cancelLabel: { as: 'string', defaultValue: 'Cancel' },
                },
                impl: function (context, okLabel, cancelLabel) {
                    return {
                        jbTemplate: "<div class=\"jb-dialog md-dialog md-dialog-absolute md-active\"><md-dialog-basic>\n\t\t\t\t\t\t\t  <h2 class=\"md-title\">{{title}}</h2>\n\t\t\t\t\t\t\t  <div #content></div>\n\t\t\t\t\t\t\t<md-dialog-actions>\n\t\t\t\t\t\t\t<button md-button=\"\" type=\"button\" (click)=\"dialogClose({OK:false})\">\n\t\t\t\t\t\t\t  \t<span class=\"md-button-wrapper\">\n\t\t\t\t\t\t\t\t      <span>" + cancelLabel + "</span>\n    \t\t\t\t\t\t\t</span>\n    \t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button class=\"md-primary\" md-button=\"\" (click)=\"dialogClose({OK:true})\" type=\"button\">\n\t\t\t\t\t\t\t\t\t<span class=\"md-button-wrapper\">\n\t\t\t\t\t\t\t      \t\t<span>" + okLabel + "</span>\n\t\t\t\t\t\t\t    \t</span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</md-dialog-actions>\n\t\t\t\t\t\t\t </md-dialog-basic></div>",
                    };
                }
            });
            jb_1.jb.component('dialogFeature.uniqueDialog', {
                type: 'dialogFeature',
                params: {
                    id: { as: 'string' },
                    remeberLastLocation: { type: 'boolean', as: 'boolean' }
                },
                impl: function (context, id, remeberLastLocation) {
                    if (!id)
                        return;
                    var dialog = context.vars.$dialog;
                    dialog.id = id;
                    jb_1.jb.bind(dialog, 'otherDialogCreated', function (otherDialog) {
                        if (otherDialog.id == id)
                            dialog.close();
                    });
                }
            });
            jb_1.jb.component('dialogFeature.nearLauncherLocation', {
                type: 'dialogFeature',
                params: {
                    offsetLeft: { as: 'number', defaultValue: 0 },
                    offsetTop: { as: 'number', defaultValue: 0 },
                },
                impl: function (context, offsetLeft, offsetTop) {
                    return {
                        afterViewInit: function (cmp) {
                            if (!context.vars.$launchingElement)
                                return console.log('no launcher for dialog');
                            var $control = context.vars.$launchingElement.$el;
                            var pos = $control.offset();
                            var $jbDialog = $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-dialog');
                            $jbDialog.css('left', (pos.left + offsetLeft) + "px")
                                .css('top', (pos.top + $control.outerHeight() + offsetTop) + "px")
                                .css('display', 'block');
                        }
                    };
                }
            });
            jb_1.jb.component('dialogFeature.launcherLocationNearSelectedNode', {
                type: 'dialogFeature',
                params: {
                    offsetLeft: { as: 'number' },
                    offsetTop: { as: 'number' },
                },
                impl: function (context, offsetLeft, offsetTop) {
                    return {
                        afterViewInit: function (cmp) {
                            var $elem = context.vars.$launchingElement.$el;
                            var $control = $elem.closest('.selected').first();
                            var pos = $control.offset();
                            $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-dialog').css('left', (pos.left + offsetLeft) + "px");
                            $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-dialog').css('top', (pos.top + $control.outerHeight() + offsetTop) + "px");
                        }
                    };
                }
            });
            jb_1.jb.component('dialogFeature.closeWhenClickingOutside', {
                type: 'dialogFeature',
                impl: function (context) {
                    var dialog = context.vars.$dialog;
                    jb_1.jb.delay(10).then(function () {
                        return window.onmousedown = function (e) {
                            if ($(e.target).closest(dialog.$el.parent())[0])
                                return;
                            dialog.close();
                        };
                    });
                    jb_1.jb.bind(dialog, 'close', function () {
                        window.onmousedown = null;
                    });
                }
            });
            jb_1.jb.component('dialogFeature.autoFocusOnFirstInput', {
                type: 'dialogFeature',
                impl: function (context) {
                    var dialog = context.vars.$dialog;
                    return {
                        afterViewInit: function (cmp) {
                            jb_1.jb.delay(1).then(function () { return dialog.$el.find('input,textarea,select').first().focus(); });
                        }
                    };
                    // jb.bind(dialog,'attach',function() {
                    // 	dialog.$el.find('input,textarea').first().focus();
                    // })
                }
            });
            jb_1.jb.component('dialogFeature.cssClassOnLaunchingControl', {
                type: 'dialogFeature',
                impl: function (context) {
                    var dialog = context.vars.$dialog;
                    var $control = context.vars.$launchingElement.$el;
                    jb_1.jb.bind(dialog, 'attach', function () {
                        $control.addClass('dialog-open');
                    });
                    jb_1.jb.bind(dialog, 'close', function () {
                        $control.removeClass('dialog-open');
                    });
                }
            });
            jb_1.jb.component('dialogFeature.maxZIndexOnClick', {
                type: 'dialogFeature',
                params: {
                    minZIndex: { as: 'number' }
                },
                impl: function (context, minZIndex) {
                    var dialog = context.vars.$dialog;
                    jb_1.jb.bind(dialog, 'attach', function () {
                        setAsMaxZIndex();
                        dialog.$el.mousedown(setAsMaxZIndex);
                    });
                    function setAsMaxZIndex() {
                        var maxIndex = jb_dialogs.dialogs.reduce(function (max, d) {
                            return Math.max(max, (parseInt(d.$el.css('z-index')) || 0) + 1);
                        }, minZIndex || 100);
                        dialog.$el.css('z-index', maxIndex);
                    }
                }
            });
            jb_1.jb.component('dialogFeature.dragTitle', {
                type: 'dialogFeature',
                params: {
                    id: { as: 'string' }
                },
                impl: function (context, id) {
                    var dialog = context.vars.$dialog;
                    return {
                        innerhost: { '.dialog-title': {
                                '(mouseup)': 'mouseup.next($event)',
                                '(mousedown)': 'mousedown.next($event)',
                            } },
                        styles: ['.dialog-title { cursor: pointer }'],
                        init: function (cmp) {
                            if (id && sessionStorage.getItem(id)) {
                                var pos = JSON.parse(sessionStorage.getItem(id));
                                dialog.$el[0].style.top = pos.top + 'px';
                                dialog.$el[0].style.left = pos.left + 'px';
                            }
                            cmp.mouseup = new core_1.EventEmitter();
                            cmp.mousedown = new core_1.EventEmitter();
                            //				  cmp.mousemove = new EventEmitter();
                            var storedPos = new core_1.EventEmitter();
                            var mousedrag = cmp.mousedown.map(function (event) {
                                event.preventDefault();
                                return {
                                    left: event.clientX - dialog.$el[0].getBoundingClientRect().left,
                                    top: event.clientY - dialog.$el[0].getBoundingClientRect().top
                                };
                            })
                                .flatMap(function (imageOffset) { return jb_rx.Observable.fromEvent(document, 'mousemove').map(function (pos) { return ({
                                top: pos.clientY - imageOffset.top,
                                left: pos.clientX - imageOffset.left
                            }); })
                                .takeUntil(cmp.mouseup); });
                            mousedrag.merge(storedPos).debounceTime(3).distinctUntilChanged().subscribe(function (pos) {
                                dialog.$el[0].style.top = pos.top + 'px';
                                dialog.$el[0].style.left = pos.left + 'px';
                                if (id)
                                    sessionStorage.setItem(id, JSON.stringify(pos));
                            });
                        }
                    };
                }
            });
            exports_1("jb_dialogs", jb_dialogs = {
                dialogs: [],
                _initDialogs: function () {
                    if ($('.modalOverlay').length == 0)
                        $('body').prepend('<div class="modalOverlay"></div>');
                    // if ($('body').find('>jb-dialog-parent')[0]) return;
                    // $('<jb-dialog-parent></jb-dialog-parent>').appendTo('body')[0];
                    // bootstrap(jbDialogParent);
                },
                addDialog: function (dialog, context) {
                    this._initDialogs();
                    dialog.context = context;
                    var dialogs = this.dialogs;
                    dialogs.forEach(function (d) { return jb_1.jb.trigger(d, 'otherDialogCreated', dialog); });
                    dialogs.push(dialog);
                    if (dialog.modal)
                        $('.modalOverlay').css('zIndex', 40);
                    jb_ui.apply(context);
                    //		jb_dialogs.dlg_ngZone && jb_dialogs.dlg_ngZone.run(()=>{});
                    dialog.close = function (args) {
                        jb_1.jb.trigger(dialog, 'close');
                        var index = dialogs.indexOf(dialog);
                        if (index != -1)
                            dialogs.splice(index, 1);
                        if (dialog.onOK && args && args.OK)
                            try {
                                dialog.onOK(context);
                            }
                            catch (e) {
                                console.log(e);
                            }
                        //			jb_dialogs.dlg_ngZone.run(()=>{})
                        if (dialog.modal)
                            $('.modalOverlay').css('zIndex', -1);
                        jb_ui.apply(context);
                    };
                },
                closeAll: function () {
                    this.dialogs.forEach(function (d) { return d.close(); });
                }
            });
        }
    }
});
// @Component({  // allow features to share the dialog object
// 	selector: '[jb-dialog-injector]',
// 	template: '<div #dialog></div>'
// })
// class jbDialogInjector {
// 	@Input() dialog;
// 	@Input('jb-dialog-injector') injector;
// 	constructor(public dcl: DynamicComponentLoader, public elementRef: ElementRef) { }
// 	ngOnInit() {
// 		this.dcl.loadIntoLocation(this.dialog.cmp, this.elementRef, 'dialog');
// 	}
// }
// @Component({
// 	template: `<div *ngFor="#dialog of dialogs"><div jb-dialog-injector [dialog]="dialog"></div></div>`, // 
//     selector: 'jb-dialog-parent',
// 	directives: [jbDialogInjector],
// })
// class jbDialogParent {
// 	constructor(private ngZone: NgZone) { 
// //		jb_dialogs.dlg_ngZone = ngZone;
// 	}
// 	ngOnInit() {
// 		this.dialogs = jb_dialogs.dialogs;
// 	}
// }
//# sourceMappingURL=dialog.js.map