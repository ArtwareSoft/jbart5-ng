System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('property-sheet.titles-above', {
                type: 'group.style',
                params: [
                    { id: 'spacing', as: 'number', defaultValue: 20 }
                ],
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div>\n      <div *ngFor=\"let ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\">{{ctrl.title}}</label>\n        <div *jbComp=\"ctrl.comp\"></div>\n      </div>\n      </div>\n    ",
                    css: ".property { margin-bottom: %$spacing%px }\n      .property:last-child { margin-bottom:0 }\n      .property>.property-title {\n        width:100px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n      }\n      .property>div { display:inline-block }"
                }
            });
            jb_core_1.jb.component('property-sheet.titles-above-float-left', {
                type: 'group.style',
                params: [
                    { id: 'spacing', as: 'number', defaultValue: 20 },
                    { id: 'fieldWidth', as: 'number', defaultValue: 200 },
                ],
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div>\n        <div *ngFor=\"let ctrl of ctrls\" class=\"property\">\n          <label class=\"property-title\">{{ctrl.title}}</label>\n          <div *jbComp=\"ctrl.comp\"></div>\n        </div>\n        <div class=\"clearfix\"></div>\n      </div>\n    ",
                    css: ".property { \n          float: left;\n          width: %$fieldWidth%px;\n          margin-right: %$spacing}%px \n        }\n      .clearfix { clear: both }\n      .property:last-child { margin-right:0 }\n      .property>.property-title {\n        margin-bottom: 3px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        font-size:14px;\n      }",
                }
            });
            jb_core_1.jb.component('property-sheet.titles-left', {
                type: 'group.style',
                params: [
                    { id: 'vSpacing', as: 'number', defaultValue: 20 },
                    { id: 'hSpacing', as: 'number', defaultValue: 20 },
                    { id: 'titleWidth', as: 'number', defaultValue: 100 },
                ],
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div>\n      <div *ngFor=\"let ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\">{{ctrl.title}}</label>\n        <div *jbComp=\"ctrl.comp\" class=\"property-ctrl\"></div>\n      </div>\n    </div>",
                    css: ".property { margin-bottom: %$vSpacing%px; display: flex }\n      .property:last-child { margin-bottom:0px }\n      .property>.property-title {\n        width: %$titleWidth%px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n        margin-right: %$hSpacing%px;\n      }\n      .property>*:last-child { margin-right:0 }"
                }
            });
            jb_core_1.jb.component('property-sheet.style-on-focus', {
                type: 'group.style',
                params: [
                    { id: 'vSpacing', as: 'number', defaultValue: 20 },
                    { id: 'hSpacing', as: 'number', defaultValue: 20 },
                    { id: 'titleWidth', as: 'number', defaultValue: 100 },
                ],
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    methods: {
                        init: function (ctx) { return function (cmp) {
                            cmp.getComp = function (ctrl) {
                                return ctrl.jb_focused && ctrl.jb_focusedComp ? ctrl.jb_focusedComp : ctrl.comp;
                            };
                        }; },
                        afterViewInit: function (ctx) { return function (cmp) {
                            cmp.ctrls.forEach(function (ctrl) {
                                if (ctrl.comp.jb_styleOnFocus) {
                                    var cmp_prof = jb_core_1.jb.extend({}, ctrl.comp.jb_profile, {
                                        style: ctrl.comp.jb_styleOnFocus
                                    });
                                    ctrl.jb_focusedComp = cmp.ctx.run(cmp_prof);
                                }
                            });
                            jb_core_1.jb.delay(1).then(function () {
                                function handleFocus(e) {
                                    var property = $(e.target).parents().filter('.property');
                                    var index = property.index();
                                    // avoid infinite loop
                                    if (cmp.ctrls[index] && cmp.ctrls[index].jb_focused)
                                        return;
                                    // mark comp as focused and clean the sibling marking
                                    cmp.ctrls.forEach(function (ctrl) { return ctrl.jb_focused = false; });
                                    cmp.ctrls[index].jb_focused = true;
                                    // probably the input element will be replaced on next timer. rebind and refocus
                                    $(cmp.elementRef.nativeElement).find('input,select,textarea')
                                        .unbind('focus', handleFocus);
                                    jb_core_1.jb.delay(1).then(function () {
                                        $(cmp.elementRef.nativeElement).find('input,select,textarea')
                                            .bind('focus', handleFocus);
                                        property.find('input,select,textarea').focus(); // no infinite loop
                                    });
                                }
                                ;
                                $(cmp.elementRef.nativeElement).find('input,select,textarea')
                                    .bind('focus', handleFocus);
                            });
                        }; }
                    },
                    template: "<div>\n      <div *ngFor=\"let ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\">{{ctrl.title}}</label>\n        <div class=\"input-and-toolbar\">\n          <div *jbComp=\"getComp(ctrl)\"></div>\n          <div *jbComp=\"ctrl.comp.jb_toolbar\" class=\"toolbar\"></div>\n        </div>\n      </div>\n      </div>\n    ",
                    css: ".property { margin-bottom: %$vSpacing%px; display: flex; position: relative; height: 20px }\n      .focused .input-and-toolbar { zoom: 150%; position: absolute; z-index: 500; transition: zoom 2s}\n      .input-and-toolbar { display: flex;margin-right:0;  }\n      .property:last-child { margin-bottom:0px }\n      .property>.property-title {\n        width: %$titleWidth%px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n        margin-right: %$hSpacing%px;"
                }
            });
            jb_core_1.jb.component('property-sheet.growing', {
                type: 'group.style',
                params: [
                    { id: 'vSpacing', as: 'number', defaultValue: 20 },
                    { id: 'hSpacing', as: 'number', defaultValue: 20 },
                    { id: 'titleWidth', as: 'number', defaultValue: 100 },
                ],
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    methods: {
                        afterViewInit: function (ctx) { return function (cmp) {
                            return jb_core_1.jb.delay(1).then(function () {
                                return $(cmp.elementRef.nativeElement).find('input,select,textarea')
                                    .focus(function (e) {
                                    var property = $(e.target).parents().filter('.property');
                                    property.siblings().each(function (i, el) { return $(el).removeClass('focused'); });
                                    property.addClass('focused');
                                });
                            });
                        }; }
                    },
                    template: "<div>\n      <div *ngFor=\"let ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\">{{ctrl.title}}</label>\n        <div class=\"input-and-toolbar\">\n          <div *jbComp=\"ctrl.comp\"></div>\n          <div *jbComp=\"ctrl.comp.jb_toolbar\" class=\"toolbar\"></div>\n        </div>\n      </div>\n      </div>\n    ",
                    css: ".property { margin-bottom: %$vSpacing%px; display: flex; position: relative; height: 20px }\n      .focused .input-and-toolbar { zoom: 150%; position: absolute; z-index: 500; transition: zoom 2s}\n      .input-and-toolbar { display: flex;margin-right:0;  }\n      .property:last-child { margin-bottom:0px }\n      .property>.property-title {\n        width: %$titleWidth%px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n        margin-right: %$hSpacing%px;"
                }
            });
        }
    }
});
