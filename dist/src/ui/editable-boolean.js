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
            jb_core_1.jb.type('editable-boolean.style');
            jb_core_1.jb.type('editable-boolean.yes-no-settings');
            jb_core_1.jb.component('editable-boolean', {
                type: 'control',
                params: {
                    databind: { as: 'ref' },
                    style: { type: 'editable-boolean.style', defaultValue: { $: 'editable-boolean.switch' }, dynamic: true },
                    title: { as: 'string', dynamic: true },
                    yesNoSettings: { type: 'editable-boolean.yes-no-settings', defaultValue: { $: 'editable-boolean.yes-no-settings' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx, databind) {
                    return jb_ui.ctrl(ctx).jbExtend({
                        init: function (cmp) {
                            var setting = ctx.params.yesNoSettings() || {};
                            databind = jb_ui.ngRef(databind, cmp);
                            cmp.bindViaSettings = function () {
                                jb_rx.refObservable(databind, ctx)
                                    .map(setting.toBool || (function (x) { return x; }))
                                    .subscribe(function (x) {
                                    cmp.yesNo = x;
                                    jb_ui.apply(ctx);
                                });
                                jb_rx.refObservable(jb_ui.ngRef('{{yesNo}}', cmp), ctx)
                                    .map(setting.fromBool || (function (x) { return x; }))
                                    .subscribe(function (x) {
                                    jb_core_1.jb.writeValue(databind, x);
                                    jb_ui.apply(ctx);
                                });
                            };
                            cmp.toggle = function () {
                                cmp.yesNo = !cmp.yesNo;
                                jb_ui.apply(ctx);
                            };
                            cmp.text = function () { return (setting.textFromBool || (function (x) { return x; }))(cmp.yesNo); };
                        }
                    }, ctx);
                }
            });
            jb_core_1.jb.component('editable-boolean.yes-no-settings', {
                type: 'editable-boolean.yes-no-settings',
                params: {
                    textForTrue: { as: 'string' },
                    textForFalse: { as: 'string' },
                    codeForTrue: { as: 'string', defaultValue: true },
                    codeForFalse: { as: 'string', defaultValue: false },
                },
                impl: function (context, textForTrue, textForFalse, codeForTrue, codeForFalse) {
                    return {
                        toBool: function (val) { return val == codeForTrue; },
                        fromBool: function (yesNo) { return yesNo ? codeForTrue : codeForFalse; },
                        textFromBool: function (yesNo) { return yesNo ? textForTrue : textForFalse; },
                    };
                }
            });
            jb_core_1.jb.component('editable-boolean.md-switch', {
                type: 'editable-boolean.style',
                impl: function (context) {
                    return {
                        template: '<md-switch [(checked)]="yesNo">{{text()}}</md-switch>',
                        afterViewInit: function (cmp) { return cmp.bindViaSettings(); }
                    };
                }
            });
            jb_core_1.jb.component('editable-boolean.expand-collapse', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<div><i class=\"material-icons\" style=\"font-size:16px;\" (click)=\"toggle()\">{{yesNo ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i></div>",
                    css: '{ cursor: pointer; user-select: none }',
                    methods: {
                        afterViewInit: function (ctx) { return function (cmp) { return cmp.bindViaSettings(); }; }
                    }
                }
            });
        }
    }
});
