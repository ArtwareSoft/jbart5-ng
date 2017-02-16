System.register(['jb-core', '@angular/material'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, material_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (material_1_1) {
                material_1 = material_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('group.md-card', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div><md-card>\n        <div *ngFor=\"let ctrl of ctrls\"><div *jbComp=\"ctrl\"></div></div>\n      </md-card></div>",
                    features: { $: 'group.init-group' },
                    imports: material_1.MdCardModule
                }
            });
            jb_core_1.jb.component('group.md-card-actions', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div><md-card-actions>\n        <div *ngFor=\"let ctrl of ctrls\"><div *jbComp=\"ctrl\"></div></div>\n      </md-card-actions></div>",
                    features: { $: 'group.init-group' },
                    imports: material_1.MdCardModule
                }
            });
            jb_core_1.jb.component('group.md-card-content', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div><md-card-content>\n        <div *ngFor=\"let ctrl of ctrls\"><div *jbComp=\"ctrl\"></div></div>\n      </md-card-content></div>",
                    features: { $: 'group.init-group' },
                    imports: material_1.MdCardModule
                }
            });
            jb_core_1.jb.component('group.md-card-header', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div><md-card-header>\n        <div *ngFor=\"let ctrl of ctrls\"><div *jbComp=\"ctrl\"></div></div>\n      </md-card-header></div>",
                    features: { $: 'group.init-group' },
                    imports: material_1.MdCardModule
                }
            });
            jb_core_1.jb.component('label.md-card-title', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<md-card-title>{{title}}</md-card-title>',
                    features: { $: 'label.bind-title' },
                    imports: material_1.MdCardModule
                }
            });
            jb_core_1.jb.component('label.md-card-subtitle', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<div><md-card-subtitle>{{title}}</md-card-subtitle></div>',
                    ffeatures: { $: 'label.bind-title' },
                    imports: material_1.MdCardModule
                }
            });
        }
    }
});
