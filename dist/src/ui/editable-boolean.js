System.register(['jb-core/jb', 'jb-ui/jb-ui', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui, jb_rx;
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
            }],
        execute: function() {
            ;
            jb_1.jb.type('editable-boolean.style');
            jb_1.jb.type('editable-boolean.yes-no-settings');
            jb_1.jb.component('editable-boolean', {
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
                                    .subscribe(function (x) { cmp.yesNo = x; jb_ui.apply(ctx); });
                                jb_rx.refObservable(jb_ui.ngRef('{{yesNo}}', cmp), ctx)
                                    .map(setting.fromBool || (function (x) { return x; }))
                                    .subscribe(function (x) { jb_1.jb.writeValue(databind, x); jb_ui.apply(ctx); });
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
            jb_1.jb.component('editable-boolean.yes-no-settings', {
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
            jb_1.jb.component('editable-boolean.md-switch', {
                type: 'editable-boolean.style',
                impl: function (context) {
                    return {
                        template: '<md-switch [(checked)]="yesNo">{{text()}}</md-switch>',
                        afterViewInit: function (cmp) { return cmp.bindViaSettings(); }
                    };
                }
            });
            jb_1.jb.component('editable-boolean.expand-collapse', {
                type: 'editable-boolean.style',
                impl: function (context) {
                    return {
                        template: "<button><span class=\"frame\"></span><span class=\"line1\"></span><span [ngClass]=\"{line2: !yesNo}\"></span></button>",
                        host: { '(click)': 'toggle()' },
                        styles: [
                            'button { margin-left: 3px; border: none; background: none; width: 11px; height: 11px; position: relative; padding: 0;}',
                            'button .frame { background: #F8FFF9; border-radius: 3px;  border: 1px solid #91B193;  position: absolute;  top: 0px;  left: 0px;  right: 0px;  bottom: 0px; }',
                            'button .line1 { position: absolute; background: #91B193; top: 5px; left: 3px; width: 5px; height: 1px; box-shadow: 1px 1px 1px -1px #89A385; }',
                            'button .line2 { position: absolute; background: #91B193; left: 5px; top: 3px; height: 5px; width: 1px; box-shadow: 1px 1px 1px -1px #89A385; }',
                        ],
                        afterViewInit: function (cmp) { return cmp.bindViaSettings(); }
                    };
                }
            });
        }
    }
});
