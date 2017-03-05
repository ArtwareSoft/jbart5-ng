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
            jb_core_1.jb.component('studio.open-multiline-edit', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: {
                    $: 'openDialog',
                    style: { $: 'dialog.studio-multiline-edit' },
                    content: { $: 'editable-text',
                        databind: { $: 'studio.ref', path: '%$path%' },
                        style: { $: 'editable-text.codemirror',
                            mode: { $: 'studio.code-mirror-mode', path: '%$path%' }
                        },
                        features: { $: 'studio.undo-support', path: '%$path%' },
                    }
                }
            });
            jb_core_1.jb.component('dialog.studio-floating', {
                type: 'dialog.style',
                params: [
                    { id: 'id', as: 'string' },
                    { id: 'width', as: 'number', default: 300 },
                    { id: 'height', as: 'number', default: 100 },
                ],
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-dialog jb-default-dialog\" {?dialogId=\"%$id%\"?}>\n\t\t\t\t      \t\t  <div class=\"dialog-title noselect\">{{title}}</div>\n\t\t\t\t      \t\t  <div *ngIf=\"hasMenu\" class=\"dialog-menu\">\n\t\t\t\t      \t\t  \t<div *jbComp=\"menuComp\"></div>\n\t\t\t\t      \t\t  </div>\n\t\t\t\t\t\t\t  <button class=\"dialog-close\" (click)=\"dialogClose()\">&#215;</button>\n\t\t\t\t\t\t\t  <div class=\"jb-dialog-content-parent\">\n\t\t\t\t\t              <div *jbComp=\"contentComp\"></div>\n\t\t\t\t\t\t  \t  </div>\n\t\t\t\t\t\t</div>",
                    features: [
                        { $: 'dialog-feature.dragTitle', id: '%$id%' },
                        { $: 'dialog-feature.uniqueDialog', id: '%$id%', remeberLastLocation: true },
                        { $: 'dialog-feature.maxZIndexOnClick', minZIndex: 5000 },
                        { $: 'studio-dialog-feature.studioPopupLocation' },
                    ],
                    css: ".jb-dialog { position: fixed;\n\t\t\t\t\t\tbackground: #F9F9F9; \n\t\t\t\t\t\twidth: %$width%px; \n\t\t\t\t\t\tmax-width: 800px;\n\t\t\t\t\t\tmin-height: %$height%px; \n\t\t\t\t\t\toverflow: auto;\n\t\t\t\t\t\tborder-radius: 4px; \n\t\t\t\t\t\tpadding: 0 12px 12px 12px; \n\t\t\t\t\t\tbox-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12)\n\t\t\t\t}\n\t\t\t\t.dialog-title { background: none; padding: 10px 5px; }\n\t\t\t\t.jb-dialog-content-parent { padding: 0; overflow-y: auto; max-height1: 500px }\n\t\t\t\t.dialog-close {\n\t\t\t\t\t\tposition: absolute; \n\t\t\t\t\t\tcursor: pointer; \n\t\t\t\t\t\tright: 4px; top: 4px; \n\t\t\t\t\t\tfont: 21px sans-serif; \n\t\t\t\t\t\tborder: none; \n\t\t\t\t\t\tbackground: transparent; \n\t\t\t\t\t\tcolor: #000; \n\t\t\t\t\t\ttext-shadow: 0 1px 0 #fff; \n\t\t\t\t\t\tfont-weight: 700; \n\t\t\t\t\t\topacity: .2;\n\t\t\t\t}\n\t\t\t\t.dialog-menu {\n\t\t\t\t\t\tposition: absolute; \n\t\t\t\t\t\tcursor: pointer; \n\t\t\t\t\t\tright: 24px; top: 0; \n\t\t\t\t\t\tfont: 21px sans-serif; \n\t\t\t\t\t\tborder: none; \n\t\t\t\t\t\tbackground: transparent; \n\t\t\t\t\t\tcolor: #000; \n\t\t\t\t\t\ttext-shadow: 0 1px 0 #fff; \n\t\t\t\t\t\tfont-weight: 700; \n\t\t\t\t\t\topacity: .2;\n\t\t\t\t}\n\t\t\t\t.dialog-close:hover { opacity: .5 }"
                }
            });
            jb_core_1.jb.component('studio-dialog-feature.studioPopupLocation', {
                type: 'dialog-feature',
                impl: function (context) {
                    return {
                        afterViewInit: function (cmp) {
                            var dialog = cmp.dialog;
                            if (!sessionStorage[dialog.id])
                                dialog.$el.addClass(dialog.id).addClass('default-location');
                        }
                    };
                }
            });
            jb_core_1.jb.component('studio.code-mirror-mode', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (ctx, path) {
                    if (path.match(/css/))
                        return 'css';
                    if (path.match(/template/) || path.match(/html/))
                        return 'htmlmixed';
                    return 'javascript';
                }
            });
            jb_core_1.jb.component('studio.open-responsive-phone-popup', {
                type: 'action',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'openDialog',
                    style: { $: 'dialog.studio-floating', id: 'responsive' },
                    content: { $: 'tabs',
                        tabs: { $: 'dynamic-controls',
                            controlItems: {
                                $asIs: [
                                    {
                                        width: { min: 320, max: 479, default: 400 },
                                        height: { min: 300, max: 700, default: 600 },
                                        id: 'phone'
                                    },
                                    {
                                        width: { min: 480, max: 1024, default: 600 },
                                        height: { min: 300, max: 1440, default: 850 },
                                        id: 'tablet'
                                    },
                                    {
                                        width: { min: 1024, max: 2048, default: 1280 },
                                        height: { min: 300, max: 1440, default: 520 },
                                        id: 'desktop'
                                    }
                                ]
                            },
                            genericControl: { $: 'group',
                                title: '%$controlItem/id%',
                                style: { $: 'property-sheet.titles-above' },
                                controls: [
                                    { $: 'editable-number',
                                        databind: '%$globals/responsive/{%$controlItem/id%}/width%',
                                        title: 'width',
                                        style: { $: 'editable-number.slider' },
                                        min: '%$controlItem/width/min%',
                                        max: '%$controlItem/width/max%',
                                        features: [
                                            { $: 'field.default', value: '%$controlItem/width/default%' },
                                            { $: 'field.subscribe',
                                                action: { $: 'studio.setPreviewSize', width: '%%' },
                                                includeFirst: true
                                            }
                                        ]
                                    },
                                    { $: 'editable-number',
                                        databind: '%$globals/responsive/{%$controlItem/id%}/height%',
                                        title: 'height',
                                        style: { $: 'editable-number.slider' },
                                        min: '%$controlItem/height/min%',
                                        max: '%$controlItem/height/max%',
                                        features: [
                                            { $: 'field.default', value: '%$controlItem/height/default%' },
                                            { $: 'field.subscribe',
                                                action: { $: 'studio.setPreviewSize', height: '%%' },
                                                includeFirst: true
                                            }
                                        ]
                                    }
                                ],
                                features: [{ $: 'css', css: '{ padding-left: 12px; padding-top: 7px }' }]
                            }
                        },
                        style: { $: 'tabs.simple' }
                    },
                    title: 'responsive'
                }
            });
        }
    }
});
