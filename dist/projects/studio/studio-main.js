System.register(['jb-core', 'jb-ui', '@angular/platform-browser', '@angular/core', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var jb_core_1, jb_ui, platform_browser_1, core_1, studio_utils_1;
    function waitForIframeLoad(iframe) {
        if (!iframe)
            debugger;
        return new Promise(function (resolve, fail) {
            var counter = 300;
            var intervalID = setInterval(function () {
                if (jb_core_1.jb.path(iframe, ['contentWindow', 'jbart', 'widgetLoaded'])) {
                    window.clearInterval(intervalID);
                    resolve();
                }
                if (--counter <= 0) {
                    window.clearInterval(intervalID);
                    fail();
                }
            }, 100);
        });
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            }],
        execute: function() {
            //jbart.studio = jbart.studio || {}
            jb_core_1.jb.component('studio.all', {
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
                                    style: { $: 'layout.vertical', spacing: '14' },
                                    controls: [
                                        { $: 'label',
                                            title: 'message',
                                            style: { $: 'customStyle',
                                                template: '<span class="studio-message">{{title}}</span> ',
                                                css: "{ position: absolute;\n                    color: white;  padding: 20px;  background: #327DC8;\n                    width: 1000px;\n                    margin-top: -100px;\n                    }\n                    ",
                                                features: { $: 'label.bind-title' }
                                            }
                                        },
                                        { $: 'label',
                                            title: [
                                                '{%$globals/project%}',
                                                { $: 'replace', find: '_', replace: ' ' }
                                            ],
                                            style: { $: 'label.span' },
                                            features: { $: 'css',
                                                css: '{ font: 20px Arial; margin-left: 6px; margin-top: 20px}'
                                            }
                                        },
                                        { $: 'group',
                                            style: { $: 'layout.horizontal', spacing: 3 },
                                            controls: [
                                                { $: 'studio.main-menu' },
                                                { $: 'studio.toolbar' }
                                            ]
                                        }
                                    ],
                                    features: { $: 'css', css: '{ padding-left: 18px; width: 100% }' }
                                }
                            ],
                            features: { $: 'css', css: '{ height: 90px; border-bottom: 1px #d9d9d9 solid}' }
                        },
                        { $: 'group',
                            cssClass: 'studio-widget-placeholder',
                            title: 'preview',
                            controls: { $: 'studio.renderWidget' }
                        },
                        { $: 'group',
                            cssClass: 'studio-footer',
                            title: 'pages',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'button',
                                    title: 'new page',
                                    action: { $: 'studio.openNewPage' },
                                    style: { $: 'button.md-icon-12', icon: 'add' },
                                    features: { $: 'css', css: 'button {margin-top: 2px}' }
                                },
                                { $: 'itemlist',
                                    items: { $: 'studio.projectPages' },
                                    controls: { $: 'label',
                                        cssClass: 'studio-page',
                                        title: { $: 'extractSuffix', separator: '.' }
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
                                                    { $: 'studio.open-properties' },
                                                    { $: 'studio.open-control-tree' }
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
                                { $: 'group.wait',
                                    for: { $: 'studio.waitForPreviewIframe' },
                                    loadingControl: { $label: '...' }
                                },
                                { $: 'feature.afterLoad',
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
                            action: { $: 'rx.urlPath',
                                params: ['project', 'page', 'profile_path'],
                                databind: '%$globals%',
                                base: 'studio',
                                zoneId: 'studio.all'
                            }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.jbart-logo', {
                type: 'control',
                impl: { $: 'custom-control',
                    template: '<div style="padding: 60px 30px 30px 30px;background-color: #327DC8;zoom: 20%;"> <span style="position: absolute;margin-top:20px;margin-left:50px; color: white; font-size: 127px; font-family: Times New Roman, Times, serif">jB</span>  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="215px" height="228px" viewBox="0 0 215 228" preserveAspectRatio="xMidYMid meet" zoomAndPan="disable" xmlns:svg="http://www.w3.org/2000/svg"> <polygon points="106 0 0   38 17  178 106 228" fill="#DE3641"></polygon> <polygon points="106 0 215 38 198 178 106 228" fill="#B13138"></polygon> </svg> </div>'
                }
            });
            jb_core_1.jb.component('studio.currentProfilePath', {
                impl: { $firstSucceeding: ['%$simulateProfilePath%', '%$globals/profile_path%', '%$globals/project%.%$globals/page%'] }
            });
            jb_core_1.jb.component('studio.is-single-test', {
                type: 'boolean',
                impl: function (ctx) {
                    var page = location.href.split('/')[6];
                    var profile_path = location.href.split('/')[7];
                    return page == 'tests' && profile_path && profile_path.slice(-6) != '.tests';
                }
            });
            jb_core_1.jb.component('studio.projectPages', {
                type: 'data',
                impl: ['%$window.jbart.previewjbart.comps%',
                    { $: 'objectProperties' },
                    { $filter: { $: 'equals', item1: '%$globals/project%', item2: { $: 'prefix', separator: '.' } } },
                    { $filter: { $: 'studio.is-of-type', type: 'control', path: '%%' } },
                    { $: 'suffix', separator: '.' }
                ]
            });
            // 	impl2: function(context) {
            // 		var projectName = context.exp('{%$globals/project%}');
            // 		if (!jbart.previewjbart) return [];
            // 		var out = [];
            // 		for(var i in jbart.previewjbart.comps)
            // 			if (i.indexOf(projectName+'.') == 0 && jbart.previewjbart.comps[i].type == 'control')
            // 				out.push(i.split(projectName+'.')[1]);
            // 		return out;
            // 	}
            // })
            jb_core_1.jb.component('studio.renderWidget', {
                type: 'control',
                impl: function (ctx) {
                    var previewIframe = (function () {
                        function previewIframe(sanitizer, elementRef) {
                            this.sanitizer = sanitizer;
                            this.elementRef = elementRef;
                        }
                        previewIframe.prototype.ngOnInit = function () {
                            var cmp = this;
                            cmp.project = ctx.exp('%$globals/project%');
                            cmp.project_url = cmp.sanitizer.bypassSecurityTrustResourceUrl('/project/' + cmp.project);
                            if (!cmp.project)
                                debugger;
                            var iframe = cmp.elementRef.nativeElement.firstElementChild;
                            window.jb_studio_window = true; // let studio widgets run in a special mode
                            waitForIframeLoad(iframe).then(function () {
                                var w = iframe.contentWindow;
                                w.jbart.studioWindow = window;
                                w.jbart.studioGlobals = ctx.exp('{%$globals%}');
                                w.jbart.modifyOperationsEm = studio_utils_1.modifyOperationsEm;
                                w.jbart.studioActivityEm = studio_utils_1.studioActivityEm;
                                w.jbart.studioModifiedCtrlsEm = jbart.modifiedCtrlsEm;
                                w.jbart.profileFromPath = jbart.profileFromPath;
                                jbart.previewWindow = w;
                                jbart.previewjbart = w.jbart;
                                jbart.preview_jbart_widgets = w.jbart_widgets;
                                document.title = cmp.project + ' with jBart';
                                //						jbart.previewjbart.comps[cmp.project + '.tests'] = jbart.previewjbart.comps['ui-tests.show-project-tests'];
                                // forward the studio zone to the preview widget so it will be updated
                                jb_ui.getZone('studio.all').then(function (zone) {
                                    zone.onStable.subscribe(function () {
                                        w.jbart.studioGlobals = ctx.exp('{%$globals%}');
                                        studio_utils_1.studioActivityEm.next();
                                        //console.log('studio.all stable');
                                        // refresh preview
                                        jb_core_1.jb.entries(w.jbart.zones).forEach(function (x) { return x[1].run(function () { }); });
                                        //w.setTimeout(()=>{},1); 
                                    });
                                });
                                jb_core_1.jb.trigger(jbart, 'preview_loaded');
                            });
                        };
                        previewIframe = __decorate([
                            core_1.Component({
                                selector: 'previewIframe',
                                template: "<iframe sandbox=\"allow-same-origin allow-forms allow-scripts\" style=\"box-shadow:  2px 2px 6px 1px gray; margin-left: 2px; margin-top: 2px\"\n\t\t\t\t\tseamless=\"\" id=\"jb-preview\" frameborder=\"0\" [src]=\"project_url\"></iframe>",
                            }), 
                            __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService, core_1.ElementRef])
                        ], previewIframe);
                        return previewIframe;
                    }());
                    previewIframe.jb_title =
                        function () { return 'previewIframe'; };
                    return previewIframe;
                }
            });
            jb_core_1.jb.component('studio.setPreviewSize', {
                type: 'action',
                params: [
                    { id: 'width', as: 'number' },
                    { id: 'height', as: 'number' },
                ],
                impl: function (ctx, width, height) {
                    if (width)
                        $('#jb-preview').width(width);
                    if (height)
                        $('#jb-preview').height(height);
                }
            });
            jb_core_1.jb.component('studio.waitForPreviewIframe', {
                type: 'action',
                impl: function (context) {
                    if (jbart.previewjbart)
                        return;
                    return new Promise(function (resolve) {
                        return jb_core_1.jb.bind(jbart, 'preview_loaded', resolve);
                    });
                }
            });
        }
    }
});
