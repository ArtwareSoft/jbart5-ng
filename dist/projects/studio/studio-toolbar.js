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
                        { $: 'studio.openProperties' },
                        { $: 'studio.open-control-tree' },
                    ],
                }
            });
            jb_core_1.jb.component('studio.toolbar', {
                type: 'control',
                impl: { $: 'group',
                    style: { $: 'studio-toolbar' },
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
                        },
                        { $: 'feature.keyboard-shortcut',
                            key: 'Ctrl+C',
                            action: { $: 'studio.copy', path: '%$path%' }
                        },
                        { $: 'feature.keyboard-shortcut',
                            key: 'Ctrl+V',
                            action: { $: 'studio.paste', path: '%$path%' }
                        },
                        { $: 'feature.keyboard-shortcut',
                            key: 'Ctrl+Z',
                            action: { $: 'studio.undo' }
                        },
                        { $: 'feature.keyboard-shortcut',
                            key: 'Ctrl+Y',
                            action: { $: 'studio.redo' }
                        }
                    ],
                    controls: [
                        { $: 'label',
                            title: '',
                            features: { $: 'css', css: '{ width: 170px }' }
                        },
                        { $: 'button',
                            title: 'Select',
                            style: { $: 'button.md-icon',
                                icon: 'call_made',
                                css: '{transform: scaleX(-1)}'
                            },
                            action: { $: 'studio.pickAndOpen' }
                        },
                        { $: 'button',
                            title: 'Save',
                            style: { $: 'button.md-icon', icon: 'save' },
                            action: { $: 'studio.saveComponents' }
                        },
                        { $: 'button',
                            title: 'Refresh',
                            style: { $: 'button.md-icon', icon: 'refresh' },
                            action: { $: 'studio.redraw' }
                        },
                        { $: 'button',
                            title: 'Javascript',
                            style: { $: 'button.md-icon', icon: 'code' },
                            action: { $: 'studio.editSource' }
                        },
                        { $: 'button',
                            title: 'Outline',
                            style: { $: 'button.md-icon', icon: 'format_align_left' },
                            action: { $: 'studio.open-control-tree' }
                        },
                        { $: 'button',
                            title: 'Properties',
                            style: { $: 'button.md-icon', icon: 'storage' },
                            action: { $: 'studio.openProperties' }
                        },
                        { $: 'button',
                            title: 'jbEditor',
                            style: { $: 'button.md-icon', icon: 'build' },
                            action: { $: 'studio.openjbEditor' }
                        },
                        { $: 'button',
                            title: 'show data',
                            style: { $: 'button.md-icon', icon: 'input' },
                            action: { $: 'studio.showProbeData' }
                        },
                        { $: 'button',
                            title: 'insert control',
                            style: { $: 'button.md-icon', icon: 'add' },
                            action: { $: 'studio.openNewCtrlDialog' }
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
            jb_core_1.jb.component('studio.redraw', {
                type: 'action',
                impl: function () {
                    return jbart.redrawStudio && jbart.redrawStudio();
                }
            });
        }
    }
});
