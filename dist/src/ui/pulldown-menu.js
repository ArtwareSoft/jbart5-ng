System.register(['jb-core', 'jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            jb_core_1.jb.component('pulldown.menu-item-separator', {
                type: 'control',
                impl: function (ctx) {
                    return jb_ui.Comp({ template: '<div class="pulldown-menu-separator"></div>' }, ctx);
                }
            });
            jb_core_1.jb.component('pulldown.MenuItem', {
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
                    template: "<div><div class=\"line\" (click)=\"clicked()\">\n  \t\t<i class=\"material-icons\">{{icon}}</i><span class=\"title\">{{title}}</span><span class=\"shortcut\">{{shortcut}}</span>\n  \t\t</div></div>",
                    css: ".line { display: flex; user-select: none; width1: 100%; cursor: pointer; background: #fff; font: 13px Arial; height: 24px}\n\t\t  i { width: 24px; padding-left: 3px; padding-top: 3px; font-size:16px; }\n\t\t  span { padding-top: 3px}\n          .title { display: block; text-align: left; } \n\t\t  .shortcut { margin-left: auto; text-align: right; padding-right: 15px }\n\t\t  .line:hover { background: #eee; }\n\t\t"
                }
            });
            // 		  button span { width: 16px; height: 16px; display: block; position: absolute; top: 5px; left: 6px;}
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
                            content: { $: 'group', controls: function (ctx) { return context.params.controls(ctx); } }
                        });
                    };
                    return jb_ui.ctrl(context).jbExtend({
                        init: function (cmp) {
                            cmp.mouseEnter = function () {
                                if ($('.pulldown-mainmenu-popup')[0])
                                    cmp.openPopup();
                            };
                            cmp.title = context.params.title();
                            cmp.openPopup = jb_ui.wrapWithLauchingElement(openPopup, context, cmp._nativeElement || cmp.elementRef);
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
            });
            jb_core_1.jb.component('pulldownPopup.contextMenuPopup', {
                type: 'dialog.style',
                impl: function (context) {
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
                    };
                }
            });
        }
    }
});
