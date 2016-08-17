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
            if (window.jbartTest) {
                // jb.resource('ui-tests','UrlPathEm',{ $: 'rx.urlPath', base: 'ui-tests', zoneId: 'single-test', 
                // 	params: [ 'test','project', 'page', 'profile_path' ] , databind: '{%$globals%}' } );
                jb_core_1.jb.resource('ui-tests', 'WidgetLoaded', { $: 'rx.subject' });
            }
            jb_tests('studio-tests', {
                'studio-label': { $: 'studio-test',
                    control: { $: 'label', title: 'Hello World2' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-codemirror': { $: 'studio-test',
                    page: 'main',
                    control: { $: 'editable-text',
                        databind: { $: 'studio.profile-as-text' },
                        style: { $: 'editable-text.codemirror' }
                    },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-control-tree': { $: 'studio-test',
                    page: 'group1',
                    profile_path: 'hello-world.group1',
                    control: { $: 'studio.control-tree' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-properties': { $: 'studio-test',
                    page: 'group1',
                    profile_path: 'hello-world.group1',
                    control: { $: 'studio.properties', path: '%$globals/profile_path%' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-property-Primitive': { $: 'studio-test',
                    page: 'main',
                    profile_path: 'hello-world.main',
                    control: { $: 'studio.property-Primitive', path: 'hello-world.main~title' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-property-TgpType': { $: 'studio-test',
                    page: 'group1',
                    profile_path: 'hello-world.group1',
                    control: { $: 'studio.property-TgpType', path: 'hello-world.group1~style' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
            });
        }
    }
});
