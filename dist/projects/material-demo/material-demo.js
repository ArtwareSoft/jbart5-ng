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
            // </md-input>
            //   <div>
            //             <button md-raised-button>raised</button>
            //             <button md-fab><i class="material-icons md-24">add</i></button>     
            //             </div>
            (_a = ["\nfrom\n<md-card class=\"demo-card demo-basic\">\n  <md-toolbar color=\"primary\">Basic</md-toolbar>\n  <md-card-content>\n    <form>\n      <md-input class=\"demo-full-width\" placeholder=\"Company (disabled)\" disabled value=\"Google\">\n      </md-input>\n\n      <table style=\"width: 100%\" cellspacing=\"0\"><tr>\n        <td><md-input placeholder=\"First name\" style=\"width: 100%\"></md-input></td>\n        <td><md-input placeholder=\"Long Last Name That Will Be Truncated\" style=\"width: 100%\"></md-input></td>\n      </tr></table>\n      <p>\n        <md-input class=\"demo-full-width\" placeholder=\"Address\" value=\"1600 Amphitheatre Pkway\"></md-input>\n        <md-input class=\"demo-full-width\" placeholder=\"Address 2\"></md-input>\n      </p>\n      <table style=\"width: 100%\" cellspacing=\"0\"><tr>\n        <td><md-input class=\"demo-full-width\" placeholder=\"City\"></md-input></td>\n        <td><md-input class=\"demo-full-width\" placeholder=\"State\"></md-input></td>\n        <td><md-input #postalCode class=\"demo-full-width\" maxLength=\"5\"\n                      placeholder=\"Postal Code\"\n                      value=\"94043\">\n          <md-hint align=\"end\">{{postalCode.characterCount}} / 5</md-hint>\n        </md-input></td>\n      </tr></table>\n    </form>\n  </md-card-content>\n</md-card>\n\n\n<button md-button>FLAT</button>\n<button md-raised-button>RAISED</button>\n<button md-icon-button>\n    <i class=\"material-icons md-24\">favorite</i>\n</button>\n<button md-fab>\n    <i class=\"material-icons md-24\">add</i>\n</button>\n<button md-mini-fab>\n    <i class=\"material-icons md-24\">add</i>\n</button>\n\n<button md-raised-button color=\"primary\">PRIMARY</button>\n<button md-raised-button color=\"accent\">ACCENT</button>\n<button md-raised-button color=\"warn\">WARN</button>\n\n<button md-button disabled>off</button>\n<button md-raised-button [disabled]=\"isDisabled\">off</button>\n<button md-mini-fab [disabled]=\"isDisabled\">check circle</button>\n\n\n<md-card>\n   Basic card.\n</md-card>\n\npreset actions\n======\n<md-card>\n   <md-card-subtitle>Subtitle first</md-card-subtitle>\n   <md-card-title>Card with title</md-card-title>   \n   <md-card-content>\n        <p>This is supporting text.</p>\n        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>\n   </md-card-content>\n   <md-card-actions>\n        <button md-button>LIKE</button>\n        <button md-button>SHARE</button>\n   </md-card-actions>\n</md-card>\n\npreset layout\n======\n<md-card>\n   <md-card-header>\n      <img md-card-avatar src=\"path/to/img.png\">\n      <md-card-title>Header title</md-card-title>\n      <md-card-subtitle>Header subtitle</md-card-subtitle>\n   </md-card-header>\n   <img md-card-image src=\"path/to/img.png\">\n   <md-card-content>\n      <p>Here is some more content</p>\n   </md-card-content>\n</md-card>\n\ntitle group\n==============\n<md-card>\n   <md-card-title-group>\n      <img md-card-sm-image src=\"path/to/img.png\">\n      <md-card-title>Card with title</md-card-title>\n      <md-card-subtitle>Subtitle</md-card-subtitle>\n   </md-card-title-group>\n</md-card>\n\ncheck box\n==========\n<ul>\n  <li *ngFor=\"#todo of todos\">\n    <md-checkbox [checked]=\"todo.completed\"\n                 (change)=\"todo.completed = $event\">\n      {{todo.name}}\n    </md-checkbox>\n  </li>\n</ul>\n\nintermediate\n=========\n<md-checkbox [checked]=\"false\"\n             [indeterminate]=\"isIndeterminate\"\n             (change)=\"isIndeterminate = false\">\n  Click the Button Below to Make Me Indeterminate.\n</md-checkbox>\n<button type=\"button\" (click)=\"isIndeterminate = true\">\n  Make Indeterminate\n</button>\n\n<md-checkbox [checked]=\"true\" align=\"end\">\n  I come after my label.\n</md-checkbox>\n\n"], _a.raw = ["\nfrom\n<md-card class=\"demo-card demo-basic\">\n  <md-toolbar color=\"primary\">Basic</md-toolbar>\n  <md-card-content>\n    <form>\n      <md-input class=\"demo-full-width\" placeholder=\"Company (disabled)\" disabled value=\"Google\">\n      </md-input>\n\n      <table style=\"width: 100%\" cellspacing=\"0\"><tr>\n        <td><md-input placeholder=\"First name\" style=\"width: 100%\"></md-input></td>\n        <td><md-input placeholder=\"Long Last Name That Will Be Truncated\" style=\"width: 100%\"></md-input></td>\n      </tr></table>\n      <p>\n        <md-input class=\"demo-full-width\" placeholder=\"Address\" value=\"1600 Amphitheatre Pkway\"></md-input>\n        <md-input class=\"demo-full-width\" placeholder=\"Address 2\"></md-input>\n      </p>\n      <table style=\"width: 100%\" cellspacing=\"0\"><tr>\n        <td><md-input class=\"demo-full-width\" placeholder=\"City\"></md-input></td>\n        <td><md-input class=\"demo-full-width\" placeholder=\"State\"></md-input></td>\n        <td><md-input #postalCode class=\"demo-full-width\" maxLength=\"5\"\n                      placeholder=\"Postal Code\"\n                      value=\"94043\">\n          <md-hint align=\"end\">{{postalCode.characterCount}} / 5</md-hint>\n        </md-input></td>\n      </tr></table>\n    </form>\n  </md-card-content>\n</md-card>\n\n\n<button md-button>FLAT</button>\n<button md-raised-button>RAISED</button>\n<button md-icon-button>\n    <i class=\"material-icons md-24\">favorite</i>\n</button>\n<button md-fab>\n    <i class=\"material-icons md-24\">add</i>\n</button>\n<button md-mini-fab>\n    <i class=\"material-icons md-24\">add</i>\n</button>\n\n<button md-raised-button color=\"primary\">PRIMARY</button>\n<button md-raised-button color=\"accent\">ACCENT</button>\n<button md-raised-button color=\"warn\">WARN</button>\n\n<button md-button disabled>off</button>\n<button md-raised-button [disabled]=\"isDisabled\">off</button>\n<button md-mini-fab [disabled]=\"isDisabled\">check circle</button>\n\n\n<md-card>\n   Basic card.\n</md-card>\n\npreset actions\n======\n<md-card>\n   <md-card-subtitle>Subtitle first</md-card-subtitle>\n   <md-card-title>Card with title</md-card-title>   \n   <md-card-content>\n        <p>This is supporting text.</p>\n        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do \n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>\n   </md-card-content>\n   <md-card-actions>\n        <button md-button>LIKE</button>\n        <button md-button>SHARE</button>\n   </md-card-actions>\n</md-card>\n\npreset layout\n======\n<md-card>\n   <md-card-header>\n      <img md-card-avatar src=\"path/to/img.png\">\n      <md-card-title>Header title</md-card-title>\n      <md-card-subtitle>Header subtitle</md-card-subtitle>\n   </md-card-header>\n   <img md-card-image src=\"path/to/img.png\">\n   <md-card-content>\n      <p>Here is some more content</p>\n   </md-card-content>\n</md-card>\n\ntitle group\n==============\n<md-card>\n   <md-card-title-group>\n      <img md-card-sm-image src=\"path/to/img.png\">\n      <md-card-title>Card with title</md-card-title>\n      <md-card-subtitle>Subtitle</md-card-subtitle>\n   </md-card-title-group>\n</md-card>\n\ncheck box\n==========\n<ul>\n  <li *ngFor=\"#todo of todos\">\n    <md-checkbox [checked]=\"todo.completed\"\n                 (change)=\"todo.completed = $event\">\n      {{todo.name}}\n    </md-checkbox>\n  </li>\n</ul>\n\nintermediate\n=========\n<md-checkbox [checked]=\"false\"\n             [indeterminate]=\"isIndeterminate\"\n             (change)=\"isIndeterminate = false\">\n  Click the Button Below to Make Me Indeterminate.\n</md-checkbox>\n<button type=\"button\" (click)=\"isIndeterminate = true\">\n  Make Indeterminate\n</button>\n\n<md-checkbox [checked]=\"true\" align=\"end\">\n  I come after my label.\n</md-checkbox>\n\n"], jb_1.jb.component('material-demo.main', {
                type: 'control',
                impl: { $: 'group',
                    $vars: {
                        'editable-text.default-style-profile': 'editable-text.md-input'
                    },
                    features: { $: 'group.data', data: '%$person%' },
                    controls: [
                        { $: 'editable-text',
                            title: 'Company (disabled)',
                            databind: '%company%',
                        },
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-text', title: 'First Name', databind: '%firstName%' },
                                { $: 'editable-text', title: 'Long Last Name That Will Be Truncated', databind: '%lastName%' },
                            ]
                        },
                        { $: 'group',
                            style: { $: 'layout.vertical' },
                            controls: [
                                { $: 'editable-text', title: 'Address', databind: '%address%' },
                                { $: 'editable-text', title: 'Address 2', databind: '%address2%' },
                            ]
                        },
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-text', title: 'City', databind: '%city%' },
                                { $: 'editable-text', title: 'State', databind: '%state%' },
                                { $: 'editable-text', title: 'Postal Code', databind: '%postalCode%' },
                            ]
                        },
                    ],
                }
            })(_a));
        }
    }
    var _a;
});
