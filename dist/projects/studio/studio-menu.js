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
            jb_core_1.jb.component('studio.mainMenu', {
                type: 'control',
                impl: {
                    $: 'group', style: { $: 'group.section', cssClass: 'pulldown-main-menu' },
                    controls: [
                        { $: 'pulldown.topMenuItem', title: 'File',
                            controls: [
                                { $: 'pulldown.MenuItem', title: 'Open ...', action: { $: 'studio.openWidget' } },
                                { $: 'pulldown.MenuItem', title: 'Save', icon: 'save', action: { $: 'studio.saveWidget' }, shortcut: 'Ctrl+S' },
                                { $: 'pulldown.MenuItem', title: 'Source ...', action: { $: 'studio.openSourceDialog' } },
                            ]
                        },
                        { $: 'pulldown.topMenuItem', title: 'View',
                            controls: [
                                { $: 'pulldown.MenuItem', title: 'Refresh', spritePosition: '10,0', action: { $: 'studio.refreshPreview' } },
                                { $: 'pulldown.MenuItem', title: 'Edit source', spritePosition: '3,0', action: { $: 'studio.editSource' } },
                                { $: 'pulldown.MenuItem', title: 'Control tree', spritePosition: '5,0', action: { $: 'studio.openControlTree' } },
                                { $: 'pulldown.MenuItem', title: 'jbEditor', spritePosition: '6,0', action: { $: 'studio.openjbEditor' } }
                            ]
                        },
                        { $: 'pulldown.topMenuItem', title: 'Data',
                            controls: [
                                { $: 'dynamic-fields', fieldItems: { $: 'studio.dataResources' },
                                    genericField: { $: 'pulldown.MenuItem', title: '%$fieldItem.name%', action: { '$studio.showDataResource': '%$fieldItem%' } }
                                },
                                { $: 'pulldown.menu-item-separator' },
                                { $: 'pulldown.MenuItem', title: 'Add Data Resource...', action: { $: 'studio.addDataResource' } }
                            ]
                        }
                    ]
                }
            });
        }
    }
});
