System.register(['js/jb', 'ui/jb-ui', 'ui/jb-ui-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui, ui_utils;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (ui_utils_1) {
                ui_utils = ui_utils_1;
            }],
        execute: function() {
            jb_1.jb.component('addCssClass', {
                type: 'action',
                params: {
                    cssClass: { as: 'string' }
                },
                impl: function (context, cssClass) {
                    if (context.vars.control && context.vars.control.$el)
                        context.vars.control.$el.addClass(cssClass);
                }
            });
            jb_1.jb.component('setText', {
                type: 'action',
                params: {
                    text: { as: 'string' },
                    controlID: { as: 'string' }
                },
                impl: function (context, text, controlID) {
                    var elem = ui_utils.findControlElement(context.vars.control.$el[0], controlID);
                    if (!elem)
                        return;
                    var input = $(elem).findIncludeSelf('input,textarea')[0];
                    if (input) {
                        $(input).val(text);
                        input.jbUpdated && input.jbUpdated();
                    }
                }
            });
            jb_1.jb.component('urlParam', {
                type: 'data',
                params: {
                    param: { as: 'string' }
                },
                impl: function (context, param) {
                    return ui_utils.urlParam(param);
                }
            });
            jb_1.jb.component('url', {
                type: 'data',
                impl: function (context, param) {
                    ui_utils.listenToUrlChange();
                    return window.location.href;
                }
            });
            jb_1.jb.component('urlHashParam', {
                type: 'data',
                params: {
                    param: { as: 'string' }
                },
                impl: function (context, param) {
                    if (!jbart.classes.urlHashParam) {
                        jbart.classes.urlHashParam = function (param) { this.param = this.$jb_property = param; this.type = 'urlHashParam'; };
                        jbart.classes.urlHashParam.prototype.$jb_val = function (val) { return ui_utils.urlHashParam(this.param, typeof val == 'undefined' ? undefined : jb_1.jb.tostring(val)); };
                        jbart.classes.urlHashParam.prototype.$jb_equals = function (other) { return other && other.type == this.type && other.param == this.param; };
                    }
                    return new jbart.classes.urlHashParam(param);
                }
            });
            jb_1.jb.component('runDOMEvent', {
                type: 'action',
                params: {
                    eventType: { as: 'string' },
                    on: { as: 'string' }
                },
                impl: function (context, eventType, on) {
                    context.vars.control.$(on).trigger(eventType);
                }
            });
            jb_1.jb.component('htmlContainsText', {
                params: {
                    text: { type: 'data[]', as: 'array' }
                },
                impl: function (context, text) {
                    var htmlText = context.data;
                    if (context.data.innerHTML) {
                        $htmlText = $(htmlText).clone();
                        $htmlText.find('input,textarea').each(function () {
                            this.setAttribute('jb-test-val', this.value);
                        });
                        $htmlText.find('*').each(function () { if (this.style.display == 'none')
                            $(this).remove(); });
                        var div = $('<div/>').append($htmlText)[0];
                        htmlText = div.innerHTML;
                    }
                    var lastPos = 0;
                    for (var i = 0; i < text.length; i++)
                        if ((lastPos = htmlText.indexOf(text[i], lastPos)) == -1)
                            return false;
                    return true;
                }
            });
            jb_1.jb.component('sessionStorage', {
                params: {
                    key: { as: 'string' }
                },
                impl: function (context, key) {
                    return {
                        $jb_val: function (value) {
                            if (typeof value == 'undefined')
                                return sessionStorage[key];
                            else
                                sessionStorage[key] = jb_1.jb.tostring(value);
                        }
                    };
                }
            });
            jb_1.jb.component('openUrl', {
                type: 'action',
                params: {
                    url: { as: 'string' },
                    target: { type: 'enum', values: ['new tab', 'self'], defaultValue: 'new tab', as: 'string' }
                },
                impl: function (context, url, target) {
                    var _target = (target == 'new tab') ? '_blank' : '_self';
                    window.open(url, _target);
                }
            });
            jb_1.jb.component('apply', {
                type: 'action',
                impl: jb_ui.apply
            });
        }
    }
});
//# sourceMappingURL=ui-common.js.map