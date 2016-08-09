System.register(['jb-ui', '@angular2-material/checkbox/checkbox', '@angular2-material/radio/radio', '@angular2-material/button-toggle/button-toggle', '@angular2-material/grid-list/grid-list', '@angular2-material/core/coordination/unique-selection-dispatcher'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_ui, checkbox_1, radio_1, button_toggle_1, grid_list_1, unique_selection_dispatcher_1;
    var GesturesDemo, GridListDemo, max, InputDemo;
    return {
        setters:[
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
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
            function (unique_selection_dispatcher_1_1) {
                unique_selection_dispatcher_1 = unique_selection_dispatcher_1_1;
            }],
        execute: function() {
            jb_ui.registerProviders({
                MdUniqueSelectionDispatcher: unique_selection_dispatcher_1.MdUniqueSelectionDispatcher,
            });
            jb_ui.registerDirectives({
                MD_CHECKBOX_DIRECTIVES: checkbox_1.MD_CHECKBOX_DIRECTIVES,
                MD_RADIO_DIRECTIVES: radio_1.MD_RADIO_DIRECTIVES,
                MD_BUTTON_TOGGLE_DIRECTIVES: button_toggle_1.MD_BUTTON_TOGGLE_DIRECTIVES,
                MD_GRID_LIST_DIRECTIVES: grid_list_1.MD_GRID_LIST_DIRECTIVES
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
        }
    }
});
