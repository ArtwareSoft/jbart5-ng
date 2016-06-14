System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx', '@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx, core_1;
    var jb_dialogs;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
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
            jb_core_1.jb.component('openDialog', {
                type: 'action',
                params: {
                    id: { as: 'string' },
                    modal: { as: 'boolean' },
                    style: { type: 'dialog.style', dynamic: true, defaultValue: { $: 'dialog.default' } },
                    content: { type: 'control', dynamic: true },
                    menu: { type: 'control', dynamic: true },
                    title: { as: 'string', dynamic: true },
                    onOK: { type: 'action', dynamic: true },
                    features: { type: 'dialogFeature[]', dynamic: true }
                },
                impl: function (context, id, modal) {
                    var dialog = { id: id, onOK: context.params.onOK, modal: modal, $: $('div') };
                    var ctx = (modal ? context.setVars({ dialogData: {} }) : context).setVars({ $dialog: dialog });
                    dialog.comp = jb_ui.ctrl(ctx).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.title = ctx.params.title(ctx);
                            cmp.dialog = dialog;
                            cmp.dialog.$el = $(cmp.elementRef.nativeElement);
                            cmp.dialog.$el.css('z-index', 100);
                            cmp.dialogClose = dialog.close;
                            cmp.contentComp = ctx.params.content(ctx);
                            cmp.menuComp = ctx.params.menu(ctx);
                            cmp.hasMenu = !!ctx.params.menu.profile;
                            jb_core_1.jb.trigger(cmp.dialog, 'attach');
                            //				jb_ui.insertComponent(content, cmp.componentResolver, cmp.childView);
                            // jb_ui.loadIntoLocation(content, cmp, 'content',ctx).then(function(ref) { // clean Redundent Parents
                            // 	$(ref.location.nativeElement).addClass('dialog-content');
                            // 	jb.trigger(cmp.dialog, 'attach')
                            // })
                        },
                        directives: [jb_ui.jbComp]
                    });
                    jb_dialogs.addDialog(dialog, ctx);
                }
            });
            jb_core_1.jb.component('closeContainingPopup', {
                type: 'action',
                params: {
                    OK: { type: 'boolean', as: 'boolean', defaultValue: true }
                },
                impl: function (context, OK) {
                    context.vars.$dialog && context.vars.$dialog.close({ OK: OK });
                }
            });
            jb_core_1.jb.component('dialog.default', {
                type: 'dialog.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-dialog jb-default-dialog\">\n\t\t\t\t      <div class=\"dialog-title\">{{title}}</div>\n\t\t\t\t      <button class=\"dialog-close\" (click)=\"dialogClose()\">&#215;</button>\n\t\t\t\t      <jb_comp [comp]=\"contentComp\"></jb_comp>\n\t\t\t\t    </div>"
                }
            });
            jb_core_1.jb.component('dialogFeature.uniqueDialog', {
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
                    jb_core_1.jb.bind(dialog, 'otherDialogCreated', function (otherDialog) {
                        if (otherDialog.id == id)
                            dialog.close();
                    });
                }
            });
            jb_core_1.jb.component('dialogFeature.nearLauncherLocation', {
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
            jb_core_1.jb.component('dialogFeature.launcherLocationNearSelectedNode', {
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
            jb_core_1.jb.component('dialogFeature.closeWhenClickingOutside', {
                type: 'dialogFeature',
                impl: function (context) {
                    var dialog = context.vars.$dialog;
                    function clickOutHandler(e) {
                        if ($(e.target).closest(dialog.$el[0]).length == 0)
                            dialog.close();
                    }
                    jb_core_1.jb.delay(10).then(function () {
                        window.onmousedown = clickOutHandler;
                        if (jbart.previewWindow)
                            jbart.previewWindow.onmousedown = clickOutHandler;
                    });
                    jb_core_1.jb.bind(dialog, 'close', function () {
                        window.onmousedown = null;
                        if (jbart.previewWindow)
                            jbart.previewWindow.onmousedown = null;
                    });
                }
            });
            jb_core_1.jb.component('dialogFeature.autoFocusOnFirstInput', {
                type: 'dialogFeature',
                impl: function (context) { return ({
                    afterViewInit: function (cmp) {
                        return jb_core_1.jb.delay(1).then(function () {
                            return context.vars.$dialog.$el.find('input,textarea,select').first().focus();
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('dialogFeature.cssClassOnLaunchingControl', {
                type: 'dialogFeature',
                impl: function (context) { return ({
                    afterViewInit: function (cmp) {
                        var dialog = context.vars.$dialog;
                        var $control = context.vars.$launchingElement.$el;
                        $control.addClass('dialog-open');
                        jb_core_1.jb.bind(dialog, 'close', function () {
                            $control.removeClass('dialog-open');
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('dialogFeature.maxZIndexOnClick', {
                type: 'dialogFeature',
                params: {
                    minZIndex: { as: 'number' }
                },
                impl: function (context, minZIndex) {
                    var dialog = context.vars.$dialog;
                    return ({
                        afterViewInit: function (cmp) {
                            setAsMaxZIndex();
                            dialog.$el.mousedown(setAsMaxZIndex);
                        }
                    });
                    function setAsMaxZIndex() {
                        var maxIndex = jb_dialogs.dialogs.reduce(function (max, d) {
                            return Math.max(max, (d.$el && parseInt(d.$el.css('z-index')) || 100) + 1);
                        }, minZIndex || 100);
                        dialog.$el.css('z-index', maxIndex);
                    }
                }
            });
            jb_core_1.jb.component('dialogFeature.dragTitle', {
                type: 'dialogFeature',
                params: {
                    id: { as: 'string' }
                },
                impl: function (context, id) {
                    var dialog = context.vars.$dialog;
                    return {
                        innerhost: { '.dialog-title': {
                                '(mousedown)': 'mousedown.next($event)',
                            } },
                        css: '.dialog-title { cursor: pointer }',
                        init: function (cmp) {
                            if (id && sessionStorage.getItem(id)) {
                                var pos = JSON.parse(sessionStorage.getItem(id));
                                dialog.$el[0].style.top = pos.top + 'px';
                                dialog.$el[0].style.left = pos.left + 'px';
                            }
                            cmp.mouseup = new core_1.EventEmitter();
                            cmp.mousedown = new core_1.EventEmitter();
                            var mouseMoveEm = jb_rx.Observable.fromEvent(document, 'mousemove')
                                .merge(jb_rx.Observable.fromEvent((jbart.previewWindow || {}).document, 'mousemove'));
                            var mouseUpEm = jb_rx.Observable.fromEvent(document, 'mouseup')
                                .merge(jb_rx.Observable.fromEvent((jbart.previewWindow || {}).document, 'mouseup'));
                            var storedPos = new core_1.EventEmitter();
                            var mousedrag = cmp.mousedown.map(function (event) {
                                event.preventDefault();
                                return {
                                    left: event.clientX - dialog.$el[0].getBoundingClientRect().left,
                                    top: event.clientY - dialog.$el[0].getBoundingClientRect().top
                                };
                            })
                                .flatMap(function (imageOffset) {
                                return mouseMoveEm.takeUntil(mouseUpEm)
                                    .map(function (pos) { return ({
                                    top: pos.clientY - imageOffset.top,
                                    left: pos.clientX - imageOffset.left
                                }); });
                            });
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
                },
                addDialog: function (dialog, context) {
                    this._initDialogs();
                    dialog.context = context;
                    var dialogs = this.dialogs;
                    dialogs.forEach(function (d) {
                        return jb_core_1.jb.trigger(d, 'otherDialogCreated', dialog);
                    });
                    dialogs.push(dialog);
                    if (dialog.modal)
                        $('body').prepend('<div class="modal-overlay"></div>');
                    jb_ui.apply(context);
                    dialog.close = function (args) {
                        jb_core_1.jb.trigger(dialog, 'close');
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
                        if (dialog.modal)
                            $('.modal-overlay').first().remove();
                        jb_ui.apply(context);
                    };
                },
                closeAll: function () {
                    this.dialogs.forEach(function (d) {
                        return d.close();
                    });
                }
            });
        }
    }
});
