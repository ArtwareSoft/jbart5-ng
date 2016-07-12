System.register(['jb-core/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            ;
            jb_1.jb.resource('material-demo', 'person', {
                "company": "google",
                "firstName": '',
                "lastName": '',
                "address": "1600 Amphitheatre Pkway",
                "address2": '',
                "city": '',
                "state": '',
                "postalCode": "94043",
            });
            jb_1.jb.component('material-demo.main', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'editable-text', title: 'Company (disabled)', databind: '%company%' },
                        { $: 'group',
                            title: 'Name',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-text', databind: '%firstName% %', title: 'First Name' },
                                { $: 'editable-text',
                                    databind: '%lastName%',
                                    title: 'Long Last Name That Will Be Truncated'
                                }
                            ]
                        },
                        { $: 'group',
                            title: 'address',
                            style: { $: 'layout.vertical' },
                            controls: [
                                { $: 'editable-text', title: 'Address', databind: '%address%' },
                                { $: 'editable-text', title: 'Address2', databind: '%address2%' }
                            ]
                        },
                        { $: 'group',
                            title: 'City State',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-text', title: 'City', databind: '%city%' },
                                { $: 'editable-text', title: 'State', databind: '%state%' },
                                { $: 'editable-text', title: 'Postal Code', databind: '%postalCode%' }
                            ]
                        }
                    ],
                    features: [
                        { $: 'group.data', data: '%$person%' },
                        { $: 'group.theme',
                            theme: { $: 'theme.material-design' }
                        }
                    ]
                }
            });
            (_a = ["\n\n<button md-button>FLAT</button>\n<button md-raised-button>RAISED</button>\n<button md-icon-button>\n    <i class=\"material-icons md-24\">favorite</i>\n</button>\n<button md-fab>\n    <i class=\"material-icons md-24\">add</i>\n</button>\n<button md-mini-fab>\n    <i class=\"material-icons md-24\">add</i>\n</button>\n\n<button md-raised-button color=\"primary\">PRIMARY</button>\n<button md-raised-button color=\"accent\">ACCENT</button>\n<button md-raised-button color=\"warn\">WARN</button>\n\n<button md-button disabled>off</button>\n<button md-raised-button [disabled]=\"isDisabled\">off</button>\n<button md-mini-fab [disabled]=\"isDisabled\">check circle</button>\n\n\n<md-card>\n   Basic card.\n</md-card>\n\npreset actions\n======\n<md-card>\n   <md-card-subtitle>Subtitle first</md-card-subtitle>\n   <md-card-title>Card with title</md-card-title>   \n   <md-card-content>\n        <p>This is supporting text.</p>\n        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>\n   </md-card-content>\n   <md-card-actions>\n        <button md-button>LIKE</button>\n        <button md-button>SHARE</button>\n   </md-card-actions>\n</md-card>\n\npreset layout\n======\n<md-card>\n   <md-card-header>\n      <img md-card-avatar src=\"path/to/img.png\">\n      <md-card-title>Header title</md-card-title>\n      <md-card-subtitle>Header subtitle</md-card-subtitle>\n   </md-card-header>\n   <img md-card-image src=\"path/to/img.png\">\n   <md-card-content>\n      <p>Here is some more content</p>\n   </md-card-content>\n</md-card>\n\ntitle group\n==============\n<md-card>\n   <md-card-title-group>\n      <img md-card-sm-image src=\"path/to/img.png\">\n      <md-card-title>Card with title</md-card-title>\n      <md-card-subtitle>Subtitle</md-card-subtitle>\n   </md-card-title-group>\n</md-card>\n\ncheck box\n==========\n<ul>\n  <li *ngFor=\"let todo of todos\">\n    <md-checkbox [checked]=\"todo.completed\"\n                 (change)=\"todo.completed = $event\">\n      {{todo.name}}\n    </md-checkbox>\n  </li>\n</ul>\n\nintermediate\n=========\n<md-checkbox [checked]=\"false\"\n             [indeterminate]=\"isIndeterminate\"\n             (change)=\"isIndeterminate = false\">\n  Click the Button Below to Make Me Indeterminate.\n</md-checkbox>\n<button type=\"button\" (click)=\"isIndeterminate = true\">\n  Make Indeterminate\n</button>\n\n<md-checkbox [checked]=\"true\" align=\"end\">\n  I come after my label.\n</md-checkbox>\n"], _a.raw = ["\n\n<button md-button>FLAT</button>\n<button md-raised-button>RAISED</button>\n<button md-icon-button>\n    <i class=\"material-icons md-24\">favorite</i>\n</button>\n<button md-fab>\n    <i class=\"material-icons md-24\">add</i>\n</button>\n<button md-mini-fab>\n    <i class=\"material-icons md-24\">add</i>\n</button>\n\n<button md-raised-button color=\"primary\">PRIMARY</button>\n<button md-raised-button color=\"accent\">ACCENT</button>\n<button md-raised-button color=\"warn\">WARN</button>\n\n<button md-button disabled>off</button>\n<button md-raised-button [disabled]=\"isDisabled\">off</button>\n<button md-mini-fab [disabled]=\"isDisabled\">check circle</button>\n\n\n<md-card>\n   Basic card.\n</md-card>\n\npreset actions\n======\n<md-card>\n   <md-card-subtitle>Subtitle first</md-card-subtitle>\n   <md-card-title>Card with title</md-card-title>   \n   <md-card-content>\n        <p>This is supporting text.</p>\n        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>\n   </md-card-content>\n   <md-card-actions>\n        <button md-button>LIKE</button>\n        <button md-button>SHARE</button>\n   </md-card-actions>\n</md-card>\n\npreset layout\n======\n<md-card>\n   <md-card-header>\n      <img md-card-avatar src=\"path/to/img.png\">\n      <md-card-title>Header title</md-card-title>\n      <md-card-subtitle>Header subtitle</md-card-subtitle>\n   </md-card-header>\n   <img md-card-image src=\"path/to/img.png\">\n   <md-card-content>\n      <p>Here is some more content</p>\n   </md-card-content>\n</md-card>\n\ntitle group\n==============\n<md-card>\n   <md-card-title-group>\n      <img md-card-sm-image src=\"path/to/img.png\">\n      <md-card-title>Card with title</md-card-title>\n      <md-card-subtitle>Subtitle</md-card-subtitle>\n   </md-card-title-group>\n</md-card>\n\ncheck box\n==========\n<ul>\n  <li *ngFor=\"let todo of todos\">\n    <md-checkbox [checked]=\"todo.completed\"\n                 (change)=\"todo.completed = $event\">\n      {{todo.name}}\n    </md-checkbox>\n  </li>\n</ul>\n\nintermediate\n=========\n<md-checkbox [checked]=\"false\"\n             [indeterminate]=\"isIndeterminate\"\n             (change)=\"isIndeterminate = false\">\n  Click the Button Below to Make Me Indeterminate.\n</md-checkbox>\n<button type=\"button\" (click)=\"isIndeterminate = true\">\n  Make Indeterminate\n</button>\n\n<md-checkbox [checked]=\"true\" align=\"end\">\n  I come after my label.\n</md-checkbox>\n"], jb_1.jb.component('material-demo.sidenav', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'sidenav',
                            style: { $: 'sidenav.md', align: 'start', mode: 'over', width: '200' },
                            controls: [
                                { $: 'group',
                                    style: { $: 'group.section' },
                                    controls: [
                                        { $: 'image',
                                            units: 'px',
                                            style: { $: 'image.default' },
                                            url: 'https://material.angularjs.org/latest/img/icons/angular-logo.svg',
                                            imageHeight: '150'
                                        },
                                        { $: 'custom-control',
                                            template: '<h1 class="docs-logotype md-heading">Angular Material</h1>',
                                            css: '{ color: white }'
                                        },
                                        { $: 'label',
                                            title: 'label',
                                            style: { $: 'label.span' }
                                        },
                                        { $: 'button',
                                            title: 'Hello',
                                            style: { $: 'button.md-flat' }
                                        }
                                    ],
                                    features: { $: 'css', css: '{ background-color: #145FA9 }' }
                                }
                            ]
                        }
                    ]
                }
            })(_a));
        }
    }
    var _a;
});
