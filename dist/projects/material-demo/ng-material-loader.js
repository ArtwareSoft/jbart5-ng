System.register(['jb-ui', '@angular/core', '@angular2-material/input/input', '@angular2-material/button/button', '@angular2-material/card/card', '@angular2-material/checkbox/checkbox', '@angular2-material/radio/radio', '@angular2-material/icon/icon', '@angular2-material/toolbar/toolbar', '@angular2-material/core/coordination/unique-selection-dispatcher'], function(exports_1, context_1) {
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
    var jb_ui, core_1, input_1, button_1, card_1, checkbox_1, radio_1, icon_1, toolbar_1, unique_selection_dispatcher_1;
    var BaselineDemo;
    return {
        setters:[
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (input_1_1) {
                input_1 = input_1_1;
            },
            function (button_1_1) {
                button_1 = button_1_1;
            },
            function (card_1_1) {
                card_1 = card_1_1;
            },
            function (checkbox_1_1) {
                checkbox_1 = checkbox_1_1;
            },
            function (radio_1_1) {
                radio_1 = radio_1_1;
            },
            function (icon_1_1) {
                icon_1 = icon_1_1;
            },
            function (toolbar_1_1) {
                toolbar_1 = toolbar_1_1;
            },
            function (unique_selection_dispatcher_1_1) {
                unique_selection_dispatcher_1 = unique_selection_dispatcher_1_1;
            }],
        execute: function() {
            BaselineDemo = (function () {
                function BaselineDemo() {
                }
                BaselineDemo = __decorate([
                    core_1.Component({
                        moduleId: module.id,
                        selector: 'baseline-demo',
                        templateUrl: 'baseline-demo.html',
                        styleUrls: ['baseline-demo.css'],
                        providers: [unique_selection_dispatcher_1.MdUniqueSelectionDispatcher],
                        directives: [
                            button_1.MD_BUTTON_DIRECTIVES,
                            card_1.MD_CARD_DIRECTIVES,
                            checkbox_1.MD_CHECKBOX_DIRECTIVES,
                            radio_1.MD_RADIO_DIRECTIVES,
                            input_1.MD_INPUT_DIRECTIVES,
                            icon_1.MdIcon,
                            toolbar_1.MdToolbar
                        ]
                    }), 
                    __metadata('design:paramtypes', [])
                ], BaselineDemo);
                return BaselineDemo;
            }());
            exports_1("BaselineDemo", BaselineDemo);
            jb_ui.registerDirectives({ MD_CHECKBOX_DIRECTIVES: checkbox_1.MD_CHECKBOX_DIRECTIVES, MD_RADIO_DIRECTIVES: radio_1.MD_RADIO_DIRECTIVES });
        }
    }
});
