System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx;
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
            }],
        execute: function() {
            jb_core_1.jb.component('pulldown.menu-item-separator', {
                type: 'control',
                impl: function (ctx) {
                    return jb_ui.Comp({ jbTemplate: '<div></div>', css: '{ margin: 6px 0; border-bottom: 1px solid #EBEBEB}' }, ctx);
                }
            });
            jb_core_1.jb.component('pulldown.menu-item-group', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true, essential: true },
                },
                impl: function (ctx) {
                    return jb_ui.Comp({ template: '<div class="pulldown-menu-separator"></div>' }, ctx);
                }
            });
            jb_core_1.jb.component('pulldown.menu-item', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true, essential: true },
                    icon: { as: 'string' },
                    shortcut: { as: 'string' },
                    action: { type: 'action', dynamic: true },
                    style: { type: 'pulldown-menu-item.style', defaultValue: { $: 'pulldown-menu-item.default' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                    $click: { type: 'boolean' },
                },
                impl: function (context, title, icon, shortcut) {
                    if (context.params.$click)
                        try {
                            context.params.action();
                        }
                        catch (e) {
                            jb_core_1.jb.logException(e);
                        } // for test debug
                    return jb_ui.ctrl(context).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.title = title();
                            cmp.icon = icon;
                            cmp.shortcut = shortcut;
                            cmp.clicked = jb_ui.wrapWithLauchingElement(function () {
                                context.vars.$dialog && context.vars.$dialog.close(); // close dialog
                                context.params.action();
                            }, context, cmp.elementRef);
                        }
                    });
                }
            });
            jb_core_1.jb.component('pulldown-menu-item.default', {
                type: 'button.style',
                params: {
                    icon: { as: 'string' }
                },
                impl: { $: 'customStyle',
                    template: "<div><div class=\"line noselect\" (click)=\"clicked()\">\n  \t\t<i class=\"material-icons\">{{icon}}</i><span class=\"title\">{{title}}</span><span class=\"shortcut\">{{shortcut}}</span>\n  \t\t</div></div>",
                    css: ".line { display: flex; width1: 100%; cursor: pointer; background: #fff; font: 13px Arial; height: 24px}\n\t\t  .line.selected { background: #d8d8d8 }\t\n\t\t  i { width: 24px; padding-left: 3px; padding-top: 3px; font-size:16px; }\n\t\t  span { padding-top: 3px }\n          .title { display: block; text-align: left; } \n\t\t  .shortcut { margin-left: auto; text-align: right; padding-right: 15px }\n\t\t  .line:hover { background: #eee; }\n\t\t"
                }
            });
            jb_core_1.jb.component('pulldown.topMenuItem', {
                type: 'control',
                params: {
                    title: { dynamic: true, as: 'string' },
                    style: { type: 'pulldownTopMenuItem.style', dynamic: true, defaultValue: { $: 'pulldownTopMenuItem.default' } },
                    controls: { type: 'control[]', dynamic: true, flattenArray: true },
                    open: { type: 'boolean' },
                },
                impl: function (context) {
                    var openPopup = function (ctx, cmp) {
                        return ctx.setVars({
                            popupWidth: ctx.vars.$launchingElement.$el.outerWidth()
                        }).run({
                            $: 'openDialog',
                            style: { $: 'pulldownPopup.mainMenuPopup' },
                            content: { $: 'group',
                                controls: function (ctx) {
                                    return context.params.controls(ctx);
                                }
                            }
                        });
                    };
                    return jb_ui.ctrl(context).jbExtend({
                        init: function (cmp) {
                            cmp.mouseEnter = function () {
                                if ($('.pulldown-mainmenu-popup')[0])
                                    cmp.openPopup();
                            };
                            cmp.title = context.params.title();
                            cmp.openPopup = jb_ui.wrapWithLauchingElement(openPopup, context, cmp.elementRef);
                            if (context.params.open)
                                cmp.openPopup();
                        }
                    }, context);
                }
            });
            jb_core_1.jb.type('pulldownTopMenuItem.style');
            jb_core_1.jb.component('pulldownTopMenuItem.default', {
                type: 'pulldownTopMenuItem.style',
                impl: { $: 'customStyle',
                    template: '<button class="pulldown-top-menu-item" (mouseEnter)="mouseEnter()" (click)="openPopup()">{{title}}</button>',
                }
            });
            jb_core_1.jb.component('pulldownPopup.mainMenuPopup', {
                type: 'dialog.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-dialog jb-popup pulldown-mainmenu-popup\">\n\t\t\t\t\t\t\t<jb_comp [comp]=\"contentComp\" class=\"dialog-content\"></jb_comp>\n\t\t\t\t\t\t\t<div class=\"pulldown-menu-remove-top-border\"></div>\n\t\t\t\t\t\t</div>",
                    css: '.pulldown-menu-remove-top-border { width: %$popupWidth%px }',
                    features: [
                        { $: 'dialogFeature.uniqueDialog', id: 'pulldown main menu popup', remeberLastLocation: false },
                        { $: 'dialogFeature.maxZIndexOnClick' },
                        { $: 'dialogFeature.closeWhenClickingOutside' },
                        { $: 'dialogFeature.cssClassOnLaunchingControl' },
                        { $: 'dialogFeature.nearLauncherLocation' }
                    ]
                }
            });
            jb_core_1.jb.component('pulldownPopup.contextMenuPopup', {
                type: 'dialog.style',
                impl: { $: 'customStyle',
                    template: '<div class="jb-dialog jb-popup pulldown-mainmenu-popup"><jb_comp [comp]="contentComp" class="dialog-content"></jb_comp></div>',
                    features: [
                        { $: 'dialogFeature.uniqueDialog', id: 'pulldown context menu popup', remeberLastLocation: false },
                        { $: 'dialogFeature.maxZIndexOnClick' },
                        { $: 'dialogFeature.closeWhenClickingOutside' },
                        { $: 'dialogFeature.cssClassOnLaunchingControl' },
                        { $: 'dialogFeature.nearLauncherLocation' }
                    ]
                }
            });
            jb_core_1.jb.component('group.menu-keyboard-selection', {
                type: 'feature',
                params: {
                    autoFocus: { type: 'boolean' }
                },
                impl: function (ctx) {
                    return ({
                        init: function (cmp) {
                            cmp.keydown = new jb_rx.Subject();
                            if (ctx.params.autoFocus)
                                setTimeout(function () {
                                    cmp.elementRef.nativeElement.focus();
                                    $(cmp.elementRef.nativeElement).find('>*').first()
                                        .addClass('selected')
                                        .find('>*').addClass('selected'); // adding selected class at the inner componenet level
                                });
                            cmp.keydown
                                .filter(function (e) { return e.keyCode == 13; })
                                .subscribe(function (e) {
                                var selected = $(cmp.elementRef.nativeElement).find('>.selected');
                                var selectedCtx = (cmp.ctrls[selected.index()] || {}).comp.ctx;
                                if (selectedCtx && selectedCtx.params.action)
                                    jb_ui.wrapWithLauchingElement(selectedCtx.params.action, selectedCtx, $(cmp.elementRef.nativeElement).find('>.selected')[0])();
                            });
                            cmp.keydown
                                .filter(function (e) { return e.keyCode == 27; })
                                .subscribe(function (e) {
                                return ctx.run({ $: 'closeContainingPopup' });
                            });
                            cmp.keydown
                                .filter(function (e) { return e.keyCode == 38 || e.keyCode == 40; })
                                .subscribe(function (e) {
                                e.stopPropagation();
                                var diff = event.keyCode == 40 ? 1 : -1;
                                var elems = $(cmp.elementRef.nativeElement).find('>*');
                                var selected = $(cmp.elementRef.nativeElement).find('>.selected');
                                var newSelected = elems[selected.index() + diff] || selected;
                                $(cmp.elementRef.nativeElement).find('>*,>*>*').removeClass('selected');
                                $(newSelected).addClass('selected');
                                $(newSelected).find('>*').addClass('selected'); /// adding the selected class at the inner componenet level
                            });
                        },
                        host: {
                            '(keydown)': 'keydown.next($event)',
                            'tabIndex': '0',
                        }
                    });
                }
            });
        }
    }
});
