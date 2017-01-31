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
                    title: 'itemlist-with-find',
                    controls: [
                        { $: 'editable-text',
                            title: 'search',
                            databind: '%$globals/project_pattern%',
                            style: { $: 'editable-text.md-input', width: '260' }
                        },
                        { $: 'itemlist',
                            items: {
                                $pipeline: [
                                    '%$projects%',
                                    { $: 'search-filter', pattern: '%$globals/project_pattern%' }
                                ]
                            },
                            controls: { $: 'button',
                                title: '%$project%',
                                action: { $: 'runActions',
                                    actions: { $: 'runActions',
                                        actions: [
                                            { $: 'goto-url',
                                                url: '/project/studio/%$project%',
                                                target: 'new tab'
                                            },
                                            { $: 'closeContainingPopup' }
                                        ]
                                    }
                                },
                                style: { $: 'button.md-flat-no-background' },
                                features: { $: 'css', css: '!button { text-align: left; width: 250px }' }
                            },
                            style: { $: 'itemlist.ul-li' },
                            itemVariable: 'project'
                        }
                    ],
                    features: [
                        { $: 'group.wait',
                            for: { $: 'http.get', url: '/?op=projects', json: 'true' },
                            resource: 'projects',
                            mapToResource: '%projects%'
                        },
                        { $: 'css.padding', top: '15', left: '15' }
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
