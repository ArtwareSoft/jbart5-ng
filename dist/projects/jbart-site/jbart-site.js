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
                    style: { $: 'layout.vertical', spacing: '' },
                    controls: [
                        { $: 'group',
                            title: 'site header',
                            style: { $: 'layout.flex' },
                            controls: [
                                { $: 'image',
                                    url: '/projects/studio/css/logo90-green.png',
                                    imageHeight: '74',
                                    units: 'px',
                                    style: { $: 'image.default' }
                                },
                                { $: 'divider',
                                    style: { $: 'divider.flex-auto-grow' },
                                    title: 'divider'
                                },
                                { $: 'button',
                                    title: 'preview in github',
                                    action: { $: 'openUrl', url: 'https://github.com/ArtwareSoft/jbart5-ng' },
                                    style: { $: 'button.md-raised' },
                                    features: [
                                        { $: 'flex-layout-item.align-self', align: 'center' },
                                        { $: 'css', css: '{ margin-right: 15px }' }
                                    ]
                                },
                                { $: 'button',
                                    title: 'install from npm',
                                    action: { $: 'openUrl', url: 'https://www.npmjs.com/package/jbart5-ng2' },
                                    style: { $: 'button.md-raised' },
                                    features: [
                                        { $: 'flex-layout-item.align-self', align: 'center' },
                                        { $: 'css', css: '{ margin-right: 15px }' }
                                    ]
                                }
                            ],
                            features: { $: 'css', css: '{ background-color: #009688}' }
                        },
                        { $: 'group',
                            title: 'jbart header',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'image',
                                    url: 'https://storage.googleapis.com/jbartcommunity/jbart5-material.png',
                                    imageWidth: '400',
                                    imageHeight: '',
                                    units: 'px',
                                    style: { $: 'customStyle',
                                        template: "<div [style.width]=\"width\" [style.height]=\"height\">\n                <img [style.width]=\"imageWidth\" [style.height]=\"imageHeight\" src=\"{{url}}\"/>\n                </div>",
                                        css: '{ padding: 20px }'
                                    }
                                },
                                { $: 'group',
                                    title: 'header text',
                                    style: { $: 'layout.vertical', spacing: '19' },
                                    controls: [
                                        { $: 'label',
                                            title: 'Visual Development with angular2',
                                            style: { $: 'label.span' },
                                            features: { $: 'css',
                                                css: "{ font-family: \"Roboto\",\"Helvetica\",\"Arial\",sans-serif ;\n                    font-size: 30px;\n                    font-weight: 400;\n                    }"
                                            }
                                        },
                                        { $: 'text',
                                            text: 'Visual development was broken in the world of web development, mostly because pre-defined visual components could not be re-used anymore. The industry accepts the fact that complex web apps can be developed only textually. ',
                                            style: { $: 'text.paragraph' },
                                            title: 'text'
                                        },
                                        { $: 'text',
                                            text: 'jBart suggests a revolutionary approach for visual development of complex apps that actually works. ',
                                            style: { $: 'text.paragraph' },
                                            title: 'text'
                                        }
                                    ],
                                    features: { $: 'css',
                                        css: '{ max-width: 500px; padding: 30px 10px; color: white }'
                                    }
                                }
                            ],
                            features: { $: 'css', css: '{ background: #008577}' }
                        },
                        { $: 'group',
                            title: 'content',
                            style: { $: 'group.section' },
                            controls: [
                                { $: 'rich-text',
                                    text: "<ul>\n              <li>pick &amp; edit (like in Chrome debugger)</li>\n              <li>work by example data</li>\n              <li>smart data/code guidance in context</li>\n              <li>preserve the full power of angular2 &amp; javascript</li>\n              </ul>\n              ",
                                    title: 'Visual Development Concepts',
                                    style: { $: 'customStyle',
                                        template: "<section>\n                <div class=\"title\">%$title%</div>\n                %$text%\n                </section>",
                                        css: '.title {  color: #37474F;                font-size: 28px;                font-weight: 500;                line-height: 32px;                margin-top: 10px;                margin: 0 0 16px 0;                opacity: .87;}                {                font-size: 16px;                line-height: 30px;                opacity: .87;                }'
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
