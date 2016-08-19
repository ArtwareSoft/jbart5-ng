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
            jb_core_1.jb.component('md-test.md-button', {
                type: 'test',
                impl: { $: 'ng2-ui-test',
                    control: { $: 'button', title: 'ccc',
                        style: { $: 'button.md-raised' }
                    },
                    expectedHtmlResult: { $: 'contains', text: 'cc' }
                }
            });
            jb_core_1.jb.component('md-test.md-card-title', {
                type: 'test',
                impl: { $: 'ng2-ui-test',
                    control: { $: 'label', title: 'ccc',
                        style: { $: 'label.md-card-title' }
                    },
                    expectedHtmlResult: { $: 'contains', text: 'cc' }
                },
            });
            jb_core_1.jb.component('md-test.md-input', {
                type: 'test',
                impl: { $: 'ng2-ui-test',
                    control: { $: 'editable-text',
                        title: 'name',
                        databind: '%$person/name%',
                        style: { $: 'editable-text.md-input' }
                    },
                    expectedHtmlResult: { $: 'contains', text: ['name', 'Homer'] }
                },
            });
            jb_core_1.jb.component('md-test.button-md-icon', {
                type: 'test',
                impl: { $: 'ng2-ui-test',
                    control: { $: 'button',
                        title: 'ccc',
                        style: { $: 'button.md-icon', icon: 'save' },
                    },
                    expectedHtmlResult: { $: 'contains', text: 'cc' }
                },
            });
            jb_core_1.jb.component('md-test.editable-text-in-md-property-sheet', {
                type: 'test',
                impl: { $: 'ng2-ui-test',
                    control: { $: 'group',
                        controls: [
                            { $: 'group',
                                controls: [
                                    { $: 'editable-text', title: 'name', databind: '%$person/name%', style: { $: 'editable-text.md-input' } },
                                    { $: 'editable-text', title: 'name', databind: '%$person/name%', style: { $: 'editable-text.md-input' } },
                                ]
                            },
                            { $: 'label', title: '%$person/name%' }
                        ]
                    },
                    expectedHtmlResult: { $: 'contains', text: ['Homer'] },
                }
            });
            //jb.component('md-test.dialog-md-alert', {
            //type: 'test',
            //  impl :{$: 'ng2-ui-test', waitForPromise: {$delay: 5},  
            //   control :{$: 'button', title: 'Open Dialog', $click: true,
            //       action :{$: 'openDialog', 
            //         style :{$: 'dialog.md-dialog-ok-cancel'},
            //         title: 'Hello' , 
            //         content :{$: 'label', title: 'Hello Dialog' },      
            //       } 
            //   },
            //   expectedHtmlResult: { $: 'contains', text: ['Hello Dialog'], lookin: 'popups' },
            // },
            //})
            // jb.component('md-test.md-dialog-modal', {
            //type: 'test',
            //   impl :{$: 'ng2-ui-test', waitForPromise: {$delay: 5},  
            //   control :{$: 'button', title: 'Open Dialog', $click: true,
            //       action :{$: 'openDialog', 
            //         modal: true,
            //         style :{$: 'dialog.md-dialog-ok-cancel' },
            //         title: 'Hello' , 
            //         content :{$: 'label', title: 'Hello Dialog' },      
            //       } 
            //   },
            //   expectedHtmlResult: { $: 'contains', text: ['Hello Dialog', 'OK'], lookin: 'popups' },
            // },
            //})
            jb_core_1.jb.component('md-test.md-tabs', {
                type: 'test',
                impl: { $: 'ng2-ui-test',
                    control: { $: 'tabs',
                        style: { $: 'tabs.md-tabs' },
                        tabs: [
                            { $: 'group', title: 'tab1', controls: { $: 'label', title: 'in tab1' } },
                            { $: 'group', title: 'tab2', controls: { $: 'label', title: 'in tab2' } },
                        ]
                    },
                    expectedHtmlResult: { $and: [
                            { $: 'contains', text: ['tab1', 'in tab1'] },
                            { $: 'contains', text: ['tab2'] },
                            { $not: { $: 'contains', text: ['in tab2'] } }
                        ]
                    },
                }
            });
        }
    }
});
