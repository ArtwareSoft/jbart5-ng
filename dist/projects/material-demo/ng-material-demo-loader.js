System.register(['jb-core', '@angular/core', '@angular/material'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var jb_core_1, core_1, material_1;
    var SlideToggleDemo, TooltipDemo, ProgressCircleDemo, RippleDemo, GesturesDemo, GridListDemo, max, CheckboxDemo, ButtonDemo, InputDemo, ListDemo, LiveAnnouncerDemo, ProgressBarDemo;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (material_1_1) {
                material_1 = material_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('material-demo.single-demo', {
                impl: { $: 'custom-control',
                    html: '%$demo/html%',
                    css: '%$demo/css%',
                    features: [
                        { $: 'feature.ng-attach-object',
                            data: { $: 'new-instance',
                                module: 'projects/material-demo/ng-material-demo-loader',
                                class: { $: 'pipeline',
                                    items: [{ $: 'capitalize', text: '%$demo/id%' }, '%%Demo']
                                }
                            }
                        },
                        { $: 'css', css: '{ min-width: 600px; max-width: 600px; }' },
                    ],
                    imports: material_1.MaterialModule,
                    providers: [material_1.MdUniqueSelectionDispatcher, material_1.MdIconRegistry]
                }
            });
            // import {Component,NgModule,Injectable} from '@angular/core';
            // import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
            // import {MD_BUTTON_DIRECTIVES} from '@angular2-material/button/button';
            // import {MdCardModule} from '@angular2-material/card/card';
            // import {MD_CHECKBOX_DIRECTIVES} from '@angular2-material/checkbox/checkbox';
            // import {MD_RADIO_DIRECTIVES} from '@angular2-material/radio/radio';
            // import {MdIcon} from '@angular2-material/icon/icon';
            // import {MdToolbar} from '@angular2-material/toolbar/toolbar';
            // //import {MdTooltip,TooltipComponent} from '@angular2-material/tooltip/tooltip';
            // import {MD_BUTTON_TOGGLE_DIRECTIVES} from '@angular2-material/button-toggle/button-toggle';
            // import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list/grid-list';
            // import {MD_LIST_DIRECTIVES} from '@angular2-material/list/list';
            // import {MdRipple, MD_RIPPLE_DIRECTIVES} from '@angular2-material/core/ripple/ripple'; 
            // import {MD_PROGRESS_BAR_DIRECTIVES} from '@angular2-material/progress-bar/progress-bar'; 
            // import {MD_PROGRESS_CIRCLE_DIRECTIVES} from '@angular2-material/progress-circle/progress-circle'; 
            // import {MD_SLIDER_DIRECTIVES} from '@angular2-material/slider/slider';
            // import {MdLiveAnnouncer} from '@angular2-material/core/a11y/live-announcer';
            // import { Overlay, OverlayState,OverlayOrigin, OVERLAY_PROVIDERS, ComponentPortal, Portal,TemplatePortalDirective} from '@angular2-material/core/core';
            // import {
            //   MdUniqueSelectionDispatcher
            // } from '@angular2-material/core/coordination/unique-selection-dispatcher';
            // jb_ui.registerProviders({
            //   MdUniqueSelectionDispatcher: MdUniqueSelectionDispatcher,
            //   MdLiveAnnouncer: MdLiveAnnouncer,
            //   OVERLAY_PROVIDERS: OVERLAY_PROVIDERS,
            // });
            // jb_ui.registerDirectives({
            //   MD_CHECKBOX_DIRECTIVES: MD_CHECKBOX_DIRECTIVES, 
            //   MD_RADIO_DIRECTIVES:MD_RADIO_DIRECTIVES, 
            //   MD_BUTTON_TOGGLE_DIRECTIVES:MD_BUTTON_TOGGLE_DIRECTIVES,
            //   MD_GRID_LIST_DIRECTIVES: MD_GRID_LIST_DIRECTIVES,
            //   MD_LIST_DIRECTIVES: MD_LIST_DIRECTIVES,
            //   MD_RIPPLE_DIRECTIVES: MD_RIPPLE_DIRECTIVES,
            //   MD_PROGRESS_BAR_DIRECTIVES: MD_PROGRESS_BAR_DIRECTIVES,
            //   MD_PROGRESS_CIRCLE_DIRECTIVES: MD_PROGRESS_CIRCLE_DIRECTIVES,
            //   MD_SLIDER_DIRECTIVES: MD_SLIDER_DIRECTIVES,
            // //  MdTooltip: MdTooltip,
            // });
            SlideToggleDemo = (function () {
                function SlideToggleDemo() {
                }
                SlideToggleDemo.prototype.onFormSubmit = function () {
                    alert("You submitted the form.");
                };
                return SlideToggleDemo;
            }());
            exports_1("SlideToggleDemo", SlideToggleDemo);
            TooltipDemo = (function () {
                function TooltipDemo() {
                    this.position = 'below';
                }
                return TooltipDemo;
            }());
            exports_1("TooltipDemo", TooltipDemo);
            ProgressCircleDemo = (function () {
                function ProgressCircleDemo() {
                    this.progressValue = 40;
                }
                ProgressCircleDemo.prototype.step = function (val) {
                    this.progressValue += val;
                };
                return ProgressCircleDemo;
            }());
            exports_1("ProgressCircleDemo", ProgressCircleDemo);
            RippleDemo = (function () {
                function RippleDemo() {
                    this.centered = false;
                    this.disabled = false;
                    this.unbounded = false;
                    this.rounded = false;
                    this.maxRadius = null;
                    this.rippleSpeed = 1;
                    this.rippleColor = '';
                    this.rippleBackgroundColor = '';
                    this.disableButtonRipples = false;
                }
                RippleDemo.prototype.doManualRipple = function () {
                    var _this = this;
                    if (this.manualRipple) {
                        window.setTimeout(function () { return _this.manualRipple.start(); }, 10);
                        window.setTimeout(function () { return _this.manualRipple.end(0, 0); }, 500);
                    }
                };
                __decorate([
                    core_1.ViewChild(material_1.MdRipple), 
                    __metadata('design:type', material_1.MdRipple)
                ], RippleDemo.prototype, "manualRipple", void 0);
                return RippleDemo;
            }());
            exports_1("RippleDemo", RippleDemo);
            GesturesDemo = (function () {
                function GesturesDemo() {
                    this.dragCount = 0;
                    this.panCount = 0;
                    this.pressCount = 0;
                    this.longpressCount = 0;
                    this.swipeCount = 0;
                    this.slideCount = 0;
                }
                return GesturesDemo;
            }());
            exports_1("GesturesDemo", GesturesDemo);
            GridListDemo = (function () {
                function GridListDemo() {
                    this.tiles = [
                        { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
                        { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
                        { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
                        { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
                    ];
                    this.dogs = [
                        { name: 'Porter', human: 'Kara' },
                        { name: 'Mal', human: 'Jeremy' },
                        { name: 'Koby', human: 'Igor' },
                        { name: 'Razzle', human: 'Ward' },
                        { name: 'Molly', human: 'Rob' },
                        { name: 'Husi', human: 'Matias' },
                    ];
                    this.basicRowHeight = 80;
                    this.fixedCols = 4;
                    this.fixedRowHeight = 100;
                    this.ratioGutter = 1;
                    this.fitListHeight = '400px';
                    this.ratio = '4:1';
                }
                GridListDemo.prototype.addTileCols = function () { this.tiles[2].cols++; };
                return GridListDemo;
            }());
            exports_1("GridListDemo", GridListDemo);
            max = 0;
            CheckboxDemo = (function () {
                function CheckboxDemo() {
                    this.isIndeterminate = false;
                    this.isChecked = false;
                    this.isDisabled = false;
                    this.alignment = 'start';
                    this.useAlternativeColor = false;
                }
                CheckboxDemo.prototype.printResult = function () {
                    if (this.isIndeterminate) {
                        return 'Maybe!';
                    }
                    return this.isChecked ? 'Yes!' : 'No!';
                };
                CheckboxDemo.prototype.checkboxColor = function () {
                    return this.useAlternativeColor ? 'primary' : 'accent';
                };
                return CheckboxDemo;
            }());
            exports_1("CheckboxDemo", CheckboxDemo);
            ButtonDemo = (function () {
                function ButtonDemo() {
                    this.isDisabled = false;
                    this.clickCounter = 0;
                }
                return ButtonDemo;
            }());
            exports_1("ButtonDemo", ButtonDemo);
            InputDemo = (function () {
                function InputDemo() {
                    this.items = [
                        { value: 10 },
                        { value: 20 },
                        { value: 30 },
                        { value: 40 },
                        { value: 50 },
                    ];
                }
                InputDemo.prototype.addABunch = function (n) {
                    for (var x = 0; x < n; x++) {
                        this.items.push({ value: ++max });
                    }
                };
                return InputDemo;
            }());
            exports_1("InputDemo", InputDemo);
            ListDemo = (function () {
                function ListDemo() {
                    this.items = [
                        'Pepper',
                        'Salt',
                        'Paprika'
                    ];
                    this.contacts = [
                        { name: 'Nancy', headline: 'Software engineer' },
                        { name: 'Mary', headline: 'TPM' },
                        { name: 'Bobby', headline: 'UX designer' }
                    ];
                    this.messages = [
                        {
                            from: 'Nancy',
                            subject: 'Brunch?',
                            message: 'Did you want to go on Sunday? I was thinking that might work.',
                            image: 'https://angular.io/resources/images/bios/julie-ralph.jpg'
                        },
                        {
                            from: 'Mary',
                            subject: 'Summer BBQ',
                            message: 'Wish I could come, but I have some prior obligations.',
                            image: 'https://angular.io/resources/images/bios/juleskremer.jpg'
                        },
                        {
                            from: 'Bobby',
                            subject: 'Oui oui',
                            message: 'Do you have Paris reservations for the 15th? I just booked!',
                            image: 'https://angular.io/resources/images/bios/jelbourn.jpg'
                        }
                    ];
                    this.links = [
                        { name: 'Inbox' },
                        { name: 'Outbox' },
                        { name: 'Spam' },
                        { name: 'Trash' }
                    ];
                    this.thirdLine = false;
                    this.infoClicked = false;
                }
                return ListDemo;
            }());
            exports_1("ListDemo", ListDemo);
            LiveAnnouncerDemo = (function () {
                function LiveAnnouncerDemo(live) {
                    this.live = live;
                }
                LiveAnnouncerDemo.prototype.announceText = function (message) {
                    this.live.announce(message);
                };
                LiveAnnouncerDemo = __decorate([
                    core_1.Injectable({}), 
                    __metadata('design:paramtypes', [material_1.MdLiveAnnouncer])
                ], LiveAnnouncerDemo);
                return LiveAnnouncerDemo;
            }());
            exports_1("LiveAnnouncerDemo", LiveAnnouncerDemo);
            ProgressBarDemo = (function () {
                function ProgressBarDemo() {
                    this.determinateProgressValue = 30;
                    this.bufferProgressValue = 30;
                    this.bufferBufferValue = 40;
                }
                ProgressBarDemo.prototype.stepDeterminateProgressVal = function (val) {
                    this.determinateProgressValue += val;
                };
                ProgressBarDemo.prototype.stepBufferProgressVal = function (val) {
                    this.bufferProgressValue += val;
                };
                ProgressBarDemo.prototype.stepBufferBufferVal = function (val) {
                    this.bufferBufferValue += val;
                };
                return ProgressBarDemo;
            }());
            exports_1("ProgressBarDemo", ProgressBarDemo);
        }
    }
});
