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
            from;
            'jb-ui';
            jb_core_1.jb.resource('ui-tests', 'people', [
                { "name": "Homer Simpson", age: 42, male: true },
                { "name": "Marge Simpson", age: 38, male: false },
                { "name": "Bart Simpson", age: 12, male: true }
            ]);
            jb_core_1.jb.resource('ui-tests', 'person', {
                name: "Homer Simpson",
                male: true,
                isMale: 'yes',
                age: 42
            });
            jb_core_1.jb.resource('ui-tests', 'personWithAddress', {
                "name": "Homer Simpson",
                "address": {
                    "city": "Springfield",
                    "street": "742 Evergreen Terrace"
                }
            });
            jb_core_1.jb.resource('ui-tests', 'personWithChildren', {
                name: "Homer Simpson",
                children: [{ name: 'Bart' }, { name: 'Lisa' }, { name: 'Maggie' }],
                friends: [{ name: 'Barnie' }],
            });
            jb_core_1.jb.resource('ui-tests', 'wait5sec', new Promise(function (res) { return setTimeout(function () { res(5); }, 5000); }));
            jb_core_1.jb.resource('ui-tests', 'wait2sec', new Promise(function (res) { return setTimeout(function () { res(2); }, 2000); }));
            //jb.resource('ui-tests','err2sec', new Promise((res,err) => setTimeout(()=>err('simulate error'), 2000)));
            jb_core_1.jb.component('inner-label1-tst', {
                params: {
                    title: { essential: true, dynamic: true, as: 'ref' },
                },
                impl: { $: 'label', cssClass: 'inner-label1-tst', title: { $call: 'title' } }
            });
            jb_core_1.jb.component('inner-label2-tst', {
                params: {
                    title: { essential: true, dynamic: true, as: 'ref' },
                },
                impl: { $: 'inner-label1-tst', cssClass: 'inner-label2-tst', title: { $call: 'title' } }
            });
            jb_core_1.jb.component('inner-label3-tst', {
                params: {
                    title: { essential: true, dynamic: true, as: 'ref' },
                },
                impl: { $: 'inner-label2-tst', cssClass: 'inner-label3-tst', title: { $call: 'title' } }
            });
        }
    }
});
