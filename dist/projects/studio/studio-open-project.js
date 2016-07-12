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
            jb_core_1.jb.component('studio.open-project', {
                type: 'action',
                impl: { $: 'openDialog',
                    title: 'Open project',
                    style: { $: 'dialog.md-dialog-ok-cancel', okLabel: 'OK', cancelLabel: 'Cancel' },
                    content: { $: 'studio.choose-project' }
                }
            });
            jb_core_1.jb.component('studio.choose-project', {
                type: 'control',
                impl: { $: 'group',
                    features: [
                        { $: 'group.wait',
                            for: { $: 'http.get',
                                url: '/?op=projects'
                            },
                            resource: 'projects',
                            mapToResource: '%projects%'
                        },
                        { $: 'css.padding', top: '15', left: '15' }
                    ],
                    title: 'itemlist-with-find',
                    controls: [
                        { $: 'editable-text',
                            databind: '%$globals/project_pattern%',
                            title: 'search',
                            style: { $: 'editable-text.md-input', width: '260' }
                        },
                        { $: 'itemlist',
                            items: [
                                '%$projects%',
                                { $: 'search-filter', pattern: '%$globals/project_pattern%' }
                            ],
                            itemVariable: 'project',
                            style: { $: 'itemlist.ul-li' },
                            controls: { $: 'button',
                                title: '%$project%',
                                style: { $: 'customStyle',
                                    template: '<span><button md-button (click)="clicked()">{{title}}</button></span>',
                                    directives: 'MdButton',
                                    css: 'button { width: 260px; text-align: left }'
                                },
                                action: [
                                    { $: 'closeContainingPopup' },
                                    { $: 'writeValue', value: '%$project%', to: '%$globals/project%' },
                                    { $: 'writeValue', value: 'main', to: '%$globals/page%' },
                                    { $: 'writeValue', value: '', to: '%$globals/profile_path%' }
                                ]
                            }
                        }
                    ]
                }
            });
        }
    }
});
// style :{$: 'customStyle', 
//   template: '<span><button md-button (click)="clicked()">{{title}}</button></span>', 
//   directives: 'MdButton', 
//   css: 'button { width: 260px; text-align: left }'
// }, 
