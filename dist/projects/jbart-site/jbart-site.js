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
            jb_core_1.jb.component('jbart-site.main', {
                type: 'control',
                impl: { $: 'group',
                    title: 'main',
                    controls: [
                        { $: 'group',
                            title: 'site header',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'image',
                                    url: '/projects/studio/css/logo90.png',
                                    imageHeight: '74',
                                    units: 'px',
                                    style: { $: 'image.default' }
                                },
                                { $: 'button',
                                    title: 'preview in github',
                                    style: { $: 'button.md-raised' }
                                }
                            ]
                        },
                        { $: 'group',
                            title: 'jbart header',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'image',
                                    url: 'https://storage.googleapis.com/jbartcommunity/jbart5-material.png',
                                    imageWidth: '500',
                                    imageHeight: '',
                                    units: 'px',
                                    style: { $: 'customStyle',
                                        template: "<div [style.width]=\"width\" [style.height]=\"height\">\n                <img [style.width]=\"imageWidth\" [style.height]=\"imageHeight\" src=\"{{url}}\"/>\n                </div>"
                                    }
                                }
                            ]
                        }
                    ]
                }
            });
            jb_core_1.jb.component('jbart-site.bb', {
                type: 'control',
                impl: { $: 'group', title: 'bb' }
            });
        }
    }
});
