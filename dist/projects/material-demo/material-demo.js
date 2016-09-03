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
            jb_core_1.jb.resource('material-demo', 'person', {
                "company": "google",
                "firstName": '',
                "lastName": '',
                "address": "1600 Amphitheatre Pkway",
                "address2": '',
                "city": '',
                "state": '',
                "postalCode": "94043",
            });
            jb_core_1.jb.component('material-demo.main', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'tabs',
                            tabs: [
                                { $: 'group',
                                    title: 'input',
                                    style: { $: 'group.section' },
                                    controls: [
                                        { $: 'editable-text',
                                            databind: '%company%',
                                            title: 'Company (disabled)'
                                        },
                                        { $: 'group',
                                            title: 'Name',
                                            style: { $: 'layout.horizontal', spacing: '' },
                                            controls: [
                                                { $: 'editable-text',
                                                    databind: '%firstName% %',
                                                    title: 'First Name'
                                                },
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
                                                { $: 'editable-text', databind: '%address%', title: 'Address' },
                                                { $: 'editable-text',
                                                    databind: '%address2%',
                                                    title: 'Address2'
                                                }
                                            ]
                                        },
                                        { $: 'group',
                                            title: 'City State',
                                            style: { $: 'layout.horizontal' },
                                            controls: [
                                                { $: 'editable-text',
                                                    databind: '%city%',
                                                    title: 'City',
                                                    style: { $: 'editable-text.md-input', width: '122' }
                                                },
                                                { $: 'editable-text', databind: '%state%', title: 'State' },
                                                { $: 'editable-text',
                                                    databind: '%postalCode%',
                                                    title: 'Postal Code'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                { $: 'custom-control',
                                    html: "<div class=\"demo-button\">\n  <section>\n    <button md-button>flat</button>\n    <button md-raised-button>raised</button>\n    <button md-fab>\n      <md-icon class=\"md-24\">check</md-icon>\n    </button>\n    <button md-mini-fab>\n      <md-icon class=\"md-24\">check</md-icon>\n    </button>\n  </section>\n\n  <section>\n    <a href=\"http://www.google.com\" md-button color=\"primary\">SEARCH</a>\n    <a href=\"http://www.google.com\" md-raised-button>SEARCH</a>\n    <a href=\"http://www.google.com\" md-fab>\n      <md-icon class=\"md-24\">check</md-icon>\n    </a>\n    <a href=\"http://www.google.com\" md-mini-fab>\n      <md-icon class=\"md-24\">check</md-icon>\n    </a>\n  </section>\n\n  <section>\n    <button md-button color=\"primary\">primary</button>\n    <button md-button color=\"accent\">accent</button>\n    <button md-button color=\"warn\">warn</button>\n  </section>\n\n  <section>\n    <button md-raised-button color=\"primary\">primary</button>\n    <button md-raised-button color=\"accent\">accent</button>\n    <button md-raised-button color=\"warn\">warn</button>\n  </section>\n\n  <section>\n    <button md-fab color=\"primary\">\n      <md-icon class=\"md-24\">home</md-icon>\n    </button>\n    <button md-fab color=\"accent\">\n      <md-icon class=\"md-24\">favorite</md-icon>\n    </button>\n    <button md-fab color=\"warn\">\n      <md-icon class=\"md-24\">feedback</md-icon>\n    </button>\n  </section>\n\n  <section>\n    <button md-icon-button color=\"primary\">\n      <md-icon class=\"md-24\">menu</md-icon>\n    </button>\n\n    <button md-icon-button color=\"accent\">\n      <md-icon class=\"md-24\">favorite</md-icon>\n    </button>\n\n    <button md-icon-button>\n      <md-icon class=\"md-24\">more_vert</md-icon>\n    </button>\n  </section>\n\n  <section>\n    <div>\n      <p>isDisabled: {{isDisabled}}, clickCounter: <span>{{clickCounter}}</span></p>\n      <button md-raised-button (click)=\"isDisabled=!isDisabled\">\n        Disable buttons\n      </button>\n      <button md-raised-button (click)=\"button1.focus()\">Focus 1</button>\n      <button md-raised-button (click)=\"button2.focus()\">Focus 2</button>\n      <button md-raised-button (click)=\"button3.focus()\">Focus 3</button>\n    </div>\n    <button md-button #button1 [disabled]=\"isDisabled\" (click)=\"clickCounter=clickCounter+1\">off</button>\n    <button md-button color=\"primary\" [disabled]=\"isDisabled\">off</button>\n    <button md-raised-button #button3 color=\"primary\" [disabled]=\"isDisabled\">off</button>\n    <button md-mini-fab [disabled]=\"isDisabled\">\n      <md-icon class=\"md-24\">check</md-icon>\n    </button>\n\n    <button md-icon-button color=\"accent\" [disabled]=\"isDisabled\">\n      <md-icon class=\"md-24\">favorite</md-icon>\n    </button>\n  </section>\n  <section>\n    <a href=\"http://www.google.com\" md-button color=\"primary\">SEARCH</a>\n    <button md-button>DANCE</button>\n  </section>\n  <section>\n    <a href=\"http://www.google.com\" md-raised-button color=\"primary\">SEARCH</a>\n    <button md-raised-button>DANCE</button>\n  </section>\n</div>",
                                    css: ".demo-button .button {     margin: 8px;     text-transform: uppercase;   }    \n.demo-button section {     display: flex;     align-items: center;     \n  background-color: #f7f7f7;     margin: 8px;   }    \n.demo-button p {     padding:5px 15px;   }",
                                    title: 'buttons'
                                },
                                { $: 'custom-control',
                                    html: "<h1>Exclusive Selection</h1>\n\n<section class=\"demo-section\">\n  <md-button-toggle-group name=\"alignment\">\n    <md-button-toggle value=\"left\"><md-icon>format_align_left</md-icon></md-button-toggle>\n    <md-button-toggle value=\"center\"><md-icon>format_align_center</md-icon></md-button-toggle>\n    <md-button-toggle value=\"right\"><md-icon>format_align_right</md-icon></md-button-toggle>\n    <md-button-toggle value=\"justify\" disabled><md-icon>format_align_justify</md-icon></md-button-toggle>\n  </md-button-toggle-group>\n</section>\n\n<h1>Disabled Group</h1>\n\n<section class=\"demo-section\">\n  <md-button-toggle-group name=\"checkbox\" disabled>\n    <md-button-toggle value=\"bold\">\n      <md-icon class=\"md-24\">format_bold</md-icon>\n    </md-button-toggle>\n    <md-button-toggle value=\"italic\">\n      <md-icon class=\"md-24\">format_italic</md-icon>\n    </md-button-toggle>\n    <md-button-toggle value=\"underline\">\n      <md-icon class=\"md-24\">format_underline</md-icon>\n    </md-button-toggle>\n  </md-button-toggle-group>\n</section>\n\n<h1>Multiple Selection</h1>\n<section class=\"demo-section\">\n  <md-button-toggle-group multiple>\n    <md-button-toggle>Flour</md-button-toggle>\n    <md-button-toggle>Eggs</md-button-toggle>\n    <md-button-toggle>Sugar</md-button-toggle>\n    <md-button-toggle disabled>Milk (disabled)</md-button-toggle>\n  </md-button-toggle-group>\n</section>\n\n<h1>Single Toggle</h1>\n<md-button-toggle>Yes</md-button-toggle>\n",
                                    css: ".demo-basic {\n  padding: 0;\n}\n.demo-basic md-card-content {\n  padding: 16px;\n}\n.demo-full-width {\n  width: 100%;\n}\n\n.demo-icons {\n  font-size: 100%;\n  height: inherit;\n  vertical-align: top;\n  width: inherit;\n}\n\n.demo-transform {\n  transition: color $swift-ease-out-duration $swift-ease-out-timing-function;\n}\n.demo-primary {\n  color: md-color($md-primary);\n}\n\n.demo-card {\n  margin: 16px;\n}\n",
                                    title: 'button-toggle'
                                },
                                { $: 'custom-control',
                                    html: "<div class=\"demo-card-container\">\n  <md-card>\n    <md-card-title-group>\n        <md-card-title>Card with title</md-card-title>\n        <md-card-subtitle>Subtitle</md-card-subtitle>\n        <img md-card-md-image>\n    </md-card-title-group>\n  </md-card>\n\n  <md-card>\n    <md-card-subtitle>Subtitle</md-card-subtitle>\n    <md-card-title>Card with title</md-card-title>\n    <md-card-content>\n      <p>This is supporting text.</p>\n      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n    </md-card-content>\n    <md-card-actions>\n      <button md-button>LIKE</button>\n      <button md-button>SHARE</button>\n    </md-card-actions>\n  </md-card>\n\n  <md-card>\n    <img md-card-image src=\"https://material.angularjs.org/latest/img/washedout.png\">\n    <md-card-title>Content Title</md-card-title>\n    <md-card-content>\n      <p>Here is some content</p>\n    </md-card-content>\n    <md-card-actions align=\"end\">\n      <button md-button>LIKE</button>\n      <button md-button>SHARE</button>\n    </md-card-actions>\n  </md-card>\n\n  <md-card>\n    <md-card-header>\n      <img md-card-avatar>\n      <md-card-title>Header title</md-card-title>\n      <md-card-subtitle>Header subtitle</md-card-subtitle>\n    </md-card-header>\n    <img md-card-image src=\"https://material.angularjs.org/latest/img/washedout.png\">\n    <md-card-content>\n      <p>Here is some content</p>\n    </md-card-content>\n  </md-card>\n\n  <md-card class=\"demo-card-blue md-card-flat\">\n    <md-card-title>Easily customizable</md-card-title>\n    <md-card-actions>\n      <button md-button>First</button>\n      <button md-button>Second</button>\n    </md-card-actions>\n  </md-card>\n</div>",
                                    css: ".demo-card-container {\n  display: flex;\n  flex-flow: column nowrap;\n}\n.demo-card-container md-card {\n    margin: 0 16px 16px 0;\n    width: 350px;\n  }\n\n.demo-card-container  img {\n    background-color: gray;\n  }\n\n\n.demo-card-blue {\n  background-color: #b0becc;\n}\n.demo-card-blue md-card-actions {\n    display: flex;\n    flex-direction: column;\n  }\n",
                                    title: 'card'
                                },
                                { $: 'custom-control',
                                    html: "<h1>md-checkbox: Basic Example</h1>\n<form>\n<md-checkbox [(ngModel)]=\"isChecked\"\n              name=\"cb\"\n             (change)=\"isIndeterminate = false\"\n             [indeterminate]=\"isIndeterminate\"\n             [disabled]=\"isDisabled\"\n             [align]=\"alignment\">\n  Do you want to <em>foobar</em> the <em>bazquux</em>?\n\n</md-checkbox> - <strong>{{printResult()}}</strong>\n</form>\n<div class=\"demo-checkboxes\">\n<input id=\"indeterminate-toggle\"\n       type=\"checkbox\"\n       [(ngModel)]=\"isIndeterminate\"\n       [disabled]=\"isDisabled\">\n<label for=\"indeterminate-toggle\">Toggle Indeterminate</label>\n<input id=\"disabled-toggle\" type=\"checkbox\" [(ngModel)]=\"isDisabled\">\n<label for=\"disabled-toggle\">Toggle Disabled</label>\n</div>\n<div>\n  <p>Alignment:</p>\n  <div>\n    <input #start type=\"radio\"\n                  value=\"start\"\n                  id=\"align-start\"\n                  name=\"alignment\"\n                  (click)=\"alignment = start.value\"\n                  checked>\n    <label for=\"align-start\">Start</label>\n  </div>\n  <div>\n    <input #end type=\"radio\"\n                  value=\"end\"\n                  id=\"align-end\"\n                  name=\"alignment\"\n                  (click)=\"alignment = end.value\">\n    <label for=\"align-end\">End</label>\n  </div>\n</div>\n",
                                    css: ".demo-card-container {\n  display: flex;\n  flex-flow: column nowrap;\n}\n.demo-card-container md-card {\n    margin: 0 16px 16px 0;\n    width: 350px;\n  }\n\n.demo-card-container  img {\n    background-color: gray;\n  }\n\n\n.demo-card-blue {\n  background-color: #b0becc;\n}\n.demo-card-blue md-card-actions {\n    display: flex;\n    flex-direction: column;\n  }\n",
                                    title: 'checkbox',
                                    features: { $: 'feature.ng-attach-object',
                                        data: {
                                            $asIs: {
                                                isIndeterminate: false,
                                                isChecked: false,
                                                isDisabled: false,
                                                alignment: 'start',
                                                printResult: function () {
                                                    if (this.isIndeterminate) {
                                                        return 'Maybe!';
                                                    }
                                                    return this.isChecked ? 'Yes!' : 'No!';
                                                }
                                            }
                                        }
                                    }
                                },
                                { $: 'custom-control',
                                    html: "<div class=\"demo-grid-list\">\n  <md-card>\n    <md-card-title>Basic grid list</md-card-title>\n    <md-card-content class=\"demo-basic-list\">\n      <md-grid-list cols=\"4\" [rowHeight]=\"basicRowHeight\">\n        <md-grid-tile> One </md-grid-tile>\n        <md-grid-tile> Two </md-grid-tile>\n        <md-grid-tile> Three </md-grid-tile>\n        <md-grid-tile> Four </md-grid-tile>\n      </md-grid-list>\n    </md-card-content>\n  </md-card>\n\n  <md-card>\n    <md-card-title>Fixed-height grid list</md-card-title>\n    <md-card-content>\n      <md-grid-list [cols]=\"fixedCols\" [rowHeight]=\"fixedRowHeight\">\n        <md-grid-tile *ngFor=\"let tile of tiles\" [colspan]=\"tile.cols\" [rowspan]=\"tile.rows\"\n                      [style.background]=\"tile.color\">\n          {{tile.text}}\n        </md-grid-tile>\n      </md-grid-list>\n    </md-card-content>\n    <md-card-actions>\n      <p>Change list cols: <input type=\"number\" [(ngModel)]=\"fixedCols\"></p>\n      <p>Change row height: <input type=\"number\" [(ngModel)]=\"fixedRowHeight\"></p>\n      <button md-button (click)=\"addTileCols()\" color=\"primary\">ADD COLSPAN (THREE)</button>\n    </md-card-actions>\n  </md-card>\n\n  <md-card>\n    <md-card-title>Ratio-height grid list</md-card-title>\n    <md-card-content class=\"demo-ratio-list\">\n      <md-grid-list cols=\"2\" [rowHeight]=\"ratio\" gutterSize=\"4px\">\n        <md-grid-tile *ngFor=\"let tile of tiles\" [style.background]=\"'lightblue'\">\n          {{tile.text}}\n        </md-grid-tile>\n      </md-grid-list>\n    </md-card-content>\n    <md-card-actions>\n      <p>Change ratio: <input [(ngModel)]=\"ratio\"></p>\n    </md-card-actions>\n  </md-card>\n\n  <md-card>\n    <md-card-title>Fit-height grid list</md-card-title>\n    <md-card-content class=\"demo-fit-list\">\n      <md-grid-list cols=\"2\" rowHeight=\"fit\" [gutterSize]=\"ratioGutter\"\n                    [style.height]=\"fitListHeight\">\n        <md-grid-tile *ngFor=\"let tile of tiles\" [style.background]=\"'#F1EBBA'\">\n          {{tile.text}}\n        </md-grid-tile>\n      </md-grid-list>\n    </md-card-content>\n    <md-card-actions>\n      <p>Change list height: <input [(ngModel)]=\"fitListHeight\"></p>\n      <p>Change gutter: <input type=\"number\" [(ngModel)]=\"ratioGutter\"></p>\n    </md-card-actions>\n  </md-card>\n\n  <md-card>\n    <md-card-title>Grid list with header</md-card-title>\n    <md-card-content>\n      <md-grid-list cols=\"3\" rowHeight=\"200px\">\n        <md-grid-tile *ngFor=\"let dog of dogs\" style=\"background:gray\">\n          <md-grid-tile-header>\n            <md-icon md-grid-avatar>info_outline</md-icon>\n            {{dog.name}}\n          </md-grid-tile-header>\n        </md-grid-tile>\n      </md-grid-list>\n    </md-card-content>\n  </md-card>\n\n  <md-card>\n    <md-card-title>Grid list with footer</md-card-title>\n    <md-card-content>\n      <md-grid-list cols=\"3\" rowHeight=\"200px\">\n        <md-grid-tile *ngFor=\"let dog of dogs\">\n          <img [alt]=\"dog.name\" src=\"https://material.angularjs.org/material2_assets/ngconf/{{dog.name}}.png\">\n          <md-grid-tile-footer>\n            <h3 md-line>{{dog.name}}</h3>\n            <span md-line>Human: {{dog.human}}</span>\n            <md-icon>star_border</md-icon>\n          </md-grid-tile-footer>\n        </md-grid-tile>\n      </md-grid-list>\n    </md-card-content>\n  </md-card>\n</div>\n",
                                    css: ".demo-grid-list {\n  width: 1100px;\n}\n.demo-grid-list   md-card {\n    margin: 16px 0;\n  }\n\n  p {\n    margin: 16px;\n  }\n\n  .demo-basic-list md-grid-tile {\n    background: rgba(0, 0, 0, 0.32);\n  }\n\n  img {\n    width: 350px;\n  }",
                                    title: 'grid-list',
                                    features: { $: 'feature.ng-attach-object',
                                        data: { $: 'new-instance',
                                            module: 'projects/material-demo/ng-material-demo-loader',
                                            class: 'GridListDemo'
                                        }
                                    }
                                },
                                { $: 'custom-control',
                                    html: "<md-card class=\"demo-card demo-basic\">\n  <md-toolbar color=\"primary\">Basic</md-toolbar>\n  <md-card-content>\n    <form>\n      <md-input class=\"demo-full-width\" placeholder=\"Company (disabled)\" disabled value=\"Google\">\n      </md-input>\n\n      <table style=\"width: 100%\" cellspacing=\"0\"><tr>\n        <td><md-input placeholder=\"First name\" style=\"width: 100%\"></md-input></td>\n        <td><md-input placeholder=\"Long Last Name That Will Be Truncated\" style=\"width: 100%\"></md-input></td>\n      </tr></table>\n      <p>\n        <md-input class=\"demo-full-width\" placeholder=\"Address\" value=\"1600 Amphitheatre Pkway\"></md-input>\n        <md-input class=\"demo-full-width\" placeholder=\"Address 2\"></md-input>\n      </p>\n      <table style=\"width: 100%\" cellspacing=\"0\"><tr>\n        <td><md-input class=\"demo-full-width\" placeholder=\"City\" value=\"Mountain View\"></md-input></td>\n        <td><md-input class=\"demo-full-width\" placeholder=\"State\" maxLength=\"2\" value=\"CA\"></md-input></td>\n        <td><md-input #postalCode class=\"demo-full-width\" maxLength=\"5\"\n                      placeholder=\"Postal Code\"\n                      value=\"94043\">\n          <md-hint align=\"end\"></md-hint>\n        </md-input></td>\n      </tr></table>\n    </form>\n  </md-card-content>\n</md-card>\n\n<md-card class=\"demo-card demo-basic\">\n  <md-toolbar color=\"primary\">Prefix + Suffix</md-toolbar>\n  <md-card-content>\n    <md-input placeholder=\"amount\" align=\"end\">\n      <span md-prefix>$&nbsp;</span>\n      <span md-suffix>.00</span>\n    </md-input>\n  </md-card-content>\n</md-card>\n\n<md-card class=\"demo-card demo-basic\">\n  <md-toolbar color=\"primary\">Divider Colors</md-toolbar>\n  <md-card-content>\n    <md-input dividerColor=\"primary\" placeholder=\"Default Color\" value=\"example\"></md-input>\n    <md-input dividerColor=\"accent\" placeholder=\"Accent Color\" value=\"example\"></md-input>\n    <md-input dividerColor=\"warn\" placeholder=\"Warn Color\" value=\"example\"></md-input>\n  </md-card-content>\n</md-card>\n\n<md-card class=\"demo-card demo-basic\">\n  <md-toolbar color=\"primary\">Hints</md-toolbar>\n  <md-card-content>\n    <p>\n      <md-input placeholder=\"Character count (100 max)\" maxLength=\"100\" class=\"demo-full-width\"\n                value=\"Hello world. How are you?\"\n                #characterCountHintExample>\n        <md-hint align=\"end\">hint</md-hint>\n      </md-input>\n    </p>\n  </md-card-content>\n</md-card>\n\n<md-card class=\"demo-card\">\n  <md-card-title>\n    Hello <md-input [(ngModel)]=\"name\" type=\"text\" placeholder=\"First name\"></md-input>,\n    how are you?\n  </md-card-title>\n  <md-card-content>\n    <p>\n      <md-input disabled placeholder=\"Disabled field\" value=\"Value\"></md-input>\n      <md-input required placeholder=\"Required field\"></md-input>\n    </p>\n    <p>\n      <md-input placeholder=\"100% width placeholder\" style=\"width: 100%\"></md-input>\n    </p>\n    <p>\n      <md-input placeholder=\"Character count (100 max)\" maxLength=\"100\" style=\"width: 100%\"\n                #input>\n        <md-hint align=\"end\">hint</md-hint>\n      </md-input>\n    </p>\n    <p>\n      <md-input placeholder=\"Show Hint Label\" style=\"width: 100%\"\n                hintLabel=\"Hint label\"></md-input>\n    </p>\n\n    <p>\n      <md-input>\n        <md-placeholder>\n          I <md-icon class=\"demo-icons\">favorite</md-icon> <b>bold</b> placeholder\n        </md-placeholder>\n        <md-hint>\n          I also <md-icon class=\"demo-icons\">home</md-icon> <i>italic</i> hint labels\n        </md-hint>\n      </md-input>\n    </p>\n    <p>\n      <md-input placeholder=\"Show Hint Label With Character Count\" style=\"width: 100%\"\n                hintLabel=\"Hint label\" characterCounter></md-input>\n    </p>\n    <p>\n      <md-checkbox [(ngModel)]=\"dividerColor\">Check to change the divider color:</md-checkbox>\n      <md-input [dividerColor]=\"dividerColor ? 'primary' : 'accent'\"\n                [placeholder]=\"dividerColor ? 'Primary color' : 'Accent color'\"></md-input>\n    </p>\n    <p>\n      <md-checkbox [(ngModel)]=\"requiredField\"> Check to make required:</md-checkbox>\n      <md-input [required]=\"requiredField\"\n                [placeholder]=\"requiredField ? 'Required field' : 'Not required field'\"></md-input>\n    </p>\n    <p>\n      <md-checkbox [(ngModel)]=\"floatingLabel\"> Check to make floating label:</md-checkbox>\n      <md-input [floatingPlaceholder]=\"floatingLabel\"\n                [placeholder]=\"floatingLabel ? 'Floating label' : 'Not floating label'\"></md-input>\n    </p>\n\n    <p>\n      <md-input placeholder=\"Prefixed\" value=\"example\">\n        <div md-prefix>Example:&nbsp;</div>\n      </md-input>\n      <md-input placeholder=\"Suffixed\" value=\"123\" align=\"end\">\n        <span md-suffix>.00 \u20AC</span>\n      </md-input>\n      <br/>\n      Both:\n      <md-input #email placeholder=\"Email Address\" value=\"angular-core\" align=\"end\">\n        <span md-prefix><md-icon [class.primary]=\"email.focused\" class=\"demo-icons demo-transform\">email</md-icon>&nbsp;</span>\n        <span md-suffix class=\"demo-transform\" [class.primary]=\"email.focused\">&nbsp;@gmail.com</span>\n      </md-input>\n    </p>\n\n    <p>\n      Empty: <md-input></md-input>\n      <label>Label: <md-input></md-input></label>\n    </p>\n  </md-card-content>\n</md-card>\n\n<md-card class=\"demo-card\">\n  <table width=\"100%\">\n    <thead>\n      <td>Table</td>\n      <td colspan=\"3\">\n        <button (click)=\"addABunch(5)\">Add 5</button>\n        <button (click)=\"addABunch(10)\">Add 10</button>\n        <button (click)=\"addABunch(100)\">Add 100</button>\n        <button (click)=\"addABunch(1000)\">Add 1000</button>\n      </td>\n    </thead>\n    <tr *ngFor=\"let item of items; let i = index\">\n      <td>{{i+1}}</td>\n      <td>\n        <md-input type=\"number\" placeholder=\"value\" aria-label=\"hello\" [(ngModel)]=\"items[i].value\"></md-input>\n      </td>\n      <td>\n        <input type=\"number\" [(ngModel)]=\"items[i].value\">\n      </td>\n      <td>{{item.value}}</td>\n    </tr>\n  </table>\n</md-card>",
                                    css: ".demo-basic {\n  padding: 0;\n}\n.demo-basic md-card-content {\n  padding: 16px;\n}\n.demo-full-width {\n  width: 100%;\n}\n\n.demo-icons {\n  font-size: 100%;\n  height: inherit;\n  vertical-align: top;\n  width: inherit;\n}\n\n.demo-card {\n  margin: 16px;\n}",
                                    title: 'input',
                                    features: { $: 'feature.ng-attach-object',
                                        data: { $: 'new-instance',
                                            module: 'projects/material-demo/ng-material-demo-loader',
                                            class: 'InputDemo'
                                        }
                                    }
                                },
                                { $: 'custom-control',
                                    html: "<h1>md-list demo</h1>\n\n<button md-raised-button (click)=\"thirdLine=!thirdLine\" class=\"demo-button\">Show third line</button>\n\n<div class=\"demo\">\n  <div>\n    <h2>Normal lists</h2>\n\n    <md-list>\n      <h3 md-subheader>Items</h3>\n      <md-list-item *ngFor=\"let item of items\">\n        {{item}}\n      </md-list-item>\n    </md-list>\n\n    <md-list>\n      <md-list-item *ngFor=\"let contact of contacts\">\n        <h3 md-line>{{contact.name}}</h3>\n        <p md-line *ngIf=\"thirdLine\">extra line</p>\n        <p md-line class=\"demo-secondary-text\">{{contact.headline}}</p>\n      </md-list-item>\n    </md-list>\n\n    <md-list>\n      <h3 md-subheader>Today</h3>\n      <md-list-item *ngFor=\"let message of messages\">\n        <img md-list-avatar [src]=\"message.image\" alt=\"Image of {{message.from}}\">\n        <h4 md-line>{{message.from}}</h4>\n        <p md-line>\n          <span>{{message.subject}} -- </span>\n          <span class=\"demo-secondary-text\">{{message.message}}</span>\n        </p>\n      </md-list-item>\n      <md-divider></md-divider>\n      <md-list-item *ngFor=\"let message of messages\">\n        <h4 md-line>{{message.from}}</h4>\n        <p md-line> {{message.subject}} </p>\n        <p md-line class=\"demo-secondary-text\">{{message.message}} </p>\n      </md-list-item>\n    </md-list>\n  </div>\n\n  <div>\n    <h2>Dense lists</h2>\n    <md-list dense>\n      <h3 md-subheader>Items</h3>\n      <md-list-item *ngFor=\"let item of items\">\n        {{item}}\n      </md-list-item>\n    </md-list>\n\n    <md-list dense>\n      <md-list-item *ngFor=\"let contact of contacts\">\n        <h3 md-line>{{contact.name}}</h3>\n        <p md-line class=\"demo-secondary-text\">{{contact.headline}}</p>\n      </md-list-item>\n    </md-list>\n\n    <md-list dense>\n      <h3 md-subheader>Today</h3>\n      <md-list-item *ngFor=\"let message of messages\">\n        <img md-list-avatar [src]=\"message.image\" alt=\"Image of {{message.from}}\">\n        <h4 md-line>{{message.from}}</h4>\n        <p md-line> {{message.subject}} </p>\n        <p md-line class=\"demo-secondary-text\">{{message.message}} </p>\n      </md-list-item>\n    </md-list>\n  </div>\n  <div>\n    <h2>Nav lists</h2>\n    <md-nav-list>\n      <a md-list-item *ngFor=\"let link of links\" href=\"http://www.google.com\">\n        {{ link.name }}\n      </a>\n    </md-nav-list>\n    <div *ngIf=\"infoClicked\">\n      More info!\n    </div>\n    <md-nav-list>\n      <md-list-item *ngFor=\"let link of links\">\n        <a md-line href=\"http://www.google.com\">{{ link.name }}</a>\n        <button md-icon-button (click)=\"infoClicked=!infoClicked\">\n          <md-icon>info</md-icon>\n        </button>\n      </md-list-item>\n    </md-nav-list>\n    <md-nav-list>\n      <a md-list-item *ngFor=\"let link of links\" href=\"http://www.google.com\">\n        <md-icon md-list-icon>folder</md-icon>\n        <span md-line>{{ link.name }}</span>\n        <span md-line class=\"demo-secondary-text\"> Description </span>\n      </a>\n    </md-nav-list>\n    <md-nav-list dense>\n      <md-list-item *ngFor=\"let link of links\">\n        <a md-line href=\"http://www.google.com\">{{ link.name }}</a>\n        <button md-icon-button (click)=\"infoClicked=!infoClicked\">\n          <md-icon class=\"material-icons\">info</md-icon>\n        </button>\n      </md-list-item>\n    </md-nav-list>\n  </div>\n</div>",
                                    css: ".demo {\n  display: flex;\n  flex-flow: row wrap;\n}\nmd-list, md-nav-list {\n    border: 1px solid rgba(0, 0, 0, 0.12);\n    width: 350px;\n    margin: 20px 20px 0 0;\n\n  }\n  h2 {\n    margin-top: 20px;\n  }\n\n  md-icon {\n    color: rgba(0, 0, 0, 0.12);\n  }\n\n  [md-list-icon] {\n    color: white;\n    background: rgba(0, 0, 0, 0.3);\n  }\n\n\n.demo-secondary-text {\n  color: rgba(0, 0, 0, 0.54);\n}",
                                    title: 'list',
                                    features: { $: 'feature.ng-attach-object',
                                        data: { $: 'new-instance',
                                            module: 'projects/material-demo/ng-material-demo-loader',
                                            class: 'ListDemo'
                                        }
                                    }
                                },
                                { $: 'custom-control',
                                    html: "<div class=\"demo-live-announcer\">\n\n  <button md-button (click)=\"announceText('Hey Google')\">Announce Text</button>\n\n</div>",
                                    css: '',
                                    title: 'announcer',
                                    features: { $: 'feature.ng-attach-object',
                                        data: { $: 'injector-get', provider: 'LiveAnnouncerDemo' }
                                    }
                                },
                                { $: 'custom-control',
                                    html: "<h1>Determinate</h1>\n<div class=\"demo-progress-bar-container\">\n  <md-progress-bar mode=\"determinate\"\n                   [value]=\"determinateProgressValue\"\n                   color=\"primary\"\n                   class=\"demo-progress-bar-margins\"></md-progress-bar>\n</div>\n<span>Value: {{determinateProgressValue}}</span>\n<button md-raised-button (click)=\"stepDeterminateProgressVal(10)\">Increase</button>\n<button md-raised-button (click)=\"stepDeterminateProgressVal(-10)\">Decrease</button>\n<h1>Buffer</h1>\n<div class=\"demo-progress-bar-container\">\n  <md-progress-bar [value]=\"bufferProgressValue\"\n                   [bufferValue]=\"bufferBufferValue\"\n                   mode=\"buffer\"\n                   color=\"warn\"\n                   class=\"demo-progress-bar-margins\"></md-progress-bar>\n</div>\n<span>Value: {{bufferProgressValue}}</span>\n<button md-raised-button (click)=\"stepBufferProgressVal(10)\">Increase</button>\n<button md-raised-button (click)=\"stepBufferProgressVal(-10)\">Decrease</button>\n<span class=\"demo-progress-bar-spacer\"></span>\n<span>Buffer Value: {{bufferBufferValue}}</span>\n<button md-raised-button (click)=\"stepBufferBufferVal(10)\">Increase</button>\n<button md-raised-button (click)=\"stepBufferBufferVal(-10)\">Decrease</button>\n\n<h1>Indeterminate</h1>\n<div class=\"demo-progress-bar-container\">\n  <md-progress-bar mode=\"indeterminate\"\n                   class=\"demo-progress-bar-margins\"></md-progress-bar>\n</div>\n\n<h1>Query</h1>\n<div class=\"demo-progress-bar-container\">\n  <md-progress-bar mode=\"query\"\n                   class=\"demo-progress-bar-margins\"></md-progress-bar>\n</div>",
                                    css: ".demo-progress-bar-container {\n  width: 100%;\n}\n\n.demo-progress-bar-margins {\n  margin: 20px 0;\n}\n\n.demo-progress-bar-spacer {\n  display: inline-block;\n  width: 50px;\n}",
                                    title: 'progress bar',
                                    features: { $: 'feature.ng-attach-object',
                                        data: { $: 'new-instance',
                                            module: 'projects/material-demo/ng-material-demo-loader',
                                            class: 'ProgressBarDemo'
                                        }
                                    }
                                },
                                { $: 'custom-control',
                                    html: "<h1>Default Slider</h1>\nLabel <md-slider #slidey></md-slider>\n{{slidey.value}}\n\n<h1>Slider with Min and Max</h1>\n<md-slider min=\"5\" max=\"7\" #slider2></md-slider>\n{{slider2.value}}\n\n<h1>Disabled Slider</h1>\n<md-slider disabled #slider3></md-slider>\n{{slider3.value}}\n\n<h1>Slider with set value</h1>\n<md-slider value=\"43\"></md-slider>\n\n<h1>Slider with step defined</h1>\n<md-slider min=\"1\" max=\"100\" step=\"20\" #slider5></md-slider>\n{{slider5.value}}\n\n<h1>Slider with set tick interval</h1>\n<md-slider tick-interval=\"auto\"></md-slider>\n<md-slider tick-interval=\"9\"></md-slider>\n\n<h1>Slider with Thumb Label</h1>\n<md-slider thumb-label></md-slider>\n\n<h1>Slider with two-way binding</h1>\n<md-slider [(ngModel)]=\"demo\" step=\"40\"></md-slider>\n<input [(ngModel)]=\"demo\">",
                                    css: '',
                                    title: 'slider',
                                    features: { $: 'feature.ng-attach-object',
                                        data: { $: 'new-instance',
                                            module: 'projects/material-demo/ng-material-demo-loader',
                                            class: 'ProgressBarDemo'
                                        }
                                    }
                                }
                            ],
                            style: { $: 'tabs.md-tabs' },
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
            jb_core_1.jb.component('material-demo.sidenav', {
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
                            ],
                            features: { $: 'hidden' }
                        },
                        { $: 'custom-control',
                            html: "<div>\n<md-sidenav-layout class=\"demo-sidenav-layout\">\n  <md-sidenav #start (open)=\"myinput.focus()\" mode=\"side\">\n    Start Side Drawer\n    <br>\n    <button md-button (click)=\"start.close()\">Close</button>\n    <br>\n    <button md-button (click)=\"end.open()\">Open End Side</button>\n    <br>\n    <button md-button\n            (click)=\"start.mode = (start.mode == 'push' ? 'over' : (start.mode == 'over' ? 'side' : 'push'))\">Toggle Mode</button>\n    <div>Mode: {{start.mode}}</div>\n    <br>\n    <input #myinput>\n  </md-sidenav>\n\n  <md-sidenav #end align=\"end\">\n    End Side Drawer\n    <br>\n    <button md-button (click)=\"end.close()\">Close</button>\n  </md-sidenav>\n\n  <div class=\"demo-sidenav-content\">\n    <h1>My Content</h1>\n\n    <div>\n      <header>Sidenav</header>\n      <button md-button (click)=\"start.toggle()\">Toggle Start Side Drawer</button>\n      <button md-button (click)=\"end.toggle()\">Toggle End Side Drawer</button>\n    </div>\n\n    <button md-button>HELLO</button>\n    <button md-raised-button class=\"md-primary\">HELLO</button>\n    <button md-fab class=\"md-accent\">HI</button>\n  </div>\n</md-sidenav-layout>\n</div>",
                            css: ".demo-sidenav-layout {\n  border: 3px solid black;\n\n  md-sidenav {\n    padding: 10px;\n  }\n}\n\n.demo-sidenav-content {\n  padding: 15px;\n}",
                        }
                    ],
                }
            });
            jb_core_1.jb.component('material-demo.buttons', {
                type: 'control',
                impl: { $: 'group',
                    title: 'buttons',
                    controls: [
                        { $: 'custom-control',
                            title: 'buttons1',
                            html: "<div class=\"demo-button\">\n  <section>\n    <button md-button>flat</button>\n    <button md-raised-button>raised</button>\n    <button md-fab>\n      <md-icon class=\"md-24\">check</md-icon>\n    </button>\n    <button md-mini-fab>\n      <md-icon class=\"md-24\">check</md-icon>\n    </button>\n  </section>\n\n  <section>\n    <a href=\"http://www.google.com\" md-button color=\"primary\">SEARCH</a>\n    <a href=\"http://www.google.com\" md-raised-button>SEARCH</a>\n    <a href=\"http://www.google.com\" md-fab>\n      <md-icon class=\"md-24\">check</md-icon>\n    </a>\n    <a href=\"http://www.google.com\" md-mini-fab>\n      <md-icon class=\"md-24\">check</md-icon>\n    </a>\n  </section>\n\n  <section>\n    <button md-button color=\"primary\">primary</button>\n    <button md-button color=\"accent\">accent</button>\n    <button md-button color=\"warn\">warn</button>\n  </section>\n\n  <section>\n    <button md-raised-button color=\"primary\">primary</button>\n    <button md-raised-button color=\"accent\">accent</button>\n    <button md-raised-button color=\"warn\">warn</button>\n  </section>\n\n  <section>\n    <button md-fab color=\"primary\">\n      <md-icon class=\"md-24\">home</md-icon>\n    </button>\n    <button md-fab color=\"accent\">\n      <md-icon class=\"md-24\">favorite</md-icon>\n    </button>\n    <button md-fab color=\"warn\">\n      <md-icon class=\"md-24\">feedback</md-icon>\n    </button>\n  </section>\n\n  <section>\n    <button md-icon-button color=\"primary\">\n      <md-icon class=\"md-24\">menu</md-icon>\n    </button>\n\n    <button md-icon-button color=\"accent\">\n      <md-icon class=\"md-24\">favorite</md-icon>\n    </button>\n\n    <button md-icon-button>\n      <md-icon class=\"md-24\">more_vert</md-icon>\n    </button>\n  </section>\n\n  <section>\n    <div>\n      <p>isDisabled: {{isDisabled}}, clickCounter: <span>{{clickCounter}}</span></p>\n      <button md-raised-button (click)=\"isDisabled=!isDisabled\">\n        Disable buttons\n      </button>\n      <button md-raised-button (click)=\"button1.focus()\">Focus 1</button>\n      <button md-raised-button (click)=\"button2.focus()\">Focus 2</button>\n      <button md-raised-button (click)=\"button3.focus()\">Focus 3</button>\n    </div>\n    <button md-button #button1 [disabled]=\"isDisabled\" (click)=\"clickCounter=clickCounter+1\">off</button>\n    <button md-button color=\"primary\" [disabled]=\"isDisabled\">off</button>\n    <button md-raised-button #button3 color=\"primary\" [disabled]=\"isDisabled\">off</button>\n    <button md-mini-fab [disabled]=\"isDisabled\">\n      <md-icon class=\"md-24\">check</md-icon>\n    </button>\n\n    <button md-icon-button color=\"accent\" [disabled]=\"isDisabled\">\n      <md-icon class=\"md-24\">favorite</md-icon>\n    </button>\n  </section>\n  <section>\n    <a href=\"http://www.google.com\" md-button color=\"primary\">SEARCH</a>\n    <button md-button>DANCE</button>\n  </section>\n  <section>\n    <a href=\"http://www.google.com\" md-raised-button color=\"primary\">SEARCH</a>\n    <button md-raised-button>DANCE</button>\n  </section>\n</div>",
                            css: ".demo-button .button {     margin: 8px;     text-transform: uppercase;   }    \n.demo-button section {     display: flex;     align-items: center;     \n  background-color: #f7f7f7;     margin: 8px;   }    \n.demo-button p {     padding:5px 15px;   }",
                        },
                        { $: 'group',
                            controls: [
                                { $: 'custom-control',
                                    html: '<div>%$sources/button%</div>',
                                    title: 'buttons',
                                    css: '  button, a {     margin: 8px;     text-transform: uppercase;   }    section {     display: flex;     align-items: center;     background-color: #f7f7f7;     margin: 8px;   }    p {     padding:5px 15px;   }'
                                }
                            ],
                            features: [
                                { $: 'group.data', data: '%$sources/button%', watch: true },
                                { $: 'css.width', width: '400' }
                            ],
                            title: 'buttons',
                            style: { $: 'group.md-card' }
                        },
                        { $: 'editable-text',
                            style: { $: 'editable-text.codemirror',
                                debounceTime: '100',
                                mode: 'htmlmixed',
                                height: '600'
                            },
                            databind: '%$sources/button%'
                        }
                    ],
                    style: { $: 'layout.horizontal', spacing: 3 }
                }
            });
            jb_core_1.jb.component('material-demo.btns', {
                type: 'control',
                impl: { $: 'group',
                    title: 'btns',
                    controls: [
                        { $: 'button',
                            title: 'Hello ewrewre',
                            style: { $: 'button.md-raised' },
                        },
                        { $: 'itemlist',
                            items: ['a'],
                            controls: [
                                { $: 'button',
                                    title: 'Hello sfsd',
                                    style: { $: 'button.md-raised' },
                                }
                            ],
                            style: { $: 'itemlist.ul-li' },
                            dynamicItems: true
                        }
                    ]
                }
            });
        }
    }
});
