System.register(['jb-ui', '@angular/core', '@angular2-material/checkbox/checkbox', '@angular2-material/radio/radio', '@angular2-material/button-toggle/button-toggle', '@angular2-material/grid-list/grid-list', '@angular2-material/list/list', '@angular2-material/menu/menu', '@angular2-material/core/portal/portal-directives', '@angular2-material/core/ripple/ripple', '@angular2-material/progress-bar/progress-bar', '@angular2-material/slider/slider', '@angular2-material/core/a11y/live-announcer', '@angular2-material/core/core', '@angular2-material/core/coordination/unique-selection-dispatcher'], function(exports_1, context_1) {
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
    var jb_ui, core_1, checkbox_1, radio_1, button_toggle_1, grid_list_1, list_1, menu_1, portal_directives_1, ripple_1, progress_bar_1, slider_1, live_announcer_1, core_2, unique_selection_dispatcher_1;
    var GesturesDemo, GridListDemo, max, InputDemo, ListDemo, LiveAnnouncerDemo, ProgressBarDemo;
    return {
        setters:[
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (checkbox_1_1) {
                checkbox_1 = checkbox_1_1;
            },
            function (radio_1_1) {
                radio_1 = radio_1_1;
            },
            function (button_toggle_1_1) {
                button_toggle_1 = button_toggle_1_1;
            },
            function (grid_list_1_1) {
                grid_list_1 = grid_list_1_1;
            },
            function (list_1_1) {
                list_1 = list_1_1;
            },
            function (menu_1_1) {
                menu_1 = menu_1_1;
            },
            function (portal_directives_1_1) {
                portal_directives_1 = portal_directives_1_1;
            },
            function (ripple_1_1) {
                ripple_1 = ripple_1_1;
            },
            function (progress_bar_1_1) {
                progress_bar_1 = progress_bar_1_1;
            },
            function (slider_1_1) {
                slider_1 = slider_1_1;
            },
            function (live_announcer_1_1) {
                live_announcer_1 = live_announcer_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (unique_selection_dispatcher_1_1) {
                unique_selection_dispatcher_1 = unique_selection_dispatcher_1_1;
            }],
        execute: function() {
            jb_ui.registerProviders({
                MdUniqueSelectionDispatcher: unique_selection_dispatcher_1.MdUniqueSelectionDispatcher,
                MdLiveAnnouncer: live_announcer_1.MdLiveAnnouncer,
                OVERLAY_PROVIDERS: core_2.OVERLAY_PROVIDERS,
            });
            jb_ui.registerDirectives({
                MD_CHECKBOX_DIRECTIVES: checkbox_1.MD_CHECKBOX_DIRECTIVES,
                MD_RADIO_DIRECTIVES: radio_1.MD_RADIO_DIRECTIVES,
                MD_BUTTON_TOGGLE_DIRECTIVES: button_toggle_1.MD_BUTTON_TOGGLE_DIRECTIVES,
                MD_GRID_LIST_DIRECTIVES: grid_list_1.MD_GRID_LIST_DIRECTIVES,
                MD_LIST_DIRECTIVES: list_1.MD_LIST_DIRECTIVES,
                MD_MENU_DIRECTIVES: menu_1.MD_MENU_DIRECTIVES,
                PORTAL_DIRECTIVES: portal_directives_1.PORTAL_DIRECTIVES,
                MD_RIPPLE_DIRECTIVES: ripple_1.MD_RIPPLE_DIRECTIVES,
                MD_PROGRESS_BAR_DIRECTIVES: progress_bar_1.MD_PROGRESS_BAR_DIRECTIVES,
                MD_SLIDER_DIRECTIVES: slider_1.MD_SLIDER_DIRECTIVES
            });
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
                    __metadata('design:paramtypes', [live_announcer_1.MdLiveAnnouncer])
                ], LiveAnnouncerDemo);
                return LiveAnnouncerDemo;
            }());
            exports_1("LiveAnnouncerDemo", LiveAnnouncerDemo);
            jb_ui.registerProviders({
                LiveAnnouncerDemo: LiveAnnouncerDemo,
            });
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
