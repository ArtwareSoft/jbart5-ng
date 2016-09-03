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
            jb_core_1.jb.component('studio.pickAndOpen', {
                type: 'action',
                params: {
                    from: { options: 'studio,preview', as: 'string', defaultValue: 'preview' }
                },
                impl: { $: 'studio.pick',
                    from: '%$from%',
                    onSelect: [
                        { $: 'writeValue', to: '%$globals/profile_path%', value: '%%' },
                        { $: 'studio.open-control-tree' },
                        { $: 'studio.open-properties' },
                    ],
                }
            });
            jb_core_1.jb.component('studio.toolbar', {
                type: 'control',
                impl: { $: 'group',
                    style: { $: 'studio-toolbar' },
                    controls: [
                        { $: 'label',
                            title: '',
                            features: { $: 'css', css: '{ width: 170px }' }
                        },
                        { $: 'button',
                            title: 'Select',
                            action: { $: 'studio.pickAndOpen' },
                            style: { $: 'button.md-icon',
                                css: '{transform: scaleX(-1)}',
                                icon: 'call_made'
                            }
                        },
                        { $: 'button',
                            title: 'Save',
                            action: { $: 'studio.saveComponents' },
                            style: { $: 'button.md-icon', icon: 'save' }
                        },
                        { $: 'button',
                            title: 'Refresh Preview',
                            action: { $: 'studio.refreshPreview' },
                            style: { $: 'button.md-icon', icon: 'refresh' }
                        },
                        { $: 'button',
                            title: 'Javascript',
                            action: { $: 'studio.editSource' },
                            style: { $: 'button.md-icon', icon: 'code' }
                        },
                        { $: 'button',
                            title: 'Outline',
                            action: { $: 'studio.open-control-tree' },
                            style: { $: 'button.md-icon', icon: 'format_align_left' }
                        },
                        { $: 'button',
                            title: 'Properties',
                            action: { $: 'studio.open-properties' },
                            style: { $: 'button.md-icon', icon: 'storage' }
                        },
                        { $: 'button',
                            title: 'jbEditor',
                            action: { $: 'studio.open-jb-editor', path: '%$globals/profile_path%' },
                            style: { $: 'button.md-icon', icon: 'build' }
                        },
                        { $: 'button',
                            title: 'show data',
                            action: { $: 'studio.showProbeData' },
                            style: { $: 'button.md-icon', icon: 'input' }
                        },
                        { $: 'button',
                            title: 'insert control',
                            action: { $: 'studio.openNewCtrlDialog' },
                            style: { $: 'button.md-icon', icon: 'add' },
                        },
                        { $: 'button',
                            title: 'responsive-phone',
                            action: { $: 'studio.open-responsive-phone-popup' },
                            style: { $: 'button.md-icon', icon: 'tablet_android' }
                        }
                    ],
                    features: [
                        { $: 'feature.keyboard-shortcut',
                            key: 'Alt+C',
                            action: { $: 'studio.pickAndOpen' }
                        },
                        { $: 'feature.keyboard-shortcut',
                            key: 'Alt+R',
                            action: { $: 'studio.redraw' }
                        },
                        { $: 'feature.keyboard-shortcut',
                            key: 'Alt+N',
                            action: { $: 'studio.pickAndOpen', from: 'studio' }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio_button.toolbarButton', {
                type: 'button.style',
                params: {
                    spritePosition: { as: 'string', defaultValue: '0,0' }
                },
                impl: function (context, spritePosition) {
                    return {
                        jbTemplate: '<button (click)="clicked()"><span style="background-position: {{pos}}" title="{{title}}"></span></button>',
                        cssClass: "studio-btn-toolbar",
                        init: function (cmp) {
                            cmp.pos = spritePosition.split(',').map(function (item) { return (-parseInt(item) * 16) + 'px'; }).join(' ');
                        }
                    };
                }
            });
            //            position: absolute; top: 60px; height: 33px; left: 0px;right:0; 
            jb_core_1.jb.component('studio-toolbar', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: '<section class="jb-group"><jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true"></jb_comp></section>',
                    css: "{ \n            display: flex;\n            height: 33px; \n            width: 100%;\n        }\n        * { margin-right: 0 }"
                }
            });
        }
    }
});
