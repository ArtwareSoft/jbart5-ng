System.register(['jb-core/jb', 'jb-ui/jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui;
    var editableNumber;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            ;
            jb_1.jb.type('editable-number.style');
            jb_1.jb.component('editable-number', {
                type: 'control',
                params: {
                    databind: { as: 'ref' },
                    title: { as: 'string', dynamic: true },
                    style: { type: 'editable-number.style', defaultValue: { $: 'editable-number.input' }, dynamic: true },
                    symbol: { as: 'string', description: 'leave empty to parse symbol from value' },
                    min: { as: 'number' },
                    max: { as: 'number' },
                    displayString: { as: 'string', dynamic: true, defaultValue: '%$Value%%$Symbol%' },
                    dataString: { as: 'string', dynamic: true, defaultValue: '%$Value%%$Symbol%' },
                    step: { as: 'number', defaultValue: 1, description: 'used by slider' },
                    initialPixelsPerUnit: { as: 'number', description: 'used by slider' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (context, databind, title, style, symbol, min, max, displayString, dataString, step, initialPixelsPerUnit) {
                    var ctx = context.setVars({
                        editableNumber: new editableNumber(symbol, min, max, displayString, dataString, step || 1, initialPixelsPerUnit),
                        field: jb_ui.twoWayBind(databind)
                    });
                    return jb_ui.ctrl(ctx);
                }
            });
            jb_1.jb.component('editable-number.bindField', {
                type: 'feature',
                impl: function (ctx) { return jb_1.jb.obj('init', function (cmp) { return ctx.vars.field.bindToCmp(cmp, ctx); }); }
            });
            jb_1.jb.component('editable-number.input', {
                type: 'editable-number.style',
                impl: { $: 'customStyle',
                    features: { $: 'editable-number.bindField' },
                    template: "<div><input %$field.modelExp%></div>",
                    css: 'input {height: 16px}'
                }
            });
            editableNumber = (function () {
                function editableNumber(symbol, min, max, displayString, dataString, step, initialPixelsPerUnit) {
                    this.symbol = symbol;
                    this.min = min;
                    this.max = max;
                    this.displayString = displayString;
                    this.dataString = dataString;
                    this.step = step;
                    this.initialPixelsPerUnit = initialPixelsPerUnit;
                    if (this.min == null)
                        this.min = NaN;
                    if (this.max == null)
                        this.max = NaN;
                }
                editableNumber.prototype.numericPart = function (dataString) {
                    if (!dataString)
                        return NaN;
                    var parts = ('' + dataString).match(/([^0-9\.\-]*)([0-9\.\-]+)([^0-9\.\-]*)/); // prefix-number-suffix
                    if ((!this.symbol) && parts)
                        this.symbol = parts[1] || parts[3] || this.symbol;
                    return (parts && parts[2]) || '';
                };
                editableNumber.prototype.calcDisplayString = function (number, ctx) {
                    if (isNaN(number))
                        return this.placeholder || '';
                    return this.displayString(ctx.setVars({ Value: '' + number, Symbol: this.symbol }));
                };
                editableNumber.prototype.calcDataString = function (number, ctx) {
                    if (isNaN(number))
                        return '';
                    return this.dataString(ctx.setVars({ Value: '' + number, Symbol: this.symbol }));
                };
                return editableNumber;
            }());
        }
    }
});
