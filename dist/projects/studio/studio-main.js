jb.component('studio.all', {
    type: 'control',
    impl: { $: 'group',
        style: { $: 'layout.vertical', spacing: '0' },
        controls: [
            { $: 'group',
                title: 'top bar',
                style: { $: 'layout.horizontal', spacing: '3' },
                controls: [
                    { $: 'image',
                        url: '/projects/studio/css/logo90.png',
                        imageHeight: '90',
                        units: 'px',
                        style: { $: 'image.default' }
                    },
                    { $: 'group',
                        url: '/projects/studio/css/logo470x200.png',
                        title: 'title and menu',
                        style: { $: 'layout.vertical', spacing: '16' },
                        controls: [
                            { $: 'label',
                                title: 'message',
                                style: { $: 'label.studio-message' }
                            },
                            { $: 'label',
                                title: { $: 'replace',
                                    find: '_',
                                    replace: ' ',
                                    text: '{%$globals/project%}'
                                },
                                style: { $: 'label.span' },
                                features: { $: 'css',
                                    css: '{ font: 20px Arial; margin-left: 6px; margin-top: 20px}'
                                }
                            },
                            { $: 'group',
                                style: { $: 'layout.flex', align: 'space-between' },
                                controls: [
                                    { $: 'studio.main-menu' },
                                    { $: 'studio.toolbar' }
                                ],
                                features: { $: 'css.width', width: '1040' }
                            }
                        ],
                        features: { $: 'css', css: '{ padding-left: 18px; width: 100% }' }
                    }
                ],
                features: { $: 'css', css: '{ height: 90px; border-bottom: 1px #d9d9d9 solid}' }
            },
            { $: 'group',
                title: 'preview',
                controls: { $: 'studio.renderWidget' },
                features: { $: 'css.class', class: 'studio-widget-placeholder' }
            },
            { $: 'group',
                title: 'pages',
                style: { $: 'layout.horizontal' },
                controls: [
                    { $: 'button',
                        title: 'new page',
                        action: { $: 'studio.open-new-page' },
                        style: { $: 'button.mdl-icon-12', icon: 'add' },
                        features: { $: 'css', css: 'button {margin-top: 2px}' }
                    },
                    { $: 'itemlist',
                        items: { $: 'studio.project-pages' },
                        controls: { $: 'label',
                            title: { $: 'extractSuffix', separator: '.' },
                            features: { $: 'css.class', class: 'studio-page' }
                        },
                        features: [
                            { $: 'itemlist.selection',
                                databind: '%$globals/page%',
                                onSelection: { $: 'onNextTimer',
                                    action: [
                                        { $: 'writeValue',
                                            to: '%$globals/profile_path%',
                                            value: '{%$globals/project%}.{%$globals/page%}'
                                        },
                                    ]
                                },
                                autoSelectFirst: true
                            },
                            { $: 'css',
                                css: "{ list-style: none; padding: 0; margin: 0; margin-left: 20px; font-family: \"Arial\"}\n                  li { list-style: none; display: inline-block; padding: 6px 10px; font-size: 12px; border: 1px solid transparent; cursor: pointer;}\n                  li label { cursor: inherit; }\n                  li.selected { background: #fff;  border: 1px solid #ccc;  border-top: 1px solid transparent; color: inherit;  }"
                            }
                        ]
                    }
                ],
                features: [
                    { $: 'css.class', class: 'studio-footer' },
                    { $: 'group.wait',
                        for: { $: 'studio.waitForPreviewIframe' },
                        loadingControl: { $label: '...' }
                    },
                    { $: 'feature.after-load',
                        action: {
                            $runActions: [
                                { $: 'studio.waitForPreviewIframe' },
                                { $: 'studio.setPreviewSize', width: 1280, height: 520 }
                            ]
                        }
                    }
                ]
            }
        ],
        features: [
            { $: 'group.watch', data: '%$globals/project%' },
            { $: 'feature.init',
                action: { $: 'rx.url-path',
                    params: ['project', 'page', 'profile_path'],
                    databind: '%$globals%',
                    base: 'studio',
                    onUrlChange: { $: 'studio.refresh-preview' }
                }
            }
        ]
    }
});
jb.component('studio.jbart-logo', {
    type: 'control',
    impl: { $: 'custom-control',
        template: '<div style="padding: 60px 30px 30px 30px;background-color: #327DC8;zoom: 20%;"> <span style="position: absolute;margin-top:20px;margin-left:50px; color: white; font-size: 127px; font-family: Times New Roman, Times, serif">jB</span>  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="215px" height="228px" viewBox="0 0 215 228" preserveAspectRatio="xMidYMid meet" zoomAndPan="disable" xmlns:svg="http://www.w3.org/2000/svg"> <polygon points="106 0 0   38 17  178 106 228" fill="#DE3641"></polygon> <polygon points="106 0 215 38 198 178 106 228" fill="#B13138"></polygon> </svg> </div>'
    }
});
jb.component('studio.currentProfilePath', {
    impl: { $firstSucceeding: ['%$simulateProfilePath%', '%$globals/profile_path%', '%$globals/project%.%$globals/page%'] }
});
jb.component('studio.is-single-test', {
    type: 'boolean',
    impl: function (ctx) {
        var page = location.href.split('/')[6];
        var profile_path = location.href.split('/')[7];
        return page == 'tests' && profile_path && profile_path.slice(-6) != '.tests';
    }
});
jb.component('studio.cmps-of-project', {
    type: 'data',
    params: [
        { id: 'project', as: 'string' }
    ],
    impl: function (ctx, prj) {
        return Object.getOwnPropertyNames(jbart.previewjbart.comps)
            .filter(function (id) { return id.split('.')[0] == prj; });
    }
});
jb.component('studio.project-pages', {
    type: 'data',
    impl: { $pipeline: [
            { $: 'studio.cmps-of-project', project: '%$globals/project%' },
            { $filter: { $: 'studio.is-of-type', type: 'control', path: '%%' } },
            { $: 'suffix', separator: '.' }
        ] }
});
