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
            jb_core_1.jb.component('hello-world.main', {
                type: 'control',
                impl: { $: 'group',
                    style: { $: 'group.md-card' },
                    controls: [
                        { $: 'label',
                            title: 'hello test',
                            style: { $: 'label.md-card-title' }
                        },
                        { $: 'button',
                            title: 'Hello',
                            style: { $: 'button.md-icon-12', icon: 'build' }
                        },
                        { $: 'editable-boolean',
                            databind: '%$globals/aa%',
                            style: { $: 'editable-boolean.flipswitch' },
                            textForTrue: 'yes',
                            textForFalse: 'no'
                        }
                    ]
                }
            });
            jb_core_1.jb.component('hello-world.main1', {
                type: 'control',
                impl: { $: 'label', title: '$log:hello main' }
            });
            jb_core_1.jb.component('hello-world.form', {
                type: 'control',
                impl: { $: 'group',
                    style: { $: 'group.section' },
                    controls: [
                        { $: 'label',
                            title: 'hello',
                            style: { $: 'label.span' }
                        },
                        { $: 'editable-text',
                            title: 'first name',
                            databind: '%$globals/name%',
                            style: { $: 'editable-text.input' }
                        },
                        { $: 'editable-text',
                            title: 'last name',
                            databind: '%$globals/name%',
                            style: { $: 'editable-text.md-input' }
                        },
                        { $: 'editable-text',
                            title: 'name',
                            databind: '%$globals/name%',
                            style: { $: 'editable-text.md-input' }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('hello-world.group', {
                type: 'control',
                impl: { $: 'group',
                    title: 'main',
                    style: { $: 'layout.vertical', spacing: 30 },
                    controls: [
                        { $: 'group',
                            title: '2.0',
                            controls: [
                                { $: 'label', title: '2.1' },
                                { $: 'button',
                                    title: '2.2',
                                    features: { $: 'group.wait' }
                                }
                            ]
                        },
                        { $: 'label', title: '$log:1.0' }
                    ]
                }
            });
        }
    }
});
