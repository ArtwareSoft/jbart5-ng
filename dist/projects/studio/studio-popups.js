System.register(['jb-core', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.showNgComponent', {
                type: 'action',
                impl: {
                    $: 'openDialog',
                    title: 'angular component - %$globals/profile_path%',
                    style: { $: 'dialog.studioFloating', id: 'angular component', width: 600 },
                    features: { $: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}' },
                    content: { $: 'editable-text',
                        databind: { $: 'studio.ngComponent' },
                        style: { $: 'editable-text.codemirror', mode1: 'javascript' },
                    }
                }
            });
            jb_core_1.jb.component('studio.ngComponent', {
                type: 'data',
                params: {
                    path: { as: 'string', defaultValue: '{%$globals/project%}.{%$globals/page%}' }
                },
                impl: function (context, path) {
                    return { $jb_val: function () { return studio.ngComponent(path); } };
                }
            });
            jb_core_1.jb.component('dialog.studioFloating', {
                type: 'dialog.style',
                params: {
                    id: { as: 'string' },
                    width: { as: 'number', default: 300 },
                    height: { as: 'number', default: 100 },
                },
                impl: { $: 'customStyle',
                    $vars: { dialogID: '%$id%' },
                    template: "<div class=\"jb-dialog jb-default-dialog\">\n\t\t\t\t      \t\t  <div class=\"dialog-title\">{{title}}</div>\n\t\t\t\t\t\t\t  <button class=\"dialog-close\" (click)=\"dialogClose()\">&#215;</button>\n\t\t\t\t\t\t\t  <div class=\"jb-dialog-content-parent\">\n\t\t\t\t\t\t  \t \t<div #content></div>\n\t\t\t\t\t\t  \t  </div>\n\t\t\t\t\t\t</div>",
                    features: [
                        { $: 'dialogFeature.dragTitle', id: '%$dialogID%' },
                        { $: 'dialogFeature.uniqueDialog', id: '%$dialogID%', remeberLastLocation: true },
                        { $: 'dialogFeature.maxZIndexOnClick', minZIndex: 5000 },
                        { $: 'studio-dialogFeature.studioPopupLocation' },
                    ],
                    css: "{ position: fixed; \n\t\t\t\t\t\tbackground: #F9F9F9; \n\t\t\t\t\t\twidth: %$width%px; \n\t\t\t\t\t\tmin-height: %$height%px; \n\t\t\t\t\t\toverflow: auto;\n\t\t\t\t\t\tborder-radius: 4px; \n\t\t\t\t\t\tpadding: 0 12px 12px 12px; \n\t\t\t\t\t\tbox-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12)\n\t\t\t\t}\n\t\t\t\t.dialog-title { background: none }\n\t\t\t\t.jb-dialog-content-parent { padding: 8px; overflow-y: scroll; max-height: 500px }\n\t\t\t\t.dialog-close {\n\t\t\t\t\t\tposition: absolute; \n\t\t\t\t\t\tcursor: pointer; \n\t\t\t\t\t\tright: 4px; top: 4px; \n\t\t\t\t\t\tfont: 21px sans-serif; \n\t\t\t\t\t\tborder: none; \n\t\t\t\t\t\tbackground: transparent; \n\t\t\t\t\t\tcolor: #000; \n\t\t\t\t\t\ttext-shadow: 0 1px 0 #fff; \n\t\t\t\t\t\tfont-weight: 700; \n\t\t\t\t\t\topacity: .2;\n\t\t\t\t}\n\t\t\t\t.dialog-close:hover { opacity: .5 }"
                }
            });
            jb_core_1.jb.component('studio-dialogFeature.studioPopupLocation', {
                type: 'dialogFeature',
                impl: function (context) {
                    var dialog = context.vars.$dialog;
                    jb_core_1.jb.bind(dialog, 'attach', function () {
                        if (sessionStorage[dialog.id])
                            return;
                        if (dialog.id == 'studio properties')
                            // dialog.$el.css('top','100px').css('left',(window.outerWidth-320)+'px');
                            dialog.$el.css('top', '110px').css('right', '0px').css('left', 'initial');
                        if (dialog.id == 'studio control tree')
                            dialog.$el.css('top', '0px').css('right', '306px').css('left', 'initial');
                        // dialog.$el.css('top','100px').css('left',(window.outerWidth-320-310)+'px');
                        if (dialog.id == 'studio main window')
                            dialog.$el.css('top', '0px').css('right', '0px').css('left', 'initial');
                        if (dialog.id == 'studio templates')
                            dialog.$el.css('top', '73px').css('right', '0px').css('left', 'initial');
                        if (dialog.id == 'studio template code')
                            dialog.$el.css('bottom', '0px').css('left', '0px').css('top', 'initial');
                        if (dialog.id == 'code-mirror')
                            dialog.$el.css('top', '0px').css('left', '0px');
                        dialog.$el.addClass('default-location');
                    });
                }
            });
        }
    }
});