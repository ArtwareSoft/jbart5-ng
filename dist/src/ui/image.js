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
            jb_core_1.jb.type('image.style');
            jb_core_1.jb.component('image', {
                type: 'control',
                params: {
                    url: { as: 'string', dynamic: true },
                    imageWidth: { as: 'number' },
                    imageHeight: { as: 'number' },
                    width: { as: 'number' },
                    height: { as: 'number' },
                    units: { as: 'string', defaultValue: 'px' },
                    style: { type: 'image.style', dynamic: true, defaultValue: { $: 'image.default' } },
                    features: { type: 'feature[]', dynamic: true }
                },
                impl: function (context) {
                    return jb_ui.ctrl(context).jbExtend({ init: function (cmp) {
                            var image = context.params;
                            var units = image.units;
                            if (image.width)
                                cmp.width = image.width + units;
                            if (image.height)
                                cmp.height = image.height + units;
                            if (image.imageWidth)
                                cmp.imageWidth = image.imageWidth + units;
                            if (image.imageHeight)
                                cmp.imageHeight = image.imageHeight + units;
                            cmp.url = image.url();
                        } }, context);
                }
            });
            jb_core_1.jb.component('image.default', {
                type: 'image.style',
                impl: { $: 'customStyle',
                    template: "<div [style.width]=\"width\" [style.height]=\"height\">\n\t\t\t               <img [style.width]=\"imageWidth\" [style.height]=\"imageHeight\" src=\"{{url}}\"/>\n\t\t\t           </div>",
                }
            });
        }
    }
});
