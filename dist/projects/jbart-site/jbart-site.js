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
                            style: { $: 'layout.flex', direction: 'row' },
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
                                        { $: 'css', css: '{ margin-right: 15px }' },
                                        { $: 'responsive.not-for-phone' }
                                    ]
                                },
                                { $: 'button',
                                    title: 'install from npm',
                                    action: { $: 'openUrl', url: 'https://www.npmjs.com/package/jbart5-ng2' },
                                    style: { $: 'button.md-raised' },
                                    features: [
                                        { $: 'flex-layout-item.align-self', align: 'center' },
                                        { $: 'css', css: '{ margin-right: 15px }' },
                                        { $: 'responsive.not-for-phone' }
                                    ]
                                }
                            ],
                            features: { $: 'css', css: '{ background-color: #009688}' }
                        },
                        { $: 'group',
                            title: 'content',
                            style: { $: 'layout.flex', align: 'center' },
                            controls: [
                                { $: 'rich-text',
                                    text: "<ul>\n              <li>pick &amp; edit (like in Chrome debugger)</li>\n              <li>work by example data</li>\n              <li>smart data/code guidance in context</li>\n              <li>preserve the full power of angular2 &amp; javascript</li>\n              </ul>\n              ",
                                    title: 'Visual Development Concepts',
                                    style: { $: 'customStyle',
                                        template: "<section>\n                <div class=\"title\">%$title%</div>\n                %$text%\n                </section>",
                                        css: ".title { color: #37474F;\n                font-size: 28px;\n                font-weight: 500;\n                line-height: 32px;\n                margin-top: 10px;\n                margin: 0 0 16px 0;\n                opacity: .87;\n                }\n                { font-size: 16px;\n                line-height: 30px;\n                opacity: .87;\n                padding-top: 20px;\n                padding-left: 20px;\n                width: 920px;\n                }"
                                    }
                                }
                            ]
                        },
                        { $: 'group',
                            title: 'jbart header',
                            style: { $: 'layout.flex', align: 'center', direction: undefined, wrap: true },
                            controls: [
                                { $: 'image',
                                    url: 'https://storage.googleapis.com/jbartcommunity/jbart5-material.png',
                                    imageWidth: '330',
                                    imageHeight: '',
                                    units: 'px',
                                    style: { $: 'customStyle',
                                        template: "<div [style.width]=\"width\" [style.height]=\"height\">\n                <img [style.width]=\"imageWidth\" [style.height]=\"imageHeight\" src=\"{{url}}\"/>\n                </div>",
                                        css: '{ padding: 20px } '
                                    },
                                    features: { $: 'css.box-shadow',
                                        blurRadius: '21',
                                        spreadRadius: '7',
                                        shadowColor: '#000000',
                                        opacity: '0.34',
                                        horizontal: '',
                                        vertical: '',
                                        selector: 'img'
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
                        }
                    ]
                }
            });
            jb_core_1.jb.component('jbart-site.bb', {
                type: 'control',
                impl: { $: 'group',
                    title: 'bbb',
                    controls: [
                        { $: 'label',
                            title: 'label',
                            style: { $: 'label.md-card-title' },
                        },
                        { $: 'itemlist-with-heading',
                            title: 'itemlist',
                            items: { $: 'list', items: ['a.1', ''] },
                            controls: [
                                { $: 'label',
                                    title: '%%',
                                    style: { $: 'label.span' }
                                }
                            ],
                            style: { $: 'itemlist.ul-li' },
                            groupBy: { $: 'itemlist-heading.group-by' },
                            headingCtrl: { $: 'label',
                                title: '%title%',
                                style: { $: 'label.md-card-title' }
                            },
                            watchItems: true,
                            itemVariable: 'item',
                            features: [
                                { $: 'css', css: '.jb-item:not(.heading) { margin-left: 30px }' },
                                { $: 'css.height', height: '186', overflow: 'auto' }
                            ]
                        },
                        { $: 'editable-text',
                            style: { $: 'editable-text.md-input' }
                        }
                    ],
                    style: { $: 'group.md-card' }
                }
            });
        }
    }
});
