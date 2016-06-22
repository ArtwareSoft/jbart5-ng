System.register(['jb-core/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            ;
            jb_1.jb.resource('studio-helper', 'group-with-custom-style', { $: 'group',
                title: 'main',
                style: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    css: ".group-item { margin-bottom: %$spacing%px; display: block }\n        .group-item:last-child { margin-bottom:0 }",
                    features: { $: 'group.initGroup' }
                },
                controls: [
                    { $: 'group', title: '2.0', controls: [
                            { $: 'label', title: '2.1' },
                            { $: 'button', title: '2.2' },
                        ]
                    },
                    { $: 'label', title: '1.0' },
                ] });
            jb_1.jb.component('studio-helper.edit-style', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'editable-text',
                            title: 'aaa',
                            databind: '%$group-with-custom-style/title%',
                            style: { $: 'editable-text.input' }
                        },
                        { $: 'tabs',
                            tabs: [
                                { $: 'editable-text',
                                    title: 'css',
                                    databind: '%$group-with-custom-style/style/css%',
                                    style: { $: 'editable-text.codemirror' },
                                    features: { $: 'css', css: '{ width: 700px }' }
                                },
                                { $: 'editable-text',
                                    title: 'template',
                                    databind: '%$group-with-custom-style/style/template%',
                                    style: { $: 'editable-text.codemirror' },
                                    features: { $: 'css', css: '{ width: 700px }' }
                                }
                            ]
                        }
                    ]
                }
            });
            jb_1.jb.component('studio-helper.expandable', {
                type: 'control',
                impl: { $: 'group',
                    title: 'expandable',
                    style: { $: 'group.expandable' },
                    controls: [
                        { $: 'label',
                            title: 'label',
                            style: { $: 'label.span' },
                            features: { $: 'css', css: undefined }
                        },
                        { $: 'button',
                            title: 'Hello',
                            style: { $: 'button.md-flat' }
                        }
                    ]
                }
            });
        }
    }
});
