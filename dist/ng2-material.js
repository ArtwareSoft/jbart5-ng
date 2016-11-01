"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var Observable_1 = require('rxjs/Observable');
var unique_selection_dispatcher_1 = require('@angular2-material/core/coordination/unique-selection-dispatcher');
var field_value_1 = require('@angular2-material/core/annotations/field-value');
/**
 * Provider Expression that allows md-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 */
exports.MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MdButtonToggleGroup; }),
    multi: true
};
var _uniqueIdCounter = 0;
/** A simple change event emitted by either MdButtonToggle or MdButtonToggleGroup. */
var MdButtonToggleChange = (function () {
    function MdButtonToggleChange() {
    }
    return MdButtonToggleChange;
}());
exports.MdButtonToggleChange = MdButtonToggleChange;
/** Exclusive selection button toggle group that behaves like a radio-button group. */
var MdButtonToggleGroup = (function () {
    function MdButtonToggleGroup() {
        /** The value for the button toggle group. Should match currently selected button toggle. */
        this._value = null;
        /** The HTML name attribute applied to toggles in this group. */
        this._name = "md-radio-group-" + _uniqueIdCounter++;
        /** Disables all toggles in the group. */
        this._disabled = null;
        /** The currently selected button toggle, should match the value. */
        this._selected = null;
        /** The method to be called in order to update ngModel. */
        this._controlValueAccessorChangeFn = function (value) { };
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = function () { };
        /** Event emitted when the group's value changes. */
        this._change = new core_1.EventEmitter();
        /** Child button toggle buttons. */
        this._buttonToggles = null;
    }
    Object.defineProperty(MdButtonToggleGroup.prototype, "change", {
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
            this._updateButtonToggleNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            if (this._value != newValue) {
                this._value = newValue;
                this._updateSelectedButtonToggleFromValue();
                this._emitChangeEvent();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    MdButtonToggleGroup.prototype._updateButtonToggleNames = function () {
        var _this = this;
        (this._buttonToggles || []).forEach(function (toggle) {
            toggle.name = _this._name;
        });
    };
    // TODO: Refactor into shared code with radio.
    MdButtonToggleGroup.prototype._updateSelectedButtonToggleFromValue = function () {
        var _this = this;
        var isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            var matchingButtonToggle = this._buttonToggles.filter(function (buttonToggle) { return buttonToggle.value == _this._value; })[0];
            if (matchingButtonToggle) {
                this.selected = matchingButtonToggle;
            }
            else if (this.value == null) {
                this.selected = null;
                this._buttonToggles.forEach(function (buttonToggle) {
                    buttonToggle.checked = false;
                });
            }
        }
    };
    /** Dispatch change event with current selection and group value. */
    MdButtonToggleGroup.prototype._emitChangeEvent = function () {
        var event = new MdButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this._change.emit(event);
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdButtonToggleGroup.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdButtonToggleGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdButtonToggleGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Observable_1.Observable)
    ], MdButtonToggleGroup.prototype, "change", null);
    __decorate([
        core_1.ContentChildren(core_1.forwardRef(function () { return MdButtonToggle; })), 
        __metadata('design:type', core_1.QueryList)
    ], MdButtonToggleGroup.prototype, "_buttonToggles", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdButtonToggleGroup.prototype, "name", null);
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggleGroup.prototype, "disabled", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdButtonToggleGroup.prototype, "value", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdButtonToggleGroup.prototype, "selected", null);
    MdButtonToggleGroup = __decorate([
        core_1.Directive({
            selector: 'md-button-toggle-group:not([multiple])',
            providers: [exports.MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
            host: {
                'role': 'radiogroup',
            },
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonToggleGroup);
    return MdButtonToggleGroup;
}());
exports.MdButtonToggleGroup = MdButtonToggleGroup;
/** Multiple selection button-toggle group. */
var MdButtonToggleGroupMultiple = (function () {
    function MdButtonToggleGroupMultiple() {
        /** Disables all toggles in the group. */
        this._disabled = null;
    }
    Object.defineProperty(MdButtonToggleGroupMultiple.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggleGroupMultiple.prototype, "disabled", null);
    MdButtonToggleGroupMultiple = __decorate([
        core_1.Directive({
            selector: 'md-button-toggle-group[multiple]',
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonToggleGroupMultiple);
    return MdButtonToggleGroupMultiple;
}());
exports.MdButtonToggleGroupMultiple = MdButtonToggleGroupMultiple;
var MdButtonToggle = (function () {
    function MdButtonToggle(toggleGroup, toggleGroupMultiple, buttonToggleDispatcher) {
        var _this = this;
        this.buttonToggleDispatcher = buttonToggleDispatcher;
        /** Whether or not this button toggle is checked. */
        this._checked = false;
        /** Whether or not this button toggle is disabled. */
        this._disabled = null;
        /** Value assigned to this button toggle. */
        this._value = null;
        /** Whether or not the button toggle is a single selection. */
        this._isSingleSelector = null;
        /** Event emitted when the group value changes. */
        this._change = new core_1.EventEmitter();
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            buttonToggleDispatcher.listen(function (id, name) {
                if (id != _this.id && name == _this.name) {
                    _this.checked = false;
                }
            });
            this._type = 'radio';
            this.name = this.buttonToggleGroup.name;
            this._isSingleSelector = true;
        }
        else {
            // Even if there is no group at all, treat the button toggle as a checkbox so it can be
            // toggled on or off.
            this._type = 'checkbox';
            this._isSingleSelector = false;
        }
    }
    Object.defineProperty(MdButtonToggle.prototype, "change", {
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    MdButtonToggle.prototype.ngOnInit = function () {
        if (this.id == null) {
            this.id = "md-button-toggle-" + _uniqueIdCounter++;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
    };
    Object.defineProperty(MdButtonToggle.prototype, "inputId", {
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (newCheckedState) {
            if (this._isSingleSelector) {
                if (newCheckedState) {
                    // Notify all button toggles with the same name (in the same group) to un-check.
                    this.buttonToggleDispatcher.notify(this.id, this.name);
                }
            }
            this._checked = newCheckedState;
            if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
                this.buttonToggleGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "value", {
        /** MdButtonToggleGroup reads this to assign its own value. */
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (this._value != value) {
                if (this.buttonToggleGroup != null && this.checked) {
                    this.buttonToggleGroup.value = value;
                }
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /** Dispatch change event with current value. */
    MdButtonToggle.prototype._emitChangeEvent = function () {
        var event = new MdButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this._change.emit(event);
    };
    Object.defineProperty(MdButtonToggle.prototype, "disabled", {
        get: function () {
            return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
                (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
        },
        set: function (value) {
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    /** Toggle the state of the current button toggle. */
    MdButtonToggle.prototype._toggle = function () {
        this.checked = !this.checked;
    };
    /** Checks the button toggle due to an interaction with the underlying native input. */
    MdButtonToggle.prototype._onInputChange = function (event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            this.checked = true;
            this.buttonToggleGroup.selected = this;
            this.buttonToggleGroup.onTouched();
        }
        else {
            this._toggle();
        }
        // Emit a change event when the native input does.
        this._emitChangeEvent();
    };
    /** TODO: internal */
    MdButtonToggle.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    __decorate([
        core_1.HostBinding(),
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdButtonToggle.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdButtonToggle.prototype, "name", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Observable_1.Observable)
    ], MdButtonToggle.prototype, "change", null);
    __decorate([
        core_1.HostBinding('class.md-button-toggle-checked'),
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggle.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdButtonToggle.prototype, "value", null);
    __decorate([
        core_1.HostBinding('class.md-button-toggle-disabled'),
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdButtonToggle.prototype, "disabled", null);
    MdButtonToggle = __decorate([
        core_1.Component({            selector: 'md-button-toggle',
            template: "<label [attr.for]=\"inputId\" class=\"md-button-toggle-label\"> <input #input class=\"md-button-toggle-input\" [type]=\"_type\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"> <div class=\"md-button-toggle-label-content\"> <ng-content></ng-content> </div> </label> ",
            styles: ["/** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ /** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ md-button-toggle-group { box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); position: relative; display: -webkit-inline-box; display: -ms-inline-flexbox; display: inline-flex; border-radius: 3px; cursor: pointer; white-space: nowrap; } .md-button-toggle-checked .md-button-toggle-label-content { background-color: #e0e0e0; } .md-button-toggle-disabled .md-button-toggle-label-content { background-color: rgba(0, 0, 0, 0.38); cursor: not-allowed; } md-button-toggle { white-space: nowrap; } .md-button-toggle-input { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; text-transform: none; width: 1px; } .md-button-toggle-label-content { display: inline-block; line-height: 36px; padding: 0 16px; cursor: pointer; } .md-button-toggle-label-content > * { vertical-align: middle; } "],
            encapsulation: core_1.ViewEncapsulation.None,
        }),
        __param(0, core_1.Optional()),
        __param(1, core_1.Optional()), 
        __metadata('design:paramtypes', [MdButtonToggleGroup, MdButtonToggleGroupMultiple, unique_selection_dispatcher_1.MdUniqueSelectionDispatcher])
    ], MdButtonToggle);
    return MdButtonToggle;
}());
exports.MdButtonToggle = MdButtonToggle;
/** @deprecated */
exports.MD_BUTTON_TOGGLE_DIRECTIVES = [
    MdButtonToggleGroup,
    MdButtonToggleGroupMultiple,
    MdButtonToggle
];
var MdButtonToggleModule = (function () {
    function MdButtonToggleModule() {
    }
    MdButtonToggleModule = __decorate([
        core_1.NgModule({
            imports: [forms_1.FormsModule],
            exports: exports.MD_BUTTON_TOGGLE_DIRECTIVES,
            declarations: exports.MD_BUTTON_TOGGLE_DIRECTIVES,
            providers: [unique_selection_dispatcher_1.MdUniqueSelectionDispatcher],
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonToggleModule);
    return MdButtonToggleModule;
}());
exports.MdButtonToggleModule = MdButtonToggleModule;
//# sourceMappingURL=button-toggle.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var field_value_1 = require('@angular2-material/core/annotations/field-value');
var ripple_1 = require('@angular2-material/core/ripple/ripple');
// TODO(jelbourn): Make the `isMouseDown` stuff done with one global listener.
// TODO(kara): Convert attribute selectors to classes when attr maps become available
var MdButton = (function () {
    function MdButton(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
        this._isKeyboardFocused = false;
        /** Whether a mousedown has occurred on this element in the last 100ms. */
        this._isMouseDown = false;
        /** Whether the ripple effect on click should be disabled. */
        this.disableRipple = false;
    }
    Object.defineProperty(MdButton.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdButton.prototype._setMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this._isMouseDown = true;
        setTimeout(function () { _this._isMouseDown = false; }, 100);
    };
    MdButton.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdButton.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    MdButton.prototype._setKeyboardFocus = function () {
        this._isKeyboardFocused = !this._isMouseDown;
    };
    MdButton.prototype._removeKeyboardFocus = function () {
        this._isKeyboardFocused = false;
    };
    /** TODO(hansl): e2e test this function. */
    MdButton.prototype.focus = function () {
        this._elementRef.nativeElement.focus();
    };
    MdButton.prototype.getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    MdButton.prototype.isRoundButton = function () {
        var el = this._elementRef.nativeElement;
        return el.hasAttribute('md-icon-button') ||
            el.hasAttribute('md-fab') ||
            el.hasAttribute('md-mini-fab');
    };
    MdButton.prototype.isRippleEnabled = function () {
        return !this.disableRipple;
    };
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdButton.prototype, "disableRipple", void 0);
    MdButton = __decorate([
        core_1.Component({            selector: 'button[md-button], button[md-raised-button], button[md-icon-button], ' +
                'button[md-fab], button[md-mini-fab]',
            inputs: ['color'],
            host: {
                '[class.md-button-focus]': '_isKeyboardFocused',
                '(mousedown)': '_setMousedown()',
                '(focus)': '_setKeyboardFocus()',
                '(blur)': '_removeKeyboardFocus()',
            },
            template: "<span class=\"md-button-wrapper\"><ng-content></ng-content></span> <div md-ripple *ngIf=\"isRippleEnabled()\" class=\"md-button-ripple\" [class.md-button-ripple-round]=\"isRoundButton()\" [md-ripple-trigger]=\"getHostElement()\" [md-ripple-color]=\"isRoundButton() ? 'rgba(255, 255, 255, 0.2)' : ''\" md-ripple-background-color=\"rgba(0, 0, 0, 0)\"></div> ",
            styles: ["/** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ /** * This mixin overrides default button styles like the gray background, * the border, and the outline. */ /** Applies a property to an md-button element for each of the supported palettes. */ /** Applies a focus style to an md-button element for each of the supported palettes. */ [md-raised-button], [md-fab], [md-mini-fab], [md-button], [md-icon-button] { box-sizing: border-box; position: relative; background: transparent; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; outline: none; border: none; display: inline-block; white-space: nowrap; text-decoration: none; vertical-align: baseline; font-size: 14px; font-family: Roboto, \"Helvetica Neue\", sans-serif; font-weight: 500; color: currentColor; text-align: center; margin: 0; min-width: 88px; line-height: 36px; padding: 0 16px; border-radius: 3px; } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab], .md-primary[md-button], .md-primary[md-icon-button] { color: #009688; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab], .md-accent[md-button], .md-accent[md-icon-button] { color: #9c27b0; } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab], .md-warn[md-button], .md-warn[md-icon-button] { color: #f44336; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-primary[disabled][md-button], .md-primary[disabled][md-icon-button], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-accent[disabled][md-button], .md-accent[disabled][md-icon-button], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], .md-warn[disabled][md-button], .md-warn[disabled][md-icon-button], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab], [disabled][disabled][md-button], [disabled][disabled][md-icon-button] { color: rgba(0, 0, 0, 0.38); } [disabled][md-raised-button], [disabled][md-fab], [disabled][md-mini-fab], [disabled][md-button], [disabled][md-icon-button] { cursor: default; } .md-button-focus[md-raised-button]::after, .md-button-focus[md-fab]::after, .md-button-focus[md-mini-fab]::after, .md-button-focus[md-button]::after, .md-button-focus[md-icon-button]::after { position: absolute; top: 0; left: 0; bottom: 0; right: 0; content: ''; background-color: rgba(0, 0, 0, 0.12); border-radius: inherit; pointer-events: none; } .md-button-focus.md-primary[md-raised-button]::after, .md-button-focus.md-primary[md-fab]::after, .md-button-focus.md-primary[md-mini-fab]::after, .md-button-focus.md-primary[md-button]::after, .md-button-focus.md-primary[md-icon-button]::after { background-color: rgba(0, 150, 136, 0.12); } .md-button-focus.md-accent[md-raised-button]::after, .md-button-focus.md-accent[md-fab]::after, .md-button-focus.md-accent[md-mini-fab]::after, .md-button-focus.md-accent[md-button]::after, .md-button-focus.md-accent[md-icon-button]::after { background-color: rgba(156, 39, 176, 0.12); } .md-button-focus.md-warn[md-raised-button]::after, .md-button-focus.md-warn[md-fab]::after, .md-button-focus.md-warn[md-mini-fab]::after, .md-button-focus.md-warn[md-button]::after, .md-button-focus.md-warn[md-icon-button]::after { background-color: rgba(244, 67, 54, 0.12); } [md-raised-button], [md-fab], [md-mini-fab] { box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); background-color: #fafafa; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); -webkit-transition: background 400ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); transition: background 400ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab] { color: white; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab] { color: rgba(255, 255, 255, 0.870588); } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab] { color: white; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab] { color: rgba(0, 0, 0, 0.38); } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab] { background-color: #009688; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab] { background-color: #9c27b0; } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab] { background-color: #f44336; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab] { background-color: rgba(0, 0, 0, 0.12); } [md-raised-button]:active, [md-fab]:active, [md-mini-fab]:active { box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12); } [disabled][md-raised-button], [disabled][md-fab], [disabled][md-mini-fab] { box-shadow: none; } [md-button][disabled]:hover.md-primary, [md-button][disabled]:hover.md-accent, [md-button][disabled]:hover.md-warn, [md-button][disabled]:hover:hover { background-color: transparent; } [md-fab] { min-width: 0; border-radius: 50%; background-color: #9c27b0; color: rgba(255, 255, 255, 0.870588); width: 56px; height: 56px; padding: 0; } [md-fab] i, [md-fab] md-icon { padding: 16px 0; } [md-mini-fab] { min-width: 0; border-radius: 50%; background-color: #9c27b0; color: rgba(255, 255, 255, 0.870588); width: 40px; height: 40px; padding: 0; } [md-mini-fab] i, [md-mini-fab] md-icon { padding: 8px 0; } [md-icon-button] { min-width: 0; padding: 0; width: 40px; height: 40px; line-height: 24px; border-radius: 50%; } [md-icon-button] .md-button-wrapper > * { vertical-align: middle; } .md-button-ripple { position: absolute; top: 0; left: 0; bottom: 0; right: 0; } .md-button-ripple-round { border-radius: 50%; z-index: 1; } [md-button]:hover::after, [md-icon-button]:hover::after { position: absolute; top: 0; left: 0; bottom: 0; right: 0; content: ''; background-color: rgba(0, 0, 0, 0.12); border-radius: inherit; pointer-events: none; } [md-button]:hover.md-primary::after, [md-icon-button]:hover.md-primary::after { background-color: rgba(0, 150, 136, 0.12); } [md-button]:hover.md-accent::after, [md-icon-button]:hover.md-accent::after { background-color: rgba(156, 39, 176, 0.12); } [md-button]:hover.md-warn::after, [md-icon-button]:hover.md-warn::after { background-color: rgba(244, 67, 54, 0.12); } @media screen and (-ms-high-contrast: active) { .md-raised-button, .md-fab, .md-mini-fab { border: 1px solid #fff; } } "],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], MdButton);
    return MdButton;
}());
exports.MdButton = MdButton;
var MdAnchor = (function (_super) {
    __extends(MdAnchor, _super);
    function MdAnchor(elementRef, renderer) {
        _super.call(this, elementRef, renderer);
        this._disabled = null;
    }
    Object.defineProperty(MdAnchor.prototype, "tabIndex", {
        get: function () {
            return this.disabled ? -1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAnchor.prototype, "isAriaDisabled", {
        get: function () {
            return this.disabled ? 'true' : 'false';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAnchor.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = (value != null && value != false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    MdAnchor.prototype._haltDisabledEvents = function (event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    __decorate([
        core_1.HostBinding('tabIndex'), 
        __metadata('design:type', Number)
    ], MdAnchor.prototype, "tabIndex", null);
    __decorate([
        core_1.HostBinding('attr.aria-disabled'), 
        __metadata('design:type', String)
    ], MdAnchor.prototype, "isAriaDisabled", null);
    __decorate([
        core_1.HostBinding('attr.disabled'),
        core_1.Input('disabled'), 
        __metadata('design:type', Object)
    ], MdAnchor.prototype, "disabled", null);
    MdAnchor = __decorate([
        core_1.Component({            selector: 'a[md-button], a[md-raised-button], a[md-icon-button], a[md-fab], a[md-mini-fab]',
            inputs: ['color'],
            host: {
                '[class.md-button-focus]': '_isKeyboardFocused',
                '(mousedown)': '_setMousedown()',
                '(focus)': '_setKeyboardFocus()',
                '(blur)': '_removeKeyboardFocus()',
                '(click)': '_haltDisabledEvents($event)',
            },
            template: "<span class=\"md-button-wrapper\"><ng-content></ng-content></span> <div md-ripple *ngIf=\"isRippleEnabled()\" class=\"md-button-ripple\" [class.md-button-ripple-round]=\"isRoundButton()\" [md-ripple-trigger]=\"getHostElement()\" [md-ripple-color]=\"isRoundButton() ? 'rgba(255, 255, 255, 0.2)' : ''\" md-ripple-background-color=\"rgba(0, 0, 0, 0)\"></div> ",
            styles: ["/** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ /** * This mixin overrides default button styles like the gray background, * the border, and the outline. */ /** Applies a property to an md-button element for each of the supported palettes. */ /** Applies a focus style to an md-button element for each of the supported palettes. */ [md-raised-button], [md-fab], [md-mini-fab], [md-button], [md-icon-button] { box-sizing: border-box; position: relative; background: transparent; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; outline: none; border: none; display: inline-block; white-space: nowrap; text-decoration: none; vertical-align: baseline; font-size: 14px; font-family: Roboto, \"Helvetica Neue\", sans-serif; font-weight: 500; color: currentColor; text-align: center; margin: 0; min-width: 88px; line-height: 36px; padding: 0 16px; border-radius: 3px; } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab], .md-primary[md-button], .md-primary[md-icon-button] { color: #009688; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab], .md-accent[md-button], .md-accent[md-icon-button] { color: #9c27b0; } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab], .md-warn[md-button], .md-warn[md-icon-button] { color: #f44336; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-primary[disabled][md-button], .md-primary[disabled][md-icon-button], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-accent[disabled][md-button], .md-accent[disabled][md-icon-button], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], .md-warn[disabled][md-button], .md-warn[disabled][md-icon-button], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab], [disabled][disabled][md-button], [disabled][disabled][md-icon-button] { color: rgba(0, 0, 0, 0.38); } [disabled][md-raised-button], [disabled][md-fab], [disabled][md-mini-fab], [disabled][md-button], [disabled][md-icon-button] { cursor: default; } .md-button-focus[md-raised-button]::after, .md-button-focus[md-fab]::after, .md-button-focus[md-mini-fab]::after, .md-button-focus[md-button]::after, .md-button-focus[md-icon-button]::after { position: absolute; top: 0; left: 0; bottom: 0; right: 0; content: ''; background-color: rgba(0, 0, 0, 0.12); border-radius: inherit; pointer-events: none; } .md-button-focus.md-primary[md-raised-button]::after, .md-button-focus.md-primary[md-fab]::after, .md-button-focus.md-primary[md-mini-fab]::after, .md-button-focus.md-primary[md-button]::after, .md-button-focus.md-primary[md-icon-button]::after { background-color: rgba(0, 150, 136, 0.12); } .md-button-focus.md-accent[md-raised-button]::after, .md-button-focus.md-accent[md-fab]::after, .md-button-focus.md-accent[md-mini-fab]::after, .md-button-focus.md-accent[md-button]::after, .md-button-focus.md-accent[md-icon-button]::after { background-color: rgba(156, 39, 176, 0.12); } .md-button-focus.md-warn[md-raised-button]::after, .md-button-focus.md-warn[md-fab]::after, .md-button-focus.md-warn[md-mini-fab]::after, .md-button-focus.md-warn[md-button]::after, .md-button-focus.md-warn[md-icon-button]::after { background-color: rgba(244, 67, 54, 0.12); } [md-raised-button], [md-fab], [md-mini-fab] { box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); background-color: #fafafa; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); -webkit-transition: background 400ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); transition: background 400ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab] { color: white; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab] { color: rgba(255, 255, 255, 0.870588); } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab] { color: white; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab] { color: rgba(0, 0, 0, 0.38); } .md-primary[md-raised-button], .md-primary[md-fab], .md-primary[md-mini-fab] { background-color: #009688; } .md-accent[md-raised-button], .md-accent[md-fab], .md-accent[md-mini-fab] { background-color: #9c27b0; } .md-warn[md-raised-button], .md-warn[md-fab], .md-warn[md-mini-fab] { background-color: #f44336; } .md-primary[disabled][md-raised-button], .md-primary[disabled][md-fab], .md-primary[disabled][md-mini-fab], .md-accent[disabled][md-raised-button], .md-accent[disabled][md-fab], .md-accent[disabled][md-mini-fab], .md-warn[disabled][md-raised-button], .md-warn[disabled][md-fab], .md-warn[disabled][md-mini-fab], [disabled][disabled][md-raised-button], [disabled][disabled][md-fab], [disabled][disabled][md-mini-fab] { background-color: rgba(0, 0, 0, 0.12); } [md-raised-button]:active, [md-fab]:active, [md-mini-fab]:active { box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12); } [disabled][md-raised-button], [disabled][md-fab], [disabled][md-mini-fab] { box-shadow: none; } [md-button][disabled]:hover.md-primary, [md-button][disabled]:hover.md-accent, [md-button][disabled]:hover.md-warn, [md-button][disabled]:hover:hover { background-color: transparent; } [md-fab] { min-width: 0; border-radius: 50%; background-color: #9c27b0; color: rgba(255, 255, 255, 0.870588); width: 56px; height: 56px; padding: 0; } [md-fab] i, [md-fab] md-icon { padding: 16px 0; } [md-mini-fab] { min-width: 0; border-radius: 50%; background-color: #9c27b0; color: rgba(255, 255, 255, 0.870588); width: 40px; height: 40px; padding: 0; } [md-mini-fab] i, [md-mini-fab] md-icon { padding: 8px 0; } [md-icon-button] { min-width: 0; padding: 0; width: 40px; height: 40px; line-height: 24px; border-radius: 50%; } [md-icon-button] .md-button-wrapper > * { vertical-align: middle; } .md-button-ripple { position: absolute; top: 0; left: 0; bottom: 0; right: 0; } .md-button-ripple-round { border-radius: 50%; z-index: 1; } [md-button]:hover::after, [md-icon-button]:hover::after { position: absolute; top: 0; left: 0; bottom: 0; right: 0; content: ''; background-color: rgba(0, 0, 0, 0.12); border-radius: inherit; pointer-events: none; } [md-button]:hover.md-primary::after, [md-icon-button]:hover.md-primary::after { background-color: rgba(0, 150, 136, 0.12); } [md-button]:hover.md-accent::after, [md-icon-button]:hover.md-accent::after { background-color: rgba(156, 39, 176, 0.12); } [md-button]:hover.md-warn::after, [md-icon-button]:hover.md-warn::after { background-color: rgba(244, 67, 54, 0.12); } @media screen and (-ms-high-contrast: active) { .md-raised-button, .md-fab, .md-mini-fab { border: 1px solid #fff; } } "],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], MdAnchor);
    return MdAnchor;
}(MdButton));
exports.MdAnchor = MdAnchor;
/** @deprecated */
exports.MD_BUTTON_DIRECTIVES = [MdButton, MdAnchor];
var MdButtonModule = (function () {
    function MdButtonModule() {
    }
    MdButtonModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, ripple_1.MdRippleModule],
            exports: exports.MD_BUTTON_DIRECTIVES,
            declarations: exports.MD_BUTTON_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonModule);
    return MdButtonModule;
}());
exports.MdButtonModule = MdButtonModule;
//# sourceMappingURL=button.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/*

<md-card> is a basic content container component that adds the styles of a material design card.

While you can use this component alone,
it also provides a number of preset styles for common card sections, including:
 - md-card-title
 - md-card-subtitle
 - md-card-content
 - md-card-actions
 - md-card-footer

 You can see some examples of cards here:
 http://embed.plnkr.co/s5O4YcyvbLhIApSrIhtj/

 TODO(kara): update link to demo site when it exists

*/
var MdCard = (function () {
    function MdCard() {
    }
    MdCard = __decorate([
        core_1.Component({            selector: 'md-card',
            template: "<div class=\"md-card\"> <ng-content></ng-content> </div> ",
            styles: ["/** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ md-card { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); -webkit-transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); will-change: box-shadow; display: block; position: relative; padding: 24px; border-radius: 2px; font-family: Roboto, \"Helvetica Neue\", sans-serif; background: white; color: black; } md-card:hover { box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); } .md-card-flat { box-shadow: none; } md-card-title, md-card-subtitle, md-card-content, md-card-actions { display: block; margin-bottom: 16px; } md-card-title { font-size: 24px; font-weight: 400; } md-card-subtitle { font-size: 14px; color: rgba(0, 0, 0, 0.54); } md-card-content { font-size: 14px; } md-card-actions { margin-left: -16px; margin-right: -16px; padding: 8px 0; } md-card-actions[align='end'] { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: end; -ms-flex-pack: end; justify-content: flex-end; } [md-card-image] { width: calc(100% + 48px); margin: 0 -24px 16px -24px; } [md-card-xl-image] { width: 240px; height: 240px; margin: -8px; } md-card-footer { position: absolute; bottom: 0; } md-card-actions [md-button], md-card-actions [md-raised-button] { margin: 0 4px; } /* HEADER STYLES */ md-card-header { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; height: 40px; margin: -8px 0 16px 0; } .md-card-header-text { height: 40px; margin: 0 8px; } [md-card-avatar] { height: 40px; width: 40px; border-radius: 50%; } md-card-header md-card-title { font-size: 14px; } /* TITLE-GROUP STYLES */ [md-card-sm-image], [md-card-md-image], [md-card-lg-image] { margin: -8px 0; } md-card-title-group { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between; margin: 0 -8px; } [md-card-sm-image] { width: 80px; height: 80px; } [md-card-md-image] { width: 112px; height: 112px; } [md-card-lg-image] { width: 152px; height: 152px; } /* MEDIA QUERIES */ @media (max-width: 600px) { md-card { padding: 24px 16px; } [md-card-image] { width: calc(100% + 32px); margin: 16px -16px; } md-card-title-group { margin: 0; } [md-card-xl-image] { margin-left: 0; margin-right: 0; } md-card-header { margin: -8px 0 0 0; } } /* FIRST/LAST CHILD ADJUSTMENTS */ .md-card > :first-child, md-card-content > :first-child { margin-top: 0; } .md-card > :last-child, md-card-content > :last-child { margin-bottom: 0; } [md-card-image]:first-child { margin-top: -24px; } .md-card > md-card-actions:last-child { margin-bottom: -16px; padding-bottom: 0; } md-card-actions [md-button]:first-child, md-card-actions [md-raised-button]:first-child { margin-left: 0; margin-right: 0; } md-card-title:not(:first-child), md-card-subtitle:not(:first-child) { margin-top: -4px; } md-card-header md-card-subtitle:not(:first-child) { margin-top: -8px; } .md-card > [md-card-xl-image]:first-child { margin-top: -8px; } .md-card > [md-card-xl-image]:last-child { margin-bottom: -8px; } "],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCard);
    return MdCard;
}());
exports.MdCard = MdCard;
/*  The following components don't have any behavior.
 They simply use content projection to wrap user content
 for flex layout purposes in <md-card> (and thus allow a cleaner, boilerplate-free API).


<md-card-header> is a component intended to be used within the <md-card> component.
It adds styles for a preset header section (i.e. a title, subtitle, and avatar layout).

You can see an example of a card with a header here:
http://embed.plnkr.co/tvJl19z3gZTQd6WmwkIa/

TODO(kara): update link to demo site when it exists
*/
var MdCardHeader = (function () {
    function MdCardHeader() {
    }
    MdCardHeader = __decorate([
        core_1.Component({            selector: 'md-card-header',
            template: "<ng-content select=\"[md-card-avatar]\"></ng-content> <div class=\"md-card-header-text\"> <ng-content select=\"md-card-title, md-card-subtitle\"></ng-content> </div> <ng-content></ng-content> ",
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardHeader);
    return MdCardHeader;
}());
exports.MdCardHeader = MdCardHeader;
/*

<md-card-title-group> is a component intended to be used within the <md-card> component.
It adds styles for a preset layout that groups an image with a title section.

You can see an example of a card with a title-group section here:
http://embed.plnkr.co/EDfgCF9eKcXjini1WODm/

TODO(kara): update link to demo site when it exists
*/
var MdCardTitleGroup = (function () {
    function MdCardTitleGroup() {
    }
    MdCardTitleGroup = __decorate([
        core_1.Component({            selector: 'md-card-title-group',
            template: "<div> <ng-content select=\"md-card-title, md-card-subtitle\"></ng-content> </div> <ng-content select=\"img\"></ng-content> <ng-content></ng-content> ",
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardTitleGroup);
    return MdCardTitleGroup;
}());
exports.MdCardTitleGroup = MdCardTitleGroup;
/** @deprecated */
exports.MD_CARD_DIRECTIVES = [MdCard, MdCardHeader, MdCardTitleGroup];
var MdCardModule = (function () {
    function MdCardModule() {
    }
    MdCardModule = __decorate([
        core_1.NgModule({
            exports: exports.MD_CARD_DIRECTIVES,
            declarations: exports.MD_CARD_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardModule);
    return MdCardModule;
}());
exports.MdCardModule = MdCardModule;
//# sourceMappingURL=card.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
/**
 * Monotonically increasing integer used to auto-generate unique ids for checkbox components.
 */
var nextId = 0;
/**
 * Provider Expression that allows md-checkbox to register as a ControlValueAccessor. This allows it
 * to support [(ngModel)].
 */
exports.MD_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MdCheckbox; }),
    multi: true
};
/**
 * Represents the different states that require custom transitions between them.
 */
var TransitionCheckState;
(function (TransitionCheckState) {
    /** The initial state of the component before any user interaction. */
    TransitionCheckState[TransitionCheckState["Init"] = 0] = "Init";
    /** The state representing the component when it's becoming checked. */
    TransitionCheckState[TransitionCheckState["Checked"] = 1] = "Checked";
    /** The state representing the component when it's becoming unchecked. */
    TransitionCheckState[TransitionCheckState["Unchecked"] = 2] = "Unchecked";
    /** The state representing the component when it's becoming indeterminate. */
    TransitionCheckState[TransitionCheckState["Indeterminate"] = 3] = "Indeterminate";
})(TransitionCheckState || (TransitionCheckState = {}));
// A simple change event emitted by the MdCheckbox component.
var MdCheckboxChange = (function () {
    function MdCheckboxChange() {
    }
    return MdCheckboxChange;
}());
exports.MdCheckboxChange = MdCheckboxChange;
/**
 * A material design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. An MdCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://www.google.com/design/spec/components/selection-controls.html
 */
var MdCheckbox = (function () {
    function MdCheckbox(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /**
         * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
         * take precedence so this may be omitted.
         */
        this.ariaLabel = '';
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        this.ariaLabelledby = null;
        /** A unique id for the checkbox. If one is not supplied, it is auto-generated. */
        this.id = "md-checkbox-" + ++nextId;
        /** Whether or not the checkbox should come before or after the label. */
        this.align = 'start';
        /**
         * Whether the checkbox is disabled. When the checkbox is disabled it cannot be interacted with.
         * The correct ARIA attributes are applied to denote this to assistive technology.
         */
        this.disabled = false;
        /**
         * The tabindex attribute for the checkbox. Note that when the checkbox is disabled, the attribute
         * on the host element will be removed. It will be placed back when the checkbox is re-enabled.
         */
        this.tabindex = 0;
        /** Name value will be applied to the input element if present */
        this.name = null;
        /** Event emitted when the checkbox's `checked` value changes. */
        this.change = new core_1.EventEmitter();
        /** Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor. */
        this.onTouched = function () { };
        this._currentAnimationClass = '';
        this._currentCheckState = TransitionCheckState.Init;
        this._checked = false;
        this._indeterminate = false;
        this._controlValueAccessorChangeFn = function (value) { };
        this.hasFocus = false;
    }
    Object.defineProperty(MdCheckbox.prototype, "inputId", {
        /** ID to be applied to the `input` element */
        get: function () {
            return "input-" + this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "checked", {
        /**
         * Whether the checkbox is checked. Note that setting `checked` will immediately set
         * `indeterminate` to false.
         */
        get: function () {
            return this._checked;
        },
        set: function (checked) {
            if (checked != this.checked) {
                this._indeterminate = false;
                this._checked = checked;
                this._transitionCheckState(this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "indeterminate", {
        /**
         * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
         * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
         * checkable items. Note that whenever `checked` is set, indeterminate is immediately set to
         * false. This differs from the web platform in that indeterminate state on native
         * checkboxes is only remove when the user manually checks the checkbox (rather than setting the
         * `checked` property programmatically). However, we feel that this behavior is more accommodating
         * to the way consumers would envision using this component.
         */
        get: function () {
            return this._indeterminate;
        },
        set: function (indeterminate) {
            this._indeterminate = indeterminate;
            if (this._indeterminate) {
                this._transitionCheckState(TransitionCheckState.Indeterminate);
            }
            else {
                this._transitionCheckState(this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdCheckbox.prototype.writeValue = function (value) {
        this.checked = !!value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdCheckbox.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdCheckbox.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    MdCheckbox.prototype._transitionCheckState = function (newState) {
        var oldState = this._currentCheckState;
        var renderer = this._renderer;
        var elementRef = this._elementRef;
        if (oldState === newState) {
            return;
        }
        if (this._currentAnimationClass.length > 0) {
            renderer.setElementClass(elementRef.nativeElement, this._currentAnimationClass, false);
        }
        this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(oldState, newState);
        this._currentCheckState = newState;
        if (this._currentAnimationClass.length > 0) {
            renderer.setElementClass(elementRef.nativeElement, this._currentAnimationClass, true);
        }
    };
    MdCheckbox.prototype._emitChangeEvent = function () {
        var event = new MdCheckboxChange();
        event.source = this;
        event.checked = this.checked;
        this._controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    };
    /** Informs the component when the input has focus so that we can style accordingly */
    MdCheckbox.prototype._onInputFocus = function () {
        this.hasFocus = true;
    };
    /** Informs the component when we lose focus in order to style accordingly */
    MdCheckbox.prototype._onInputBlur = function () {
        this.hasFocus = false;
        this.onTouched();
    };
    /**
     * Toggles the `checked` value between true and false
     */
    MdCheckbox.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Event handler for checkbox input element.
     * Toggles checked state if element is not disabled.
     * @param event
     */
    MdCheckbox.prototype._onInteractionEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        if (!this.disabled) {
            this.toggle();
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    MdCheckbox.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `checkbox` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    MdCheckbox.prototype._getAnimationClassForCheckStateTransition = function (oldState, newState) {
        var animSuffix;
        switch (oldState) {
            case TransitionCheckState.Init:
                // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
                // [checked] bound to it.
                if (newState === TransitionCheckState.Checked) {
                    animSuffix = 'unchecked-checked';
                }
                else {
                    return '';
                }
                break;
            case TransitionCheckState.Unchecked:
                animSuffix = newState === TransitionCheckState.Checked ?
                    'unchecked-checked' : 'unchecked-indeterminate';
                break;
            case TransitionCheckState.Checked:
                animSuffix = newState === TransitionCheckState.Unchecked ?
                    'checked-unchecked' : 'checked-indeterminate';
                break;
            case TransitionCheckState.Indeterminate:
                animSuffix = newState === TransitionCheckState.Checked ?
                    'indeterminate-checked' : 'indeterminate-unchecked';
        }
        return "md-checkbox-anim-" + animSuffix;
    };
    __decorate([
        core_1.Input('aria-label'), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "ariaLabel", void 0);
    __decorate([
        core_1.Input('aria-labelledby'), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "ariaLabelledby", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdCheckbox.prototype, "align", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdCheckbox.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MdCheckbox.prototype, "tabindex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "name", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], MdCheckbox.prototype, "change", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdCheckbox.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdCheckbox.prototype, "indeterminate", null);
    MdCheckbox = __decorate([
        core_1.Component({            selector: 'md-checkbox',
            template: "<label class=\"md-checkbox-layout\"> <div class=\"md-checkbox-inner-container\"> <input class=\"md-checkbox-input\" type=\"checkbox\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" [tabIndex]=\"tabindex\" [indeterminate]=\"indeterminate\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (focus)=\"_onInputFocus()\" (blur)=\"_onInputBlur()\" (change)=\"_onInteractionEvent($event)\" (click)=\"_onInputClick($event)\"> <div class=\"md-ink-ripple\"></div> <div class=\"md-checkbox-frame\"></div> <div class=\"md-checkbox-background\"> <svg version=\"1.1\" class=\"md-checkbox-checkmark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" xml:space=\"preserve\"> <path class=\"md-checkbox-checkmark-path\" fill=\"none\" stroke=\"white\" d=\"M4.1,12.7 9,17.6 20.3,6.3\"/> </svg> <!-- Element for rendering the indeterminate state checkbox. --> <div class=\"md-checkbox-mixedmark\"></div> </div> </div> <span class=\"md-checkbox-label\"> <ng-content></ng-content> </span> </label> ",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ /** The width/height of the checkbox element. */ /** The width of the line used to draw the checkmark / mixedmark. */ /** The width of the checkbox border shown when the checkbox is unchecked. */ /** The color of the checkbox border. */ /** The color of the checkbox's checkmark / mixedmark. */ /** The color that is used as the checkbox background when it is checked. */ /** The base duration used for the majority of transitions for the checkbox. */ /** The amount of spacing between the checkbox and its label. */ /** * Fades in the background of the checkbox when it goes from unchecked -> {checked,indeterminate}. */ @-webkit-keyframes md-checkbox-fade-in-background { 0% { opacity: 0; } 50% { opacity: 1; } } @keyframes md-checkbox-fade-in-background { 0% { opacity: 0; } 50% { opacity: 1; } } /** * Fades out the background of the checkbox when it goes from {checked,indeterminate} -> unchecked. */ @-webkit-keyframes md-checkbox-fade-out-background { 0%, 50% { opacity: 1; } 100% { opacity: 0; } } @keyframes md-checkbox-fade-out-background { 0%, 50% { opacity: 1; } 100% { opacity: 0; } } /** * \"Draws\" in the checkmark when the checkbox goes from unchecked -> checked. */ @-webkit-keyframes md-checkbox-unchecked-checked-checkmark-path { 0%, 50% { stroke-dashoffset: 22.91026; } 50% { -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); } 100% { stroke-dashoffset: 0; } } @keyframes md-checkbox-unchecked-checked-checkmark-path { 0%, 50% { stroke-dashoffset: 22.91026; } 50% { -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); } 100% { stroke-dashoffset: 0; } } /** * Horizontally expands the mixedmark when the checkbox goes from unchecked -> indeterminate. */ @-webkit-keyframes md-checkbox-unchecked-indeterminate-mixedmark { 0%, 68.2% { -webkit-transform: scaleX(0); transform: scaleX(0); } 68.2% { -webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1); animation-timing-function: cubic-bezier(0, 0, 0, 1); } 100% { -webkit-transform: scaleX(1); transform: scaleX(1); } } @keyframes md-checkbox-unchecked-indeterminate-mixedmark { 0%, 68.2% { -webkit-transform: scaleX(0); transform: scaleX(0); } 68.2% { -webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1); animation-timing-function: cubic-bezier(0, 0, 0, 1); } 100% { -webkit-transform: scaleX(1); transform: scaleX(1); } } /** * \"Erases\" the checkmark when the checkbox goes from checked -> unchecked. */ @-webkit-keyframes md-checkbox-checked-unchecked-checkmark-path { from { -webkit-animation-timing-function: cubic-bezier(0.4, 0, 1, 1); animation-timing-function: cubic-bezier(0.4, 0, 1, 1); stroke-dashoffset: 0; } to { stroke-dashoffset: -22.91026; } } @keyframes md-checkbox-checked-unchecked-checkmark-path { from { -webkit-animation-timing-function: cubic-bezier(0.4, 0, 1, 1); animation-timing-function: cubic-bezier(0.4, 0, 1, 1); stroke-dashoffset: 0; } to { stroke-dashoffset: -22.91026; } } /** * Rotates and fades out the checkmark when the checkbox goes from checked -> indeterminate. This * animation helps provide the illusion of the checkmark \"morphing\" into the mixedmark. */ @-webkit-keyframes md-checkbox-checked-indeterminate-checkmark { from { -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); opacity: 1; -webkit-transform: rotate(0deg); transform: rotate(0deg); } to { opacity: 0; -webkit-transform: rotate(45deg); transform: rotate(45deg); } } @keyframes md-checkbox-checked-indeterminate-checkmark { from { -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); opacity: 1; -webkit-transform: rotate(0deg); transform: rotate(0deg); } to { opacity: 0; -webkit-transform: rotate(45deg); transform: rotate(45deg); } } /** * Rotates and fades the checkmark back into position when the checkbox goes from indeterminate -> * checked. This animation helps provide the illusion that the mixedmark is \"morphing\" into the * checkmark. */ @-webkit-keyframes md-checkbox-indeterminate-checked-checkmark { from { -webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1); animation-timing-function: cubic-bezier(0.14, 0, 0, 1); opacity: 0; -webkit-transform: rotate(45deg); transform: rotate(45deg); } to { opacity: 1; -webkit-transform: rotate(360deg); transform: rotate(360deg); } } @keyframes md-checkbox-indeterminate-checked-checkmark { from { -webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1); animation-timing-function: cubic-bezier(0.14, 0, 0, 1); opacity: 0; -webkit-transform: rotate(45deg); transform: rotate(45deg); } to { opacity: 1; -webkit-transform: rotate(360deg); transform: rotate(360deg); } } /** * Rotates and fades in the mixedmark when the checkbox goes from checked -> indeterminate. This * animation, similar to md-checkbox-checked-indeterminate-checkmark, helps provide an illusion * of \"morphing\" from checkmark -> mixedmark. */ @-webkit-keyframes md-checkbox-checked-indeterminate-mixedmark { from { -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); opacity: 0; -webkit-transform: rotate(-45deg); transform: rotate(-45deg); } to { opacity: 1; -webkit-transform: rotate(0deg); transform: rotate(0deg); } } @keyframes md-checkbox-checked-indeterminate-mixedmark { from { -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); animation-timing-function: cubic-bezier(0, 0, 0.2, 0.1); opacity: 0; -webkit-transform: rotate(-45deg); transform: rotate(-45deg); } to { opacity: 1; -webkit-transform: rotate(0deg); transform: rotate(0deg); } } /** * Rotates and fades out the mixedmark when the checkbox goes from indeterminate -> checked. This * animation, similar to md-checkbox-indeterminate-checked-checkmark, helps provide an illusion * of \"morphing\" from mixedmark -> checkmark. */ @-webkit-keyframes md-checkbox-indeterminate-checked-mixedmark { from { -webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1); animation-timing-function: cubic-bezier(0.14, 0, 0, 1); opacity: 1; -webkit-transform: rotate(0deg); transform: rotate(0deg); } to { opacity: 0; -webkit-transform: rotate(315deg); transform: rotate(315deg); } } @keyframes md-checkbox-indeterminate-checked-mixedmark { from { -webkit-animation-timing-function: cubic-bezier(0.14, 0, 0, 1); animation-timing-function: cubic-bezier(0.14, 0, 0, 1); opacity: 1; -webkit-transform: rotate(0deg); transform: rotate(0deg); } to { opacity: 0; -webkit-transform: rotate(315deg); transform: rotate(315deg); } } /** * Horizontally collapses and fades out the mixedmark when the checkbox goes from indeterminate -> * unchecked. */ @-webkit-keyframes md-checkbox-indeterminate-unchecked-mixedmark { 0% { -webkit-animation-timing-function: linear; animation-timing-function: linear; opacity: 1; -webkit-transform: scaleX(1); transform: scaleX(1); } 32.8%, 100% { opacity: 0; -webkit-transform: scaleX(0); transform: scaleX(0); } } @keyframes md-checkbox-indeterminate-unchecked-mixedmark { 0% { -webkit-animation-timing-function: linear; animation-timing-function: linear; opacity: 1; -webkit-transform: scaleX(1); transform: scaleX(1); } 32.8%, 100% { opacity: 0; -webkit-transform: scaleX(0); transform: scaleX(0); } } /** * Applied to elements that cover the checkbox's entire inner container. */ .md-checkbox-frame, .md-checkbox-background, .md-checkbox-checkmark { bottom: 0; left: 0; position: absolute; right: 0; top: 0; } /** * Applied to elements that are considered \"marks\" within the checkbox, e.g. the checkmark and * the mixedmark. */ .md-checkbox-checkmark, .md-checkbox-mixedmark { width: calc(100% - 4px); } /** * Applied to elements that appear to make up the outer box of the checkmark, such as the frame * that contains the border and the actual background element that contains the marks. */ .md-checkbox-frame, .md-checkbox-background { border-radius: 2px; box-sizing: border-box; pointer-events: none; } md-checkbox { cursor: pointer; } .md-checkbox-layout { cursor: inherit; -webkit-box-align: baseline; -ms-flex-align: baseline; align-items: baseline; display: -webkit-inline-box; display: -ms-inline-flexbox; display: inline-flex; } .md-checkbox-inner-container { display: inline-block; height: 20px; line-height: 0; margin: auto; margin-right: 8px; -webkit-box-ordinal-group: 1; -ms-flex-order: 0; order: 0; position: relative; vertical-align: middle; white-space: nowrap; width: 20px; } [dir='rtl'] .md-checkbox-inner-container { margin-left: 8px; margin-right: auto; } .md-checkbox-layout .md-checkbox-label { line-height: 24px; } .md-checkbox-frame { background-color: transparent; border: 2px solid rgba(0, 0, 0, 0.54); -webkit-transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1); transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1); will-change: border-color; } .md-checkbox-background { -webkit-box-align: center; -ms-flex-align: center; align-items: center; display: -webkit-inline-box; display: -ms-inline-flexbox; display: inline-flex; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; -webkit-transition: background-color 90ms cubic-bezier(0, 0, 0.2, 0.1), opacity 90ms cubic-bezier(0, 0, 0.2, 0.1); transition: background-color 90ms cubic-bezier(0, 0, 0.2, 0.1), opacity 90ms cubic-bezier(0, 0, 0.2, 0.1); will-change: background-color, opacity; } .md-checkbox-checkmark { fill: #fafafa; width: 100%; } .md-checkbox-checkmark-path { stroke: #fafafa !important; stroke-dashoffset: 22.91026; stroke-dasharray: 22.91026; stroke-width: 2.66667px; } .md-checkbox-mixedmark { background-color: #fafafa; height: 2px; opacity: 0; -webkit-transform: scaleX(0) rotate(0deg); transform: scaleX(0) rotate(0deg); } .md-checkbox-align-end .md-checkbox-inner-container { -webkit-box-ordinal-group: 2; -ms-flex-order: 1; order: 1; margin-left: 8px; margin-right: auto; } [dir='rtl'] .md-checkbox-align-end .md-checkbox-inner-container { margin-left: auto; margin-right: 8px; } .md-checkbox-checked .md-checkbox-checkmark { opacity: 1; } .md-checkbox-checked .md-checkbox-checkmark-path { stroke-dashoffset: 0; } .md-checkbox-checked .md-checkbox-mixedmark { -webkit-transform: scaleX(1) rotate(-45deg); transform: scaleX(1) rotate(-45deg); } .md-checkbox-checked .md-checkbox-background { background-color: #9c27b0; } .md-checkbox-indeterminate .md-checkbox-background { background-color: #9c27b0; } .md-checkbox-indeterminate .md-checkbox-checkmark { opacity: 0; -webkit-transform: rotate(45deg); transform: rotate(45deg); } .md-checkbox-indeterminate .md-checkbox-checkmark-path { stroke-dashoffset: 0; } .md-checkbox-indeterminate .md-checkbox-mixedmark { opacity: 1; -webkit-transform: scaleX(1) rotate(0deg); transform: scaleX(1) rotate(0deg); } .md-checkbox-unchecked .md-checkbox-background { background-color: transparent; } .md-checkbox-disabled { cursor: default; } .md-checkbox-disabled.md-checkbox-checked .md-checkbox-background, .md-checkbox-disabled.md-checkbox-indeterminate .md-checkbox-background { background-color: #b0b0b0; } .md-checkbox-disabled:not(.md-checkbox-checked) .md-checkbox-frame { border-color: #b0b0b0; } .md-checkbox-anim-unchecked-checked .md-checkbox-background { -webkit-animation: 180ms linear 0ms md-checkbox-fade-in-background; animation: 180ms linear 0ms md-checkbox-fade-in-background; } .md-checkbox-anim-unchecked-checked .md-checkbox-checkmark-path { -webkit-animation: 180ms linear 0ms md-checkbox-unchecked-checked-checkmark-path; animation: 180ms linear 0ms md-checkbox-unchecked-checked-checkmark-path; } .md-checkbox-anim-unchecked-indeterminate .md-checkbox-background { -webkit-animation: 180ms linear 0ms md-checkbox-fade-in-background; animation: 180ms linear 0ms md-checkbox-fade-in-background; } .md-checkbox-anim-unchecked-indeterminate .md-checkbox-mixedmark { -webkit-animation: 90ms linear 0ms md-checkbox-unchecked-indeterminate-mixedmark; animation: 90ms linear 0ms md-checkbox-unchecked-indeterminate-mixedmark; } .md-checkbox-anim-checked-unchecked .md-checkbox-background { -webkit-animation: 180ms linear 0ms md-checkbox-fade-out-background; animation: 180ms linear 0ms md-checkbox-fade-out-background; } .md-checkbox-anim-checked-unchecked .md-checkbox-checkmark-path { -webkit-animation: 90ms linear 0ms md-checkbox-checked-unchecked-checkmark-path; animation: 90ms linear 0ms md-checkbox-checked-unchecked-checkmark-path; } .md-checkbox-anim-checked-indeterminate .md-checkbox-checkmark { -webkit-animation: 90ms linear 0ms md-checkbox-checked-indeterminate-checkmark; animation: 90ms linear 0ms md-checkbox-checked-indeterminate-checkmark; } .md-checkbox-anim-checked-indeterminate .md-checkbox-mixedmark { -webkit-animation: 90ms linear 0ms md-checkbox-checked-indeterminate-mixedmark; animation: 90ms linear 0ms md-checkbox-checked-indeterminate-mixedmark; } .md-checkbox-anim-indeterminate-checked .md-checkbox-checkmark { -webkit-animation: 500ms linear 0ms md-checkbox-indeterminate-checked-checkmark; animation: 500ms linear 0ms md-checkbox-indeterminate-checked-checkmark; } .md-checkbox-anim-indeterminate-checked .md-checkbox-mixedmark { -webkit-animation: 500ms linear 0ms md-checkbox-indeterminate-checked-mixedmark; animation: 500ms linear 0ms md-checkbox-indeterminate-checked-mixedmark; } .md-checkbox-anim-indeterminate-unchecked .md-checkbox-background { -webkit-animation: 180ms linear 0ms md-checkbox-fade-out-background; animation: 180ms linear 0ms md-checkbox-fade-out-background; } .md-checkbox-anim-indeterminate-unchecked .md-checkbox-mixedmark { -webkit-animation: 300ms linear 0ms md-checkbox-indeterminate-unchecked-mixedmark; animation: 300ms linear 0ms md-checkbox-indeterminate-unchecked-mixedmark; } .md-checkbox-input { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; text-transform: none; width: 1px; } .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } .md-checkbox-focused .md-ink-ripple { opacity: 1; background-color: rgba(156, 39, 176, 0.26); } .md-checkbox-disabled .md-ink-ripple { background-color: #000; } "],
            host: {
                '[class.md-checkbox-indeterminate]': 'indeterminate',
                '[class.md-checkbox-checked]': 'checked',
                '[class.md-checkbox-disabled]': 'disabled',
                '[class.md-checkbox-align-end]': 'align == "end"',
                '[class.md-checkbox-focused]': 'hasFocus',
            },
            providers: [exports.MD_CHECKBOX_CONTROL_VALUE_ACCESSOR],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], MdCheckbox);
    return MdCheckbox;
}());
exports.MdCheckbox = MdCheckbox;
/** @deprecated */
exports.MD_CHECKBOX_DIRECTIVES = [MdCheckbox];
var MdCheckboxModule = (function () {
    function MdCheckboxModule() {
    }
    MdCheckboxModule = __decorate([
        core_1.NgModule({
            exports: exports.MD_CHECKBOX_DIRECTIVES,
            declarations: exports.MD_CHECKBOX_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCheckboxModule);
    return MdCheckboxModule;
}());
exports.MdCheckboxModule = MdCheckboxModule;
//# sourceMappingURL=checkbox.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
exports.LIVE_ANNOUNCER_ELEMENT_TOKEN = new core_1.OpaqueToken('mdLiveAnnouncerElement');
var MdLiveAnnouncer = (function () {
    function MdLiveAnnouncer(elementToken) {
        // We inject the live element as `any` because the constructor signature cannot reference
        // browser globals (HTMLElement) on non-browser environments, since having a class decorator
        // causes TypeScript to preserve the constructor signature types.
        this._liveElement = elementToken || this._createLiveElement();
    }
    /**
     * @param message Message to be announced to the screenreader
     * @param politeness The politeness of the announcer element.
     */
    MdLiveAnnouncer.prototype.announce = function (message, politeness) {
        var _this = this;
        if (politeness === void 0) { politeness = 'polite'; }
        this._liveElement.textContent = '';
        // TODO: ensure changing the politeness works on all environments we support.
        this._liveElement.setAttribute('aria-live', politeness);
        // This 100ms timeout is necessary for some browser + screen-reader combinations:
        // - Both JAWS and NVDA over IE11 will not announce anything without a non-zero timeout.
        // - With Chrome and IE11 with NVDA or JAWS, a repeated (identical) message won't be read a
        //   second time without clearing and then using a non-zero delay.
        // (using JAWS 17 at time of this writing).
        setTimeout(function () { return _this._liveElement.textContent = message; }, 100);
    };
    MdLiveAnnouncer.prototype._createLiveElement = function () {
        var liveEl = document.createElement('div');
        liveEl.classList.add('md-live-announcer');
        liveEl.setAttribute('aria-atomic', 'true');
        liveEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveEl);
        return liveEl;
    };
    MdLiveAnnouncer = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()),
        __param(0, core_1.Inject(exports.LIVE_ANNOUNCER_ELEMENT_TOKEN)), 
        __metadata('design:paramtypes', [Object])
    ], MdLiveAnnouncer);
    return MdLiveAnnouncer;
}());
exports.MdLiveAnnouncer = MdLiveAnnouncer;
//# sourceMappingURL=live-announcer.js.map
"use strict";
/**
 * Annotation Factory that allows HTML style boolean attributes. For example,
 * a field declared like this:

 * @Directive({ selector: 'component' }) class MyComponent {
 *   @Input() @BooleanFieldValueFactory() myField: boolean;
 * }
 *
 * You could set it up this way:
 *   <component myField>
 * or:
 *   <component myField="">
 * @deprecated
 */
function booleanFieldValueFactory() {
    return function booleanFieldValueMetadata(target, key) {
        var defaultValue = target[key];
        var localKey = "__md_private_symbol_" + key;
        target[localKey] = defaultValue;
        Object.defineProperty(target, key, {
            get: function () { return this[localKey]; },
            set: function (value) {
                this[localKey] = value != null && "" + value !== 'false';
            }
        });
    };
}
exports.BooleanFieldValue = booleanFieldValueFactory;
//# sourceMappingURL=field-value.js.map
"use strict";
var PromiseCompleter = (function () {
    function PromiseCompleter() {
        var _this = this;
        this.promise = new Promise(function (res, rej) {
            _this.resolve = res;
            _this.reject = rej;
        });
    }
    return PromiseCompleter;
}());
exports.PromiseCompleter = PromiseCompleter;
//# sourceMappingURL=promise-completer.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/**
 * Class to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 *
 * This service does not *store* any IDs and names because they may change at any time, so it is
 * less error-prone if they are simply passed through when the events occur.
 */
var MdUniqueSelectionDispatcher = (function () {
    function MdUniqueSelectionDispatcher() {
        this._listeners = [];
    }
    /** Notify other items that selection for the given name has been set. */
    MdUniqueSelectionDispatcher.prototype.notify = function (id, name) {
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(id, name);
        }
    };
    /** Listen for future changes to item selection. */
    MdUniqueSelectionDispatcher.prototype.listen = function (listener) {
        this._listeners.push(listener);
    };
    MdUniqueSelectionDispatcher = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MdUniqueSelectionDispatcher);
    return MdUniqueSelectionDispatcher;
}());
exports.MdUniqueSelectionDispatcher = MdUniqueSelectionDispatcher;
//# sourceMappingURL=unique-selection-dispatcher.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var line_1 = require('./line/line');
var dir_1 = require('./rtl/dir');
var ripple_1 = require('./ripple/ripple');
var portal_directives_1 = require('./portal/portal-directives');
var overlay_directives_1 = require('./overlay/overlay-directives');
var live_announcer_1 = require('./a11y/live-announcer');
// RTL
var dir_2 = require('./rtl/dir');
exports.Dir = dir_2.Dir;
exports.RtlModule = dir_2.RtlModule;
// Portals
var portal_1 = require('./portal/portal');
exports.Portal = portal_1.Portal;
exports.BasePortalHost = portal_1.BasePortalHost;
exports.ComponentPortal = portal_1.ComponentPortal;
exports.TemplatePortal = portal_1.TemplatePortal;
var portal_directives_2 = require('./portal/portal-directives');
exports.PortalHostDirective = portal_directives_2.PortalHostDirective;
exports.TemplatePortalDirective = portal_directives_2.TemplatePortalDirective;
exports.PORTAL_DIRECTIVES = portal_directives_2.PORTAL_DIRECTIVES;
exports.PortalModule = portal_directives_2.PortalModule;
var dom_portal_host_1 = require('./portal/dom-portal-host');
exports.DomPortalHost = dom_portal_host_1.DomPortalHost;
// Overlay
var overlay_1 = require('./overlay/overlay');
exports.Overlay = overlay_1.Overlay;
exports.OVERLAY_PROVIDERS = overlay_1.OVERLAY_PROVIDERS;
var overlay_container_1 = require('./overlay/overlay-container');
exports.OverlayContainer = overlay_container_1.OverlayContainer;
var overlay_ref_1 = require('./overlay/overlay-ref');
exports.OverlayRef = overlay_ref_1.OverlayRef;
var overlay_state_1 = require('./overlay/overlay-state');
exports.OverlayState = overlay_state_1.OverlayState;
var overlay_directives_2 = require('./overlay/overlay-directives');
exports.ConnectedOverlayDirective = overlay_directives_2.ConnectedOverlayDirective;
exports.OverlayOrigin = overlay_directives_2.OverlayOrigin;
exports.OVERLAY_DIRECTIVES = overlay_directives_2.OVERLAY_DIRECTIVES;
exports.OverlayModule = overlay_directives_2.OverlayModule;
// Gestures
var MdGestureConfig_1 = require('./gestures/MdGestureConfig');
exports.MdGestureConfig = MdGestureConfig_1.MdGestureConfig;
// Ripple
var ripple_2 = require('./ripple/ripple');
exports.MD_RIPPLE_DIRECTIVES = ripple_2.MD_RIPPLE_DIRECTIVES;
exports.MdRipple = ripple_2.MdRipple;
exports.MdRippleModule = ripple_2.MdRippleModule;
// a11y
var live_announcer_2 = require('./a11y/live-announcer');
exports.MdLiveAnnouncer = live_announcer_2.MdLiveAnnouncer;
exports.LIVE_ANNOUNCER_ELEMENT_TOKEN = live_announcer_2.LIVE_ANNOUNCER_ELEMENT_TOKEN;
var unique_selection_dispatcher_1 = require('./coordination/unique-selection-dispatcher');
exports.MdUniqueSelectionDispatcher = unique_selection_dispatcher_1.MdUniqueSelectionDispatcher;
var line_2 = require('./line/line');
exports.MdLineModule = line_2.MdLineModule;
exports.MdLine = line_2.MdLine;
exports.MdLineSetter = line_2.MdLineSetter;
var coreModules = [
    line_1.MdLineModule,
    dir_1.RtlModule,
    ripple_1.MdRippleModule,
    portal_directives_1.PortalModule,
    overlay_directives_1.OverlayModule,
];
var MdCoreModule = (function () {
    function MdCoreModule() {
    }
    MdCoreModule = __decorate([
        core_1.NgModule({
            imports: coreModules,
            exports: coreModules,
            providers: [live_announcer_1.MdLiveAnnouncer],
        }), 
        __metadata('design:paramtypes', [])
    ], MdCoreModule);
    return MdCoreModule;
}());
exports.MdCoreModule = MdCoreModule;
//# sourceMappingURL=core.js.map
// TODO(kara): Revisit why error messages are not being properly set.
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Wrapper around Error that sets the error message.
 */
var MdError = (function (_super) {
    __extends(MdError, _super);
    function MdError(value) {
        _super.call(this);
        this.message = value;
    }
    return MdError;
}(Error));
exports.MdError = MdError;
//# sourceMappingURL=error.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
/* Adjusts configuration of our gesture library, Hammer. */
var MdGestureConfig = (function (_super) {
    __extends(MdGestureConfig, _super);
    function MdGestureConfig() {
        _super.apply(this, arguments);
        /* List of new event names to add to the gesture support list */
        this.events = [
            'drag',
            'dragstart',
            'dragend',
            'dragright',
            'dragleft',
            'longpress',
            'slide',
            'slidestart',
            'slideend',
            'slideright',
            'slideleft'
        ];
    }
    /*
     * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
     *
     * Our gesture names come from the Material Design gestures spec:
     * https://www.google.com/design/spec/patterns/gestures.html#gestures-touch-mechanics
     *
     * More information on default recognizers can be found in Hammer docs:
     * http://hammerjs.github.io/recognizer-pan/
     * http://hammerjs.github.io/recognizer-press/
     *
     * TODO: Confirm threshold numbers with Material Design UX Team
     * */
    MdGestureConfig.prototype.buildHammer = function (element) {
        var mc = new Hammer(element);
        // Default Hammer Recognizers.
        var pan = new Hammer.Pan();
        var swipe = new Hammer.Swipe();
        var press = new Hammer.Press();
        // Notice that a HammerJS recognizer can only depend on one other recognizer once.
        // Otherwise the previous `recognizeWith` will be dropped.
        var slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
        var drag = this._createRecognizer(slide, { event: 'drag', threshold: 6 }, swipe);
        var longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
        // Overwrite the default `pan` event to use the swipe event.
        pan.recognizeWith(swipe);
        // Add customized gestures to Hammer manager
        mc.add([swipe, press, pan, drag, slide, longpress]);
        return mc;
    };
    /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
    MdGestureConfig.prototype._createRecognizer = function (base, options) {
        var inheritances = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            inheritances[_i - 2] = arguments[_i];
        }
        var recognizer = new base.constructor(options);
        inheritances.push(base);
        inheritances.forEach(function (item) { return recognizer.recognizeWith(item); });
        return recognizer;
    };
    MdGestureConfig = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MdGestureConfig);
    return MdGestureConfig;
}(platform_browser_1.HammerGestureConfig));
exports.MdGestureConfig = MdGestureConfig;
//# sourceMappingURL=MdGestureConfig.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MdLine) query, then
 * counted by checking the query list's length.
 */
var MdLine = (function () {
    function MdLine() {
    }
    MdLine = __decorate([
        core_1.Directive({ selector: '[md-line]' }), 
        __metadata('design:paramtypes', [])
    ], MdLine);
    return MdLine;
}());
exports.MdLine = MdLine;
/* Helper that takes a query list of lines and sets the correct class on the host */
var MdLineSetter = (function () {
    function MdLineSetter(_lines, _renderer, _element) {
        var _this = this;
        this._lines = _lines;
        this._renderer = _renderer;
        this._element = _element;
        this._setLineClass(this._lines.length);
        this._lines.changes.subscribe(function () {
            _this._setLineClass(_this._lines.length);
        });
    }
    MdLineSetter.prototype._setLineClass = function (count) {
        this._resetClasses();
        if (count === 2 || count === 3) {
            this._setClass("md-" + count + "-line", true);
        }
    };
    MdLineSetter.prototype._resetClasses = function () {
        this._setClass('md-2-line', false);
        this._setClass('md-3-line', false);
    };
    MdLineSetter.prototype._setClass = function (className, bool) {
        this._renderer.setElementClass(this._element.nativeElement, className, bool);
    };
    return MdLineSetter;
}());
exports.MdLineSetter = MdLineSetter;
var MdLineModule = (function () {
    function MdLineModule() {
    }
    MdLineModule = __decorate([
        core_1.NgModule({
            exports: [MdLine],
            declarations: [MdLine],
        }), 
        __metadata('design:paramtypes', [])
    ], MdLineModule);
    return MdLineModule;
}());
exports.MdLineModule = MdLineModule;
//# sourceMappingURL=line.js.map
"use strict";
//# sourceMappingURL=generic-component-type.js.map
"use strict";
/**
 * The OverlayContainer is the container in which all overlays will load.
 * It should be provided in the root component to ensure it is properly shared.
 */
var OverlayContainer = (function () {
    function OverlayContainer() {
    }
    /**
     * This method returns the overlay container element.  It will lazily
     * create the element the first time  it is called to facilitate using
     * the container in non-browser environments.
     * @returns {HTMLElement} the container element
     */
    OverlayContainer.prototype.getContainerElement = function () {
        if (!this._containerElement) {
            this._createContainer();
        }
        return this._containerElement;
    };
    /**
     * Create the overlay container element, which is simply a div
     * with the 'md-overlay-container' class on the document body.
     */
    OverlayContainer.prototype._createContainer = function () {
        var container = document.createElement('div');
        container.classList.add('md-overlay-container');
        document.body.appendChild(container);
        this._containerElement = container;
    };
    return OverlayContainer;
}());
exports.OverlayContainer = OverlayContainer;
//# sourceMappingURL=overlay-container.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var overlay_1 = require('./overlay');
var portal_1 = require('../portal/portal');
var overlay_state_1 = require('./overlay-state');
var connected_position_1 = require('./position/connected-position');
var portal_directives_1 = require('../portal/portal-directives');
/** Default set of positions for the overlay. Follows the behavior of a dropdown. */
var defaultPositionList = [
    new connected_position_1.ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
    new connected_position_1.ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
];
/**
 * Directive applied to an element to make it usable as an origin for an Overlay using a
 * ConnectedPositionStrategy.
 */
var OverlayOrigin = (function () {
    function OverlayOrigin(_elementRef) {
        this._elementRef = _elementRef;
    }
    Object.defineProperty(OverlayOrigin.prototype, "elementRef", {
        get: function () {
            return this._elementRef;
        },
        enumerable: true,
        configurable: true
    });
    OverlayOrigin = __decorate([
        core_1.Directive({
            selector: '[overlay-origin]',
            exportAs: 'overlayOrigin',
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], OverlayOrigin);
    return OverlayOrigin;
}());
exports.OverlayOrigin = OverlayOrigin;
/**
 * Directive to facilitate declarative creation of an Overlay using a ConnectedPositionStrategy.
 */
var ConnectedOverlayDirective = (function () {
    // TODO(jelbourn): inputs for size, scroll behavior, animation, etc.
    function ConnectedOverlayDirective(_overlay, templateRef, viewContainerRef) {
        this._overlay = _overlay;
        this._templatePortal = new portal_1.TemplatePortal(templateRef, viewContainerRef);
    }
    Object.defineProperty(ConnectedOverlayDirective.prototype, "overlayRef", {
        get: function () {
            return this._overlayRef;
        },
        enumerable: true,
        configurable: true
    });
    /** TODO: internal */
    ConnectedOverlayDirective.prototype.ngOnInit = function () {
        this._createOverlay();
    };
    /** TODO: internal */
    ConnectedOverlayDirective.prototype.ngOnDestroy = function () {
        this._destroyOverlay();
    };
    /** Creates an overlay and attaches this directive's template to it. */
    ConnectedOverlayDirective.prototype._createOverlay = function () {
        var _this = this;
        if (!this.positions || !this.positions.length) {
            this.positions = defaultPositionList;
        }
        var overlayConfig = new overlay_state_1.OverlayState();
        overlayConfig.positionStrategy =
            this._overlay.position().connectedTo(this.origin.elementRef, { originX: this.positions[0].overlayX, originY: this.positions[0].originY }, { overlayX: this.positions[0].overlayX, overlayY: this.positions[0].overlayY });
        this._overlay.create(overlayConfig).then(function (ref) {
            _this._overlayRef = ref;
            _this._overlayRef.attach(_this._templatePortal);
        });
    };
    /** Destroys the overlay created by this directive. */
    ConnectedOverlayDirective.prototype._destroyOverlay = function () {
        this._overlayRef.dispose();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', OverlayOrigin)
    ], ConnectedOverlayDirective.prototype, "origin", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], ConnectedOverlayDirective.prototype, "positions", void 0);
    ConnectedOverlayDirective = __decorate([
        core_1.Directive({
            selector: '[connected-overlay]'
        }), 
        __metadata('design:paramtypes', [overlay_1.Overlay, core_1.TemplateRef, core_1.ViewContainerRef])
    ], ConnectedOverlayDirective);
    return ConnectedOverlayDirective;
}());
exports.ConnectedOverlayDirective = ConnectedOverlayDirective;
exports.OVERLAY_DIRECTIVES = [ConnectedOverlayDirective, OverlayOrigin];
var OverlayModule = (function () {
    function OverlayModule() {
    }
    OverlayModule = __decorate([
        core_1.NgModule({
            imports: [portal_directives_1.PortalModule],
            exports: exports.OVERLAY_DIRECTIVES,
            declarations: exports.OVERLAY_DIRECTIVES,
            providers: overlay_1.OVERLAY_PROVIDERS,
        }), 
        __metadata('design:paramtypes', [])
    ], OverlayModule);
    return OverlayModule;
}());
exports.OverlayModule = OverlayModule;
//# sourceMappingURL=overlay-directives.js.map
"use strict";
/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
var OverlayRef = (function () {
    function OverlayRef(_portalHost, _pane, _state) {
        this._portalHost = _portalHost;
        this._pane = _pane;
        this._state = _state;
    }
    OverlayRef.prototype.attach = function (portal) {
        var _this = this;
        var attachPromise = this._portalHost.attach(portal);
        // Don't chain the .then() call in the return because we want the result of portalHost.attach
        // to be returned from this method.
        attachPromise.then(function () {
            _this.updatePosition();
        });
        return attachPromise;
    };
    OverlayRef.prototype.detach = function () {
        return this._portalHost.detach();
    };
    OverlayRef.prototype.dispose = function () {
        this._portalHost.dispose();
    };
    OverlayRef.prototype.hasAttached = function () {
        return this._portalHost.hasAttached();
    };
    /** Gets the current state config of the overlay. */
    OverlayRef.prototype.getState = function () {
        return this._state;
    };
    /** Updates the position of the overlay based on the position strategy. */
    OverlayRef.prototype.updatePosition = function () {
        if (this._state.positionStrategy) {
            this._state.positionStrategy.apply(this._pane);
        }
    };
    return OverlayRef;
}());
exports.OverlayRef = OverlayRef;
//# sourceMappingURL=overlay-ref.js.map
"use strict";
/**
 * OverlayState is a bag of values for either the initial configuration or current state of an
 * overlay.
 */
var OverlayState = (function () {
    function OverlayState() {
    }
    return OverlayState;
}());
exports.OverlayState = OverlayState;
//# sourceMappingURL=overlay-state.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var overlay_state_1 = require('./overlay-state');
var dom_portal_host_1 = require('../portal/dom-portal-host');
var overlay_ref_1 = require('./overlay-ref');
var overlay_position_builder_1 = require('./position/overlay-position-builder');
var viewport_ruler_1 = require('./position/viewport-ruler');
var overlay_container_1 = require('./overlay-container');
/** Next overlay unique ID. */
var nextUniqueId = 0;
/** The default state for newly created overlays. */
var defaultState = new overlay_state_1.OverlayState();
/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
var Overlay = (function () {
    function Overlay(_overlayContainer, _componentResolver, _positionBuilder) {
        this._overlayContainer = _overlayContainer;
        this._componentResolver = _componentResolver;
        this._positionBuilder = _positionBuilder;
    }
    /**
     * Creates an overlay.
     * @param state State to apply to the overlay.
     * @returns A reference to the created overlay.
     */
    Overlay.prototype.create = function (state) {
        var _this = this;
        if (state === void 0) { state = defaultState; }
        return this._createPaneElement().then(function (pane) { return _this._createOverlayRef(pane, state); });
    };
    /**
     * Returns a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     */
    Overlay.prototype.position = function () {
        return this._positionBuilder;
    };
    /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @returns Promise resolving to the created element.
     */
    Overlay.prototype._createPaneElement = function () {
        var pane = document.createElement('div');
        pane.id = "md-overlay-" + nextUniqueId++;
        pane.classList.add('md-overlay-pane');
        this._overlayContainer.getContainerElement().appendChild(pane);
        return Promise.resolve(pane);
    };
    /**
     * Create a DomPortalHost into which the overlay content can be loaded.
     * @param pane The DOM element to turn into a portal host.
     * @returns A portal host for the given DOM element.
     */
    Overlay.prototype._createPortalHost = function (pane) {
        return new dom_portal_host_1.DomPortalHost(pane, this._componentResolver);
    };
    /**
     * Creates an OverlayRef for an overlay in the given DOM element.
     * @param pane DOM element for the overlay
     * @param state
     * @returns {OverlayRef}
     */
    Overlay.prototype._createOverlayRef = function (pane, state) {
        return new overlay_ref_1.OverlayRef(this._createPortalHost(pane), pane, state);
    };
    Overlay = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [overlay_container_1.OverlayContainer, core_1.ComponentResolver, overlay_position_builder_1.OverlayPositionBuilder])
    ], Overlay);
    return Overlay;
}());
exports.Overlay = Overlay;
/** Providers for Overlay and its related injectables. */
exports.OVERLAY_PROVIDERS = [
    viewport_ruler_1.ViewportRuler,
    overlay_position_builder_1.OverlayPositionBuilder,
    Overlay,
    overlay_container_1.OverlayContainer,
];
//# sourceMappingURL=overlay.js.map
"use strict";
var apply_transform_1 = require('@angular2-material/core/style/apply-transform');
var connected_position_1 = require('./connected-position');
/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * implict position relative some origin element. The relative position is defined in terms of
 * a point on the origin element that is connected to a point on the overlay element. For example,
 * a basic dropdown is connecting the bottom-left corner of the origin to the top-left corner
 * of the overlay.
 */
var ConnectedPositionStrategy = (function () {
    function ConnectedPositionStrategy(_connectedTo, _originPos, _overlayPos, _viewportRuler) {
        this._connectedTo = _connectedTo;
        this._originPos = _originPos;
        this._overlayPos = _overlayPos;
        this._viewportRuler = _viewportRuler;
        // TODO(jelbourn): set RTL to the actual value from the app.
        /** Whether the we're dealing with an RTL context */
        this._isRtl = false;
        /** Ordered list of preferred positions, from most to least desirable. */
        this._preferredPositions = [];
        this._origin = this._connectedTo.nativeElement;
        this.withFallbackPosition(_originPos, _overlayPos);
    }
    Object.defineProperty(ConnectedPositionStrategy.prototype, "positions", {
        get: function () {
            return this._preferredPositions;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the position of the overlay element, using whichever preferred position relative
     * to the origin fits on-screen.
     * TODO: internal
     */
    ConnectedPositionStrategy.prototype.apply = function (element) {
        // We need the bounding rects for the origin and the overlay to determine how to position
        // the overlay relative to the origin.
        var originRect = this._origin.getBoundingClientRect();
        var overlayRect = element.getBoundingClientRect();
        // We use the viewport rect to determine whether a position would go off-screen.
        var viewportRect = this._viewportRuler.getViewportRect();
        var firstOverlayPoint = null;
        // We want to place the overlay in the first of the preferred positions such that the
        // overlay fits on-screen.
        for (var _i = 0, _a = this._preferredPositions; _i < _a.length; _i++) {
            var pos = _a[_i];
            // Get the (x, y) point of connection on the origin, and then use that to get the
            // (top, left) coordinate for the overlay at `pos`.
            var originPoint = this._getOriginConnectionPoint(originRect, pos);
            var overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);
            firstOverlayPoint = firstOverlayPoint || overlayPoint;
            // If the overlay in the calculated position fits on-screen, put it there and we're done.
            if (this._willOverlayFitWithinViewport(overlayPoint, overlayRect, viewportRect)) {
                this._setElementPosition(element, overlayPoint);
                return Promise.resolve(null);
            }
        }
        // TODO(jelbourn): fallback behavior for when none of the preferred positions fit on-screen.
        // For now, just stick it in the first position and let it go off-screen.
        this._setElementPosition(element, firstOverlayPoint);
        return Promise.resolve(null);
    };
    ConnectedPositionStrategy.prototype.withFallbackPosition = function (originPos, overlayPos) {
        this._preferredPositions.push(new connected_position_1.ConnectionPositionPair(originPos, overlayPos));
        return this;
    };
    /**
     * Gets the horizontal (x) "start" dimension based on whether the overlay is in an RTL context.
     * @param rect
     */
    ConnectedPositionStrategy.prototype._getStartX = function (rect) {
        return this._isRtl ? rect.right : rect.left;
    };
    /**
     * Gets the horizontal (x) "end" dimension based on whether the overlay is in an RTL context.
     * @param rect
     */
    ConnectedPositionStrategy.prototype._getEndX = function (rect) {
        return this._isRtl ? rect.left : rect.right;
    };
    /**
     * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
     * @param originRect
     * @param pos
     */
    ConnectedPositionStrategy.prototype._getOriginConnectionPoint = function (originRect, pos) {
        var originStartX = this._getStartX(originRect);
        var originEndX = this._getEndX(originRect);
        var x;
        if (pos.originX == 'center') {
            x = originStartX + (originRect.width / 2);
        }
        else {
            x = pos.originX == 'start' ? originStartX : originEndX;
        }
        var y;
        if (pos.originY == 'center') {
            y = originRect.top + (originRect.height / 2);
        }
        else {
            y = pos.originY == 'top' ? originRect.top : originRect.bottom;
        }
        return { x: x, y: y };
    };
    /**
     * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
     * origin point to which the overlay should be connected.
     * @param originPoint
     * @param overlayRect
     * @param pos
     */
    ConnectedPositionStrategy.prototype._getOverlayPoint = function (originPoint, overlayRect, pos) {
        // Calculate the (overlayStartX, overlayStartY), the start of the potential overlay position
        // relative to the origin point.
        var overlayStartX;
        if (pos.overlayX == 'center') {
            overlayStartX = -overlayRect.width / 2;
        }
        else {
            overlayStartX = pos.overlayX == 'start' ? 0 : -overlayRect.width;
        }
        var overlayStartY;
        if (pos.overlayY == 'center') {
            overlayStartY = -overlayRect.height / 2;
        }
        else {
            overlayStartY = pos.overlayY == 'top' ? 0 : -overlayRect.height;
        }
        return {
            x: originPoint.x + overlayStartX,
            y: originPoint.y + overlayStartY
        };
    };
    /**
     * Gets whether the overlay positioned at the given point will fit on-screen.
     * @param overlayPoint The top-left coordinate of the overlay.
     * @param overlayRect Bounding rect of the overlay, used to get its size.
     * @param viewportRect The bounding viewport.
     */
    ConnectedPositionStrategy.prototype._willOverlayFitWithinViewport = function (overlayPoint, overlayRect, viewportRect) {
        // TODO(jelbourn): probably also want some space between overlay edge and viewport edge.
        return overlayPoint.x >= viewportRect.left &&
            overlayPoint.x + overlayRect.width <= viewportRect.right &&
            overlayPoint.y >= viewportRect.top &&
            overlayPoint.y + overlayRect.height <= viewportRect.bottom;
    };
    /**
     * Physically positions the overlay element to the given coordinate.
     * @param element
     * @param overlayPoint
     */
    ConnectedPositionStrategy.prototype._setElementPosition = function (element, overlayPoint) {
        var scrollPos = this._viewportRuler.getViewportScrollPosition();
        var x = overlayPoint.x + scrollPos.left;
        var y = overlayPoint.y + scrollPos.top;
        // TODO(jelbourn): we don't want to always overwrite the transform property here,
        // because it will need to be used for animations.
        apply_transform_1.applyCssTransform(element, "translateX(" + x + "px) translateY(" + y + "px)");
    };
    return ConnectedPositionStrategy;
}());
exports.ConnectedPositionStrategy = ConnectedPositionStrategy;
//# sourceMappingURL=connected-position-strategy.js.map
"use strict";
/** The points of the origin element and the overlay element to connect. */
var ConnectionPositionPair = (function () {
    function ConnectionPositionPair(origin, overlay) {
        this.originX = origin.originX;
        this.originY = origin.originY;
        this.overlayX = overlay.overlayX;
        this.overlayY = overlay.overlayY;
    }
    return ConnectionPositionPair;
}());
exports.ConnectionPositionPair = ConnectionPositionPair;
//# sourceMappingURL=connected-position.js.map
"use strict";
var apply_transform_1 = require('@angular2-material/core/style/apply-transform');
/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * explicit position relative to the browser's viewport.
 */
var GlobalPositionStrategy = (function () {
    function GlobalPositionStrategy() {
        this._cssPosition = 'absolute';
        this._top = '';
        this._bottom = '';
        this._left = '';
        this._right = '';
        /** Array of individual applications of translateX(). Currently only for centering. */
        this._translateX = [];
        /** Array of individual applications of translateY(). Currently only for centering. */
        this._translateY = [];
    }
    /** Sets the element to usee CSS position: fixed */
    GlobalPositionStrategy.prototype.fixed = function () {
        this._cssPosition = 'fixed';
        return this;
    };
    /** Sets the element to usee CSS position: absolute. This is the default. */
    GlobalPositionStrategy.prototype.absolute = function () {
        this._cssPosition = 'absolute';
        return this;
    };
    /** Sets the top position of the overlay. Clears any previously set vertical position. */
    GlobalPositionStrategy.prototype.top = function (value) {
        this._bottom = '';
        this._translateY = [];
        this._top = value;
        return this;
    };
    /** Sets the left position of the overlay. Clears any previously set horizontal position. */
    GlobalPositionStrategy.prototype.left = function (value) {
        this._right = '';
        this._translateX = [];
        this._left = value;
        return this;
    };
    /** Sets the bottom position of the overlay. Clears any previously set vertical position. */
    GlobalPositionStrategy.prototype.bottom = function (value) {
        this._top = '';
        this._translateY = [];
        this._bottom = value;
        return this;
    };
    /** Sets the right position of the overlay. Clears any previously set horizontal position. */
    GlobalPositionStrategy.prototype.right = function (value) {
        this._left = '';
        this._translateX = [];
        this._right = value;
        return this;
    };
    /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     */
    GlobalPositionStrategy.prototype.centerHorizontally = function (offset) {
        if (offset === void 0) { offset = '0px'; }
        this._left = '50%';
        this._right = '';
        this._translateX = ['-50%', offset];
        return this;
    };
    /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     */
    GlobalPositionStrategy.prototype.centerVertically = function (offset) {
        if (offset === void 0) { offset = '0px'; }
        this._top = '50%';
        this._bottom = '';
        this._translateY = ['-50%', offset];
        return this;
    };
    /**
     * Apply the position to the element.
     * TODO: internal
     */
    GlobalPositionStrategy.prototype.apply = function (element) {
        element.style.position = this._cssPosition;
        element.style.top = this._top;
        element.style.left = this._left;
        element.style.bottom = this._bottom;
        element.style.right = this._right;
        // TODO(jelbourn): we don't want to always overwrite the transform property here,
        // because it will need to be used for animations.
        var tranlateX = this._reduceTranslateValues('translateX', this._translateX);
        var translateY = this._reduceTranslateValues('translateY', this._translateY);
        apply_transform_1.applyCssTransform(element, tranlateX + " " + translateY);
        return Promise.resolve(null);
    };
    /** Reduce a list of translate values to a string that can be used in the transform property */
    GlobalPositionStrategy.prototype._reduceTranslateValues = function (translateFn, values) {
        return values.map(function (t) { return (translateFn + "(" + t + ")"); }).join(' ');
    };
    return GlobalPositionStrategy;
}());
exports.GlobalPositionStrategy = GlobalPositionStrategy;
//# sourceMappingURL=global-position-strategy.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var viewport_ruler_1 = require('./viewport-ruler');
var connected_position_strategy_1 = require('./connected-position-strategy');
var core_1 = require('@angular/core');
var global_position_strategy_1 = require('./global-position-strategy');
/** Builder for overlay position strategy. */
var OverlayPositionBuilder = (function () {
    function OverlayPositionBuilder(_viewportRuler) {
        this._viewportRuler = _viewportRuler;
    }
    /** Creates a global position strategy. */
    OverlayPositionBuilder.prototype.global = function () {
        return new global_position_strategy_1.GlobalPositionStrategy();
    };
    /** Creates a relative position strategy. */
    OverlayPositionBuilder.prototype.connectedTo = function (elementRef, originPos, overlayPos) {
        return new connected_position_strategy_1.ConnectedPositionStrategy(elementRef, originPos, overlayPos, this._viewportRuler);
    };
    OverlayPositionBuilder = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [viewport_ruler_1.ViewportRuler])
    ], OverlayPositionBuilder);
    return OverlayPositionBuilder;
}());
exports.OverlayPositionBuilder = OverlayPositionBuilder;
//# sourceMappingURL=overlay-position-builder.js.map
"use strict";
//# sourceMappingURL=position-strategy.js.map
"use strict";
var RelativePositionStrategy = (function () {
    function RelativePositionStrategy(_relativeTo) {
        this._relativeTo = _relativeTo;
    }
    RelativePositionStrategy.prototype.apply = function (element) {
        // Not yet implemented.
        return null;
    };
    return RelativePositionStrategy;
}());
exports.RelativePositionStrategy = RelativePositionStrategy;
//# sourceMappingURL=relative-position-strategy.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/**
 * Simple utility for getting the bounds of the browser viewport.
 * TODO: internal
 */
var ViewportRuler = (function () {
    function ViewportRuler() {
    }
    // TODO(jelbourn): cache the document's bounding rect and only update it when the window
    // is resized (debounced).
    /** Gets a ClientRect for the viewport's bounds. */
    ViewportRuler.prototype.getViewportRect = function () {
        // Use the document element's bounding rect rather than the window scroll properties
        // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
        // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
        // conceptual viewports. Under most circumstances these viewports are equivalent, but they
        // can disagree when the page is pinch-zoomed (on devices that support touch).
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
        // We use the documentElement instead of the body because, by default (without a css reset)
        // browsers typically give the document body an 8px margin, which is not included in
        // getBoundingClientRect().
        var documentRect = document.documentElement.getBoundingClientRect();
        var scrollPosition = this.getViewportScrollPosition(documentRect);
        var height = window.innerHeight;
        var width = window.innerWidth;
        return {
            top: scrollPosition.top,
            left: scrollPosition.left,
            bottom: scrollPosition.top + height,
            right: scrollPosition.left + width,
            height: height,
            width: width,
        };
    };
    /**
     * Gets the (top, left) scroll position of the viewport.
     * @param documentRect
     */
    ViewportRuler.prototype.getViewportScrollPosition = function (documentRect) {
        if (documentRect === void 0) { documentRect = document.documentElement.getBoundingClientRect(); }
        // The top-left-corner of the viewport is determined by the scroll position of the document
        // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
        // whether `document.body` or `document.documentElement` is the scrolled element, so reading
        // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
        // `document.documentElement` works consistently, where the `top` and `left` values will
        // equal negative the scroll position.
        var top = documentRect.top < 0 && document.body.scrollTop == 0 ?
            -documentRect.top :
            document.body.scrollTop;
        var left = documentRect.left < 0 && document.body.scrollLeft == 0 ?
            -documentRect.left :
            document.body.scrollLeft;
        return { top: top, left: left };
    };
    ViewportRuler = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ViewportRuler);
    return ViewportRuler;
}());
exports.ViewportRuler = ViewportRuler;
//# sourceMappingURL=viewport-ruler.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var portal_1 = require('./portal');
var portal_errors_1 = require('./portal-errors');
/**
 * A PortalHost for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 *
 * This is the only part of the portal core that directly touches the DOM.
 */
var DomPortalHost = (function (_super) {
    __extends(DomPortalHost, _super);
    function DomPortalHost(_hostDomElement, _componentResolver) {
        _super.call(this);
        this._hostDomElement = _hostDomElement;
        this._componentResolver = _componentResolver;
    }
    /** Attach the given ComponentPortal to DOM element using the ComponentResolver. */
    DomPortalHost.prototype.attachComponentPortal = function (portal) {
        var _this = this;
        if (portal.viewContainerRef == null) {
            throw new portal_errors_1.MdComponentPortalAttachedToDomWithoutOriginError();
        }
        return this._componentResolver.resolveComponent(portal.component).then(function (componentFactory) {
            var ref = portal.viewContainerRef.createComponent(componentFactory, portal.viewContainerRef.length, portal.injector || portal.viewContainerRef.parentInjector);
            var hostView = ref.hostView;
            _this._hostDomElement.appendChild(hostView.rootNodes[0]);
            _this.setDisposeFn(function () { return ref.destroy(); });
            return ref;
        });
    };
    DomPortalHost.prototype.attachTemplatePortal = function (portal) {
        var _this = this;
        var viewContainer = portal.viewContainerRef;
        var viewRef = viewContainer.createEmbeddedView(portal.templateRef);
        viewRef.rootNodes.forEach(function (rootNode) { return _this._hostDomElement.appendChild(rootNode); });
        this.setDisposeFn((function () {
            var index = viewContainer.indexOf(viewRef);
            if (index != -1) {
                viewContainer.remove(index);
            }
        }));
        // TODO(jelbourn): Return locals from view.
        return Promise.resolve(new Map());
    };
    DomPortalHost.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._hostDomElement.parentNode != null) {
            this._hostDomElement.parentNode.removeChild(this._hostDomElement);
        }
    };
    return DomPortalHost;
}(portal_1.BasePortalHost));
exports.DomPortalHost = DomPortalHost;
//# sourceMappingURL=dom-portal-host.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var portal_1 = require('./portal');
/**
 * Directive version of a `TemplatePortal`. Because the directive *is* a TemplatePortal,
 * the directive instance itself can be attached to a host, enabling declarative use of portals.
 *
 * Usage:
 * <template portal #greeting>
 *   <p> Hello {{name}} </p>
 * </template>
 */
var TemplatePortalDirective = (function (_super) {
    __extends(TemplatePortalDirective, _super);
    function TemplatePortalDirective(templateRef, viewContainerRef) {
        _super.call(this, templateRef, viewContainerRef);
    }
    TemplatePortalDirective = __decorate([
        core_1.Directive({
            selector: '[portal]',
            exportAs: 'portal',
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef])
    ], TemplatePortalDirective);
    return TemplatePortalDirective;
}(portal_1.TemplatePortal));
exports.TemplatePortalDirective = TemplatePortalDirective;
/**
 * Directive version of a PortalHost. Because the directive *is* a PortalHost, portals can be
 * directly attached to it, enabling declarative use.
 *
 * Usage:
 * <template [portalHost]="greeting"></template>
 */
var PortalHostDirective = (function (_super) {
    __extends(PortalHostDirective, _super);
    function PortalHostDirective(_componentResolver, _viewContainerRef) {
        _super.call(this);
        this._componentResolver = _componentResolver;
        this._viewContainerRef = _viewContainerRef;
    }
    Object.defineProperty(PortalHostDirective.prototype, "portal", {
        get: function () {
            return this._portal;
        },
        set: function (p) {
            this._replaceAttachedPortal(p);
        },
        enumerable: true,
        configurable: true
    });
    /** Attach the given ComponentPortal to this PortlHost using the ComponentResolver. */
    PortalHostDirective.prototype.attachComponentPortal = function (portal) {
        var _this = this;
        portal.setAttachedHost(this);
        // If the portal specifies an origin, use that as the logical location of the component
        // in the application tree. Otherwise use the location of this PortalHost.
        var viewContainerRef = portal.viewContainerRef != null ?
            portal.viewContainerRef :
            this._viewContainerRef;
        return this._componentResolver.resolveComponent(portal.component).then(function (componentFactory) {
            var ref = viewContainerRef.createComponent(componentFactory, viewContainerRef.length, portal.injector || viewContainerRef.parentInjector);
            _this.setDisposeFn(function () { return ref.destroy(); });
            return ref;
        });
    };
    /** Attach the given TemplatePortal to this PortlHost as an embedded View. */
    PortalHostDirective.prototype.attachTemplatePortal = function (portal) {
        var _this = this;
        portal.setAttachedHost(this);
        this._viewContainerRef.createEmbeddedView(portal.templateRef);
        this.setDisposeFn(function () { return _this._viewContainerRef.clear(); });
        // TODO(jelbourn): return locals from view
        return Promise.resolve(new Map());
    };
    /** Detatches the currently attached Portal (if there is one) and attaches the given Portal. */
    PortalHostDirective.prototype._replaceAttachedPortal = function (p) {
        var _this = this;
        var maybeDetach = this.hasAttached() ? this.detach() : Promise.resolve(null);
        maybeDetach.then(function () {
            if (p) {
                _this.attach(p);
                _this._portal = p;
            }
        });
    };
    PortalHostDirective = __decorate([
        core_1.Directive({
            selector: '[portalHost]',
            inputs: ['portal: portalHost']
        }), 
        __metadata('design:paramtypes', [core_1.ComponentResolver, core_1.ViewContainerRef])
    ], PortalHostDirective);
    return PortalHostDirective;
}(portal_1.BasePortalHost));
exports.PortalHostDirective = PortalHostDirective;
exports.PORTAL_DIRECTIVES = [TemplatePortalDirective, PortalHostDirective];
var PortalModule = (function () {
    function PortalModule() {
    }
    PortalModule = __decorate([
        core_1.NgModule({
            exports: exports.PORTAL_DIRECTIVES,
            declarations: exports.PORTAL_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], PortalModule);
    return PortalModule;
}());
exports.PortalModule = PortalModule;
//# sourceMappingURL=portal-directives.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var error_1 = require('../errors/error');
/** Exception thrown when a ComponentPortal is attached to a DomPortalHost without an origin. */
var MdComponentPortalAttachedToDomWithoutOriginError = (function (_super) {
    __extends(MdComponentPortalAttachedToDomWithoutOriginError, _super);
    function MdComponentPortalAttachedToDomWithoutOriginError() {
        _super.call(this, 'A ComponentPortal must have an origin set when attached to a DomPortalHost ' +
            'because the DOM element is not part of the Angular application context.');
    }
    return MdComponentPortalAttachedToDomWithoutOriginError;
}(error_1.MdError));
exports.MdComponentPortalAttachedToDomWithoutOriginError = MdComponentPortalAttachedToDomWithoutOriginError;
/** Exception thrown when attempting to attach a null portal to a host. */
var MdNullPortalError = (function (_super) {
    __extends(MdNullPortalError, _super);
    function MdNullPortalError() {
        _super.call(this, 'Must provide a portal to attach');
    }
    return MdNullPortalError;
}(error_1.MdError));
exports.MdNullPortalError = MdNullPortalError;
/** Exception thrown when attempting to attach a portal to a host that is already attached. */
var MdPortalAlreadyAttachedError = (function (_super) {
    __extends(MdPortalAlreadyAttachedError, _super);
    function MdPortalAlreadyAttachedError() {
        _super.call(this, 'Host already has a portal attached');
    }
    return MdPortalAlreadyAttachedError;
}(error_1.MdError));
exports.MdPortalAlreadyAttachedError = MdPortalAlreadyAttachedError;
/** Exception thrown when attempting to attach a portal to an already-disposed host. */
var MdPortalHostAlreadyDisposedError = (function (_super) {
    __extends(MdPortalHostAlreadyDisposedError, _super);
    function MdPortalHostAlreadyDisposedError() {
        _super.call(this, 'This PortalHost has already been disposed');
    }
    return MdPortalHostAlreadyDisposedError;
}(error_1.MdError));
exports.MdPortalHostAlreadyDisposedError = MdPortalHostAlreadyDisposedError;
/** Exception thrown when attempting to attach an unknown portal type. */
var MdUnknownPortalTypeError = (function (_super) {
    __extends(MdUnknownPortalTypeError, _super);
    function MdUnknownPortalTypeError() {
        _super.call(this, 'Attempting to attach an unknown Portal type. ' +
            'BasePortalHost accepts either a ComponentPortal or a TemplatePortal.');
    }
    return MdUnknownPortalTypeError;
}(error_1.MdError));
exports.MdUnknownPortalTypeError = MdUnknownPortalTypeError;
/** Exception thrown when attempting to attach a portal to a null host. */
var MdNullPortalHostError = (function (_super) {
    __extends(MdNullPortalHostError, _super);
    function MdNullPortalHostError() {
        _super.call(this, 'Attempting to attach a portal to a null PortalHost');
    }
    return MdNullPortalHostError;
}(error_1.MdError));
exports.MdNullPortalHostError = MdNullPortalHostError;
/** Exception thrown when attempting to detach a portal that is not attached. */
var MdNoPortalAttachedError = (function (_super) {
    __extends(MdNoPortalAttachedError, _super);
    function MdNoPortalAttachedError() {
        _super.call(this, 'Attempting to detach a portal that is not attached to a host');
    }
    return MdNoPortalAttachedError;
}(error_1.MdError));
exports.MdNoPortalAttachedError = MdNoPortalAttachedError;
//# sourceMappingURL=portal-errors.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var portal_errors_1 = require('./portal-errors');
/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalHost`.
 */
var Portal = (function () {
    function Portal() {
    }
    /** Attach this portal to a host. */
    Portal.prototype.attach = function (host) {
        if (host == null) {
            throw new portal_errors_1.MdNullPortalHostError();
        }
        if (host.hasAttached()) {
            throw new portal_errors_1.MdPortalAlreadyAttachedError();
        }
        this._attachedHost = host;
        return host.attach(this);
    };
    /** Detach this portal from its host */
    Portal.prototype.detach = function () {
        var host = this._attachedHost;
        if (host == null) {
            throw new portal_errors_1.MdNoPortalAttachedError();
        }
        this._attachedHost = null;
        return host.detach();
    };
    Object.defineProperty(Portal.prototype, "isAttached", {
        /** Whether this portal is attached to a host. */
        get: function () {
            return this._attachedHost != null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the PortalHost reference without performing `attach()`. This is used directly by
     * the PortalHost when it is performing an `attach()` or `detatch()`.
     */
    Portal.prototype.setAttachedHost = function (host) {
        this._attachedHost = host;
    };
    return Portal;
}());
exports.Portal = Portal;
/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
var ComponentPortal = (function (_super) {
    __extends(ComponentPortal, _super);
    function ComponentPortal(component, viewContainerRef, injector) {
        if (viewContainerRef === void 0) { viewContainerRef = null; }
        if (injector === void 0) { injector = null; }
        _super.call(this);
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
    }
    return ComponentPortal;
}(Portal));
exports.ComponentPortal = ComponentPortal;
/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
var TemplatePortal = (function (_super) {
    __extends(TemplatePortal, _super);
    function TemplatePortal(template, viewContainerRef) {
        _super.call(this);
        /**
         * Additional locals for the instantiated embedded view.
         * These locals can be seen as "exports" for the template, such as how ngFor has
         * index / event / odd.
         * See https://angular.io/docs/ts/latest/api/core/EmbeddedViewRef-class.html
         */
        this.locals = new Map();
        this.templateRef = template;
        this.viewContainerRef = viewContainerRef;
    }
    Object.defineProperty(TemplatePortal.prototype, "origin", {
        get: function () {
            return this.templateRef.elementRef;
        },
        enumerable: true,
        configurable: true
    });
    TemplatePortal.prototype.attach = function (host, locals) {
        this.locals = locals == null ? new Map() : locals;
        return _super.prototype.attach.call(this, host);
    };
    TemplatePortal.prototype.detach = function () {
        this.locals = new Map();
        return _super.prototype.detach.call(this);
    };
    return TemplatePortal;
}(Portal));
exports.TemplatePortal = TemplatePortal;
/**
 * Partial implementation of PortalHost that only deals with attaching either a
 * ComponentPortal or a TemplatePortal.
 */
var BasePortalHost = (function () {
    function BasePortalHost() {
        /** Whether this host has already been permanently disposed. */
        this._isDisposed = false;
    }
    /** Whether this host has an attached portal. */
    BasePortalHost.prototype.hasAttached = function () {
        return this._attachedPortal != null;
    };
    BasePortalHost.prototype.attach = function (portal) {
        if (portal == null) {
            throw new portal_errors_1.MdNullPortalError();
        }
        if (this.hasAttached()) {
            throw new portal_errors_1.MdPortalAlreadyAttachedError();
        }
        if (this._isDisposed) {
            throw new portal_errors_1.MdPortalHostAlreadyDisposedError();
        }
        if (portal instanceof ComponentPortal) {
            this._attachedPortal = portal;
            return this.attachComponentPortal(portal);
        }
        else if (portal instanceof TemplatePortal) {
            this._attachedPortal = portal;
            return this.attachTemplatePortal(portal);
        }
        throw new portal_errors_1.MdUnknownPortalTypeError();
    };
    BasePortalHost.prototype.detach = function () {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
        }
        this._attachedPortal = null;
        if (this._disposeFn != null) {
            this._disposeFn();
            this._disposeFn = null;
        }
        return Promise.resolve(null);
    };
    BasePortalHost.prototype.dispose = function () {
        if (this.hasAttached()) {
            this.detach();
        }
        this._isDisposed = true;
    };
    BasePortalHost.prototype.setDisposeFn = function (fn) {
        this._disposeFn = fn;
    };
    return BasePortalHost;
}());
exports.BasePortalHost = BasePortalHost;
//# sourceMappingURL=portal.js.map
"use strict";
/** TODO: internal */
(function (ForegroundRippleState) {
    ForegroundRippleState[ForegroundRippleState["NEW"] = 0] = "NEW";
    ForegroundRippleState[ForegroundRippleState["EXPANDING"] = 1] = "EXPANDING";
    ForegroundRippleState[ForegroundRippleState["FADING_OUT"] = 2] = "FADING_OUT";
})(exports.ForegroundRippleState || (exports.ForegroundRippleState = {}));
var ForegroundRippleState = exports.ForegroundRippleState;
/**
 * Wrapper for a foreground ripple DOM element and its animation state.
 * TODO: internal
 */
var ForegroundRipple = (function () {
    function ForegroundRipple(rippleElement) {
        this.rippleElement = rippleElement;
        this.state = ForegroundRippleState.NEW;
    }
    return ForegroundRipple;
}());
exports.ForegroundRipple = ForegroundRipple;
var RIPPLE_SPEED_PX_PER_SECOND = 1000;
var MIN_RIPPLE_FILL_TIME_SECONDS = 0.1;
var MAX_RIPPLE_FILL_TIME_SECONDS = 0.3;
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 */
var distanceToFurthestCorner = function (x, y, rect) {
    var distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    var distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
};
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * TODO: internal
 */
var RippleRenderer = (function () {
    function RippleRenderer(_elementRef, _eventHandlers) {
        this._eventHandlers = _eventHandlers;
        this._rippleElement = _elementRef.nativeElement;
        // It might be nice to delay creating the background until it's needed, but doing this in
        // fadeInRippleBackground causes the first click event to not be handled reliably.
        this._backgroundDiv = document.createElement('div');
        this._backgroundDiv.classList.add('md-ripple-background');
        this._rippleElement.appendChild(this._backgroundDiv);
    }
    /**
     * Installs event handlers on the given trigger element, and removes event handlers from the
     * previous trigger if needed.
     */
    RippleRenderer.prototype.setTriggerElement = function (newTrigger) {
        var _this = this;
        if (this._triggerElement !== newTrigger) {
            if (this._triggerElement) {
                this._eventHandlers.forEach(function (eventHandler, eventName) {
                    _this._triggerElement.removeEventListener(eventName, eventHandler);
                });
            }
            this._triggerElement = newTrigger;
            if (this._triggerElement) {
                this._eventHandlers.forEach(function (eventHandler, eventName) {
                    _this._triggerElement.addEventListener(eventName, eventHandler);
                });
            }
        }
    };
    /**
     * Installs event handlers on the host element of the md-ripple directive.
     */
    RippleRenderer.prototype.setTriggerElementToHost = function () {
        this.setTriggerElement(this._rippleElement);
    };
    /**
     * Removes event handlers from the current trigger element if needed.
     */
    RippleRenderer.prototype.clearTriggerElement = function () {
        this.setTriggerElement(null);
    };
    /**
     * Creates a foreground ripple and sets its animation to expand and fade in from the position
     * given by rippleOriginLeft and rippleOriginTop (or from the center of the <md-ripple>
     * bounding rect if centered is true).
     */
    RippleRenderer.prototype.createForegroundRipple = function (rippleOriginLeft, rippleOriginTop, color, centered, radius, speedFactor, transitionEndCallback) {
        var parentRect = this._rippleElement.getBoundingClientRect();
        // Create a foreground ripple div with the size and position of the fully expanded ripple.
        // When the div is created, it's given a transform style that causes the ripple to be displayed
        // small and centered on the event location (or the center of the bounding rect if the centered
        // argument is true). Removing that transform causes the ripple to animate to its natural size.
        var startX = centered ? (parentRect.left + parentRect.width / 2) : rippleOriginLeft;
        var startY = centered ? (parentRect.top + parentRect.height / 2) : rippleOriginTop;
        var offsetX = startX - parentRect.left;
        var offsetY = startY - parentRect.top;
        var maxRadius = radius > 0 ? radius : distanceToFurthestCorner(startX, startY, parentRect);
        var rippleDiv = document.createElement('div');
        this._rippleElement.appendChild(rippleDiv);
        rippleDiv.classList.add('md-ripple-foreground');
        rippleDiv.style.left = (offsetX - maxRadius) + "px";
        rippleDiv.style.top = (offsetY - maxRadius) + "px";
        rippleDiv.style.width = 2 * maxRadius + "px";
        rippleDiv.style.height = rippleDiv.style.width;
        // If color input is not set, this will default to the background color defined in CSS.
        rippleDiv.style.backgroundColor = color;
        // Start the ripple tiny.
        rippleDiv.style.transform = "scale(0.001)";
        var fadeInSeconds = (1 / (speedFactor || 1)) * Math.max(MIN_RIPPLE_FILL_TIME_SECONDS, Math.min(MAX_RIPPLE_FILL_TIME_SECONDS, maxRadius / RIPPLE_SPEED_PX_PER_SECOND));
        rippleDiv.style.transitionDuration = fadeInSeconds + "s";
        // https://timtaubert.de/blog/2012/09/css-transitions-for-dynamically-created-dom-elements/
        window.getComputedStyle(rippleDiv).opacity;
        rippleDiv.classList.add('md-ripple-fade-in');
        // Clearing the transform property causes the ripple to animate to its full size.
        rippleDiv.style.transform = '';
        var ripple = new ForegroundRipple(rippleDiv);
        ripple.state = ForegroundRippleState.EXPANDING;
        rippleDiv.addEventListener('transitionend', function (event) { return transitionEndCallback(ripple, event); });
    };
    /**
     * Fades out a foreground ripple after it has fully expanded and faded in.
     */
    RippleRenderer.prototype.fadeOutForegroundRipple = function (ripple) {
        ripple.classList.remove('md-ripple-fade-in');
        ripple.classList.add('md-ripple-fade-out');
    };
    /**
     * Removes a foreground ripple from the DOM after it has faded out.
     */
    RippleRenderer.prototype.removeRippleFromDom = function (ripple) {
        ripple.parentElement.removeChild(ripple);
    };
    /**
     * Fades in the ripple background.
     */
    RippleRenderer.prototype.fadeInRippleBackground = function (color) {
        this._backgroundDiv.classList.add('md-ripple-active');
        // If color is not set, this will default to the background color defined in CSS.
        this._backgroundDiv.style.backgroundColor = color;
    };
    /**
     * Fades out the ripple background.
     */
    RippleRenderer.prototype.fadeOutRippleBackground = function () {
        if (this._backgroundDiv) {
            this._backgroundDiv.classList.remove('md-ripple-active');
        }
    };
    return RippleRenderer;
}());
exports.RippleRenderer = RippleRenderer;
//# sourceMappingURL=ripple-renderer.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ripple_renderer_1 = require('./ripple-renderer');
var MdRipple = (function () {
    function MdRipple(_elementRef) {
        var _this = this;
        /**
         * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
         * will be the distance from the center of the ripple to the furthest corner of the host element's
         * bounding rectangle.
         */
        this.maxRadius = 0;
        /**
         * If set, the normal duration of ripple animations is divided by this value. For example,
         * setting it to 0.5 will cause the animations to take twice as long.
         */
        this.speedFactor = 1;
        // These event handlers are attached to the element that triggers the ripple animations.
        var eventHandlers = new Map();
        eventHandlers.set('mousedown', function (event) { return _this._mouseDown(event); });
        eventHandlers.set('click', function (event) { return _this._click(event); });
        eventHandlers.set('mouseleave', function (event) { return _this._mouseLeave(event); });
        this._rippleRenderer = new ripple_renderer_1.RippleRenderer(_elementRef, eventHandlers);
    }
    /** TODO: internal */
    MdRipple.prototype.ngOnInit = function () {
        // If no trigger element was explicity set, use the host element
        if (!this.trigger) {
            this._rippleRenderer.setTriggerElementToHost();
        }
    };
    /** TODO: internal */
    MdRipple.prototype.ngOnDestroy = function () {
        // Remove event listeners on the trigger element.
        this._rippleRenderer.clearTriggerElement();
    };
    /** TODO: internal */
    MdRipple.prototype.ngOnChanges = function (changes) {
        // If the trigger element changed (or is being initially set), add event listeners to it.
        var changedInputs = Object.keys(changes);
        if (changedInputs.indexOf('trigger') !== -1) {
            this._rippleRenderer.setTriggerElement(this.trigger);
        }
    };
    /**
     * Responds to the start of a ripple animation trigger by fading the background in.
     */
    MdRipple.prototype.start = function () {
        this._rippleRenderer.fadeInRippleBackground(this.backgroundColor);
    };
    /**
     * Responds to the end of a ripple animation trigger by fading the background out, and creating a
     * foreground ripple that expands from the event location (or from the center of the element if
     * the "centered" property is set or forceCenter is true).
     */
    MdRipple.prototype.end = function (left, top, forceCenter) {
        var _this = this;
        if (forceCenter === void 0) { forceCenter = true; }
        this._rippleRenderer.createForegroundRipple(left, top, this.color, this.centered || forceCenter, this.maxRadius, this.speedFactor, function (ripple, e) { return _this._rippleTransitionEnded(ripple, e); });
        this._rippleRenderer.fadeOutRippleBackground();
    };
    MdRipple.prototype._rippleTransitionEnded = function (ripple, event) {
        if (event.propertyName === 'opacity') {
            // If the ripple finished expanding, start fading it out. If it finished fading out,
            // remove it from the DOM.
            switch (ripple.state) {
                case ripple_renderer_1.ForegroundRippleState.EXPANDING:
                    this._rippleRenderer.fadeOutForegroundRipple(ripple.rippleElement);
                    ripple.state = ripple_renderer_1.ForegroundRippleState.FADING_OUT;
                    break;
                case ripple_renderer_1.ForegroundRippleState.FADING_OUT:
                    this._rippleRenderer.removeRippleFromDom(ripple.rippleElement);
                    break;
            }
        }
    };
    /**
     * Called when the trigger element receives a mousedown event. Starts the ripple animation by
     * fading in the background.
     */
    MdRipple.prototype._mouseDown = function (event) {
        if (!this.disabled && event.button === 0) {
            this.start();
        }
    };
    /**
     * Called when the trigger element receives a click event. Creates a foreground ripple and
     * runs its animation.
     */
    MdRipple.prototype._click = function (event) {
        if (!this.disabled && event.button === 0) {
            // If screen and page positions are all 0, this was probably triggered by a keypress.
            // In that case, use the center of the bounding rect as the ripple origin.
            // FIXME: This fails on IE11, which still sets pageX/Y and screenX/Y on keyboard clicks.
            var isKeyEvent = (event.screenX === 0 && event.screenY === 0 && event.pageX === 0 && event.pageY === 0);
            this.end(event.pageX, event.pageY, isKeyEvent);
        }
    };
    /**
     * Called when the trigger element receives a mouseleave event. Fades out the background.
     */
    MdRipple.prototype._mouseLeave = function (event) {
        // We can always fade out the background here; It's a no-op if it was already inactive.
        this._rippleRenderer.fadeOutRippleBackground();
    };
    __decorate([
        core_1.Input('md-ripple-trigger'), 
        __metadata('design:type', HTMLElement)
    ], MdRipple.prototype, "trigger", void 0);
    __decorate([
        core_1.Input('md-ripple-centered'), 
        __metadata('design:type', Boolean)
    ], MdRipple.prototype, "centered", void 0);
    __decorate([
        core_1.Input('md-ripple-disabled'), 
        __metadata('design:type', Boolean)
    ], MdRipple.prototype, "disabled", void 0);
    __decorate([
        core_1.Input('md-ripple-max-radius'), 
        __metadata('design:type', Number)
    ], MdRipple.prototype, "maxRadius", void 0);
    __decorate([
        core_1.Input('md-ripple-speed-factor'), 
        __metadata('design:type', Number)
    ], MdRipple.prototype, "speedFactor", void 0);
    __decorate([
        core_1.Input('md-ripple-color'), 
        __metadata('design:type', String)
    ], MdRipple.prototype, "color", void 0);
    __decorate([
        core_1.Input('md-ripple-background-color'), 
        __metadata('design:type', String)
    ], MdRipple.prototype, "backgroundColor", void 0);
    __decorate([
        core_1.HostBinding('class.md-ripple-focused'),
        core_1.Input('md-ripple-focused'), 
        __metadata('design:type', Boolean)
    ], MdRipple.prototype, "focused", void 0);
    __decorate([
        core_1.HostBinding('class.md-ripple-unbounded'),
        core_1.Input('md-ripple-unbounded'), 
        __metadata('design:type', Boolean)
    ], MdRipple.prototype, "unbounded", void 0);
    MdRipple = __decorate([
        core_1.Directive({
            selector: '[md-ripple]',
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], MdRipple);
    return MdRipple;
}());
exports.MdRipple = MdRipple;
/** @deprecated */
exports.MD_RIPPLE_DIRECTIVES = [MdRipple];
var MdRippleModule = (function () {
    function MdRippleModule() {
    }
    MdRippleModule = __decorate([
        core_1.NgModule({
            exports: exports.MD_RIPPLE_DIRECTIVES,
            declarations: exports.MD_RIPPLE_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdRippleModule);
    return MdRippleModule;
}());
exports.MdRippleModule = MdRippleModule;
//# sourceMappingURL=ripple.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/**
 * Directive to listen to changes of direction of part of the DOM.
 *
 * Applications should use this directive instead of the native attribute so that Material
 * components can listen on changes of direction.
 */
var Dir = (function () {
    function Dir() {
        this._dir = 'ltr';
        this.dirChange = new core_1.EventEmitter();
    }
    Object.defineProperty(Dir.prototype, "dir", {
        get: function () {
            return this._dir;
        },
        set: function (v) {
            var old = this._dir;
            this._dir = v;
            if (old != this._dir) {
                this.dirChange.emit(null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dir.prototype, "value", {
        get: function () { return this.dir; },
        set: function (v) { this.dir = v; },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input('dir'), 
        __metadata('design:type', String)
    ], Dir.prototype, "_dir", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Dir.prototype, "dirChange", void 0);
    __decorate([
        core_1.HostBinding('attr.dir'), 
        __metadata('design:type', String)
    ], Dir.prototype, "dir", null);
    Dir = __decorate([
        core_1.Directive({
            selector: '[dir]',
            // TODO(hansl): maybe `$implicit` isn't the best option here, but for now that's the best we got.
            exportAs: '$implicit'
        }), 
        __metadata('design:paramtypes', [])
    ], Dir);
    return Dir;
}());
exports.Dir = Dir;
var RtlModule = (function () {
    function RtlModule() {
    }
    RtlModule = __decorate([
        core_1.NgModule({
            exports: [Dir],
            declarations: [Dir]
        }), 
        __metadata('design:paramtypes', [])
    ], RtlModule);
    return RtlModule;
}());
exports.RtlModule = RtlModule;
//# sourceMappingURL=dir.js.map
"use strict";
/**
 * Applies a CSS transform to an element, including browser-prefixed properties.
 * @param element
 * @param transformValue
 */
function applyCssTransform(element, transformValue) {
    // It's important to trim the result, because the browser will ignore the set operation
    // if the string contains only whitespace.
    var value = transformValue.trim();
    element.style.transform = value;
    element.style.webkitTransform = value;
}
exports.applyCssTransform = applyCssTransform;
//# sourceMappingURL=apply-transform.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var error_1 = require('@angular2-material/core/errors/error');
/**
 * Exception thrown when cols property is missing from grid-list
 */
var MdGridListColsError = (function (_super) {
    __extends(MdGridListColsError, _super);
    function MdGridListColsError() {
        _super.call(this, "md-grid-list: must pass in number of columns. Example: <md-grid-list cols=\"3\">");
    }
    return MdGridListColsError;
}(error_1.MdError));
exports.MdGridListColsError = MdGridListColsError;
/**
 * Exception thrown when a tile's colspan is longer than the number of cols in list
 */
var MdGridTileTooWideError = (function (_super) {
    __extends(MdGridTileTooWideError, _super);
    function MdGridTileTooWideError(cols, listLength) {
        _super.call(this, "md-grid-list: tile with colspan " + cols + " is wider than grid with cols=\"" + listLength + "\".");
    }
    return MdGridTileTooWideError;
}(error_1.MdError));
exports.MdGridTileTooWideError = MdGridTileTooWideError;
/**
 * Exception thrown when an invalid ratio is passed in as a rowHeight
 */
var MdGridListBadRatioError = (function (_super) {
    __extends(MdGridListBadRatioError, _super);
    function MdGridListBadRatioError(value) {
        _super.call(this, "md-grid-list: invalid ratio given for row-height: \"" + value + "\"");
    }
    return MdGridListBadRatioError;
}(error_1.MdError));
exports.MdGridListBadRatioError = MdGridListBadRatioError;
//# sourceMappingURL=grid-list-errors.js.map
"use strict";
/**
 * Converts values into strings. Falsy values become empty strings.
 * TODO: internal
 */
function coerceToString(value) {
    return "" + (value || '');
}
exports.coerceToString = coerceToString;
/**
 * Converts a value that might be a string into a number.
 * TODO: internal
 */
function coerceToNumber(value) {
    return typeof value === 'string' ? parseInt(value, 10) : value;
}
exports.coerceToNumber = coerceToNumber;
//# sourceMappingURL=grid-list-measure.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var grid_tile_1 = require('./grid-tile');
var tile_coordinator_1 = require('./tile-coordinator');
var tile_styler_1 = require('./tile-styler');
var grid_list_errors_1 = require('./grid-list-errors');
var dir_1 = require('@angular2-material/core/rtl/dir');
var line_1 = require('@angular2-material/core/line/line');
var grid_list_measure_1 = require('./grid-list-measure');
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
var MD_FIT_MODE = 'fit';
var MdGridList = (function () {
    function MdGridList(_renderer, _element, _dir) {
        this._renderer = _renderer;
        this._element = _element;
        this._dir = _dir;
        /** The amount of space between tiles. This will be something like '5px' or '2em'. */
        this._gutter = '1px';
    }
    Object.defineProperty(MdGridList.prototype, "cols", {
        get: function () {
            return this._cols;
        },
        set: function (value) {
            this._cols = grid_list_measure_1.coerceToNumber(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "gutterSize", {
        get: function () {
            return this._gutter;
        },
        set: function (value) {
            this._gutter = grid_list_measure_1.coerceToString(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "rowHeight", {
        /** Set internal representation of row height from the user-provided value. */
        set: function (value) {
            this._rowHeight = grid_list_measure_1.coerceToString(value);
            this._setTileStyler();
        },
        enumerable: true,
        configurable: true
    });
    /** TODO: internal */
    MdGridList.prototype.ngOnInit = function () {
        this._checkCols();
        this._checkRowHeight();
    };
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     * TODO: internal
     */
    MdGridList.prototype.ngAfterContentChecked = function () {
        this._layoutTiles();
    };
    /** Throw a friendly error if cols property is missing */
    MdGridList.prototype._checkCols = function () {
        if (!this.cols) {
            throw new grid_list_errors_1.MdGridListColsError();
        }
    };
    /** Default to equal width:height if rowHeight property is missing */
    MdGridList.prototype._checkRowHeight = function () {
        if (!this._rowHeight) {
            this._tileStyler = new tile_styler_1.RatioTileStyler('1:1');
        }
    };
    /** Creates correct Tile Styler subtype based on rowHeight passed in by user */
    MdGridList.prototype._setTileStyler = function () {
        if (this._rowHeight === MD_FIT_MODE) {
            this._tileStyler = new tile_styler_1.FitTileStyler();
        }
        else if (this._rowHeight && this._rowHeight.match(/:/g)) {
            this._tileStyler = new tile_styler_1.RatioTileStyler(this._rowHeight);
        }
        else {
            this._tileStyler = new tile_styler_1.FixedTileStyler(this._rowHeight);
        }
    };
    /** Computes and applies the size and position for all children grid tiles. */
    MdGridList.prototype._layoutTiles = function () {
        var tiles = this._tiles.toArray();
        var tracker = new tile_coordinator_1.TileCoordinator(this.cols, tiles);
        var direction = this._dir ? this._dir.value : 'ltr';
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        for (var i = 0; i < tiles.length; i++) {
            var pos = tracker.positions[i];
            var tile = tiles[i];
            this._tileStyler.setStyle(tile, pos.row, pos.col);
        }
        this._setListStyle(this._tileStyler.getComputedHeight());
    };
    /** Sets style on the main grid-list element, given the style name and value. */
    MdGridList.prototype._setListStyle = function (style) {
        if (style) {
            this._renderer.setElementStyle(this._element.nativeElement, style[0], style[1]);
        }
    };
    __decorate([
        core_1.ContentChildren(grid_tile_1.MdGridTile), 
        __metadata('design:type', core_1.QueryList)
    ], MdGridList.prototype, "_tiles", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdGridList.prototype, "cols", null);
    __decorate([
        core_1.Input('gutterSize'), 
        __metadata('design:type', Object)
    ], MdGridList.prototype, "gutterSize", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], MdGridList.prototype, "rowHeight", null);
    MdGridList = __decorate([
        core_1.Component({            selector: 'md-grid-list',
            template: "<div class=\"md-grid-list\"> <ng-content></ng-content> </div>",
            styles: ["/** * This mixin will ensure that lines that overflow the container will * hide the overflow and truncate neatly with an ellipsis. */ /** * This mixin provides all md-line styles, changing secondary font size * based on whether the list is in dense mode. */ /** * This mixin provides base styles for the wrapper around md-line * elements in a list. */ /** * This mixin normalizes default element styles, e.g. font weight for heading text. */ /* height of tile header or footer if it has one line */ /* height of tile header or footer if it has two lines */ /* side padding for text in tile headers and footers */ /* font styles for text in tile headers and footers */ md-grid-list { display: block; position: relative; } md-grid-tile { display: block; position: absolute; } md-grid-tile figure { display: -webkit-box; display: -ms-flexbox; display: flex; position: absolute; -webkit-box-align: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; height: 100%; top: 0; right: 0; bottom: 0; left: 0; padding: 0; margin: 0; } md-grid-tile md-grid-tile-header, md-grid-tile md-grid-tile-footer { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; height: 48px; color: #fff; background: rgba(0, 0, 0, 0.18); overflow: hidden; padding: 0 16px; font-size: 16px; position: absolute; left: 0; right: 0; } md-grid-tile md-grid-tile-header [md-line], md-grid-tile md-grid-tile-footer [md-line] { white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; display: block; box-sizing: border-box; } md-grid-tile md-grid-tile-header [md-line]:nth-child(n+2), md-grid-tile md-grid-tile-footer [md-line]:nth-child(n+2) { font-size: 12px; } md-grid-tile md-grid-tile-header > *, md-grid-tile md-grid-tile-footer > * { margin: 0; padding: 0; font-weight: normal; font-size: inherit; } md-grid-tile md-grid-tile-header.md-2-line, md-grid-tile md-grid-tile-footer.md-2-line { height: 68px; } md-grid-tile .md-grid-list-text { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; width: 100%; box-sizing: border-box; overflow: hidden; } md-grid-tile .md-grid-list-text > * { margin: 0; padding: 0; font-weight: normal; font-size: inherit; } md-grid-tile .md-grid-list-text:empty { display: none; } md-grid-tile md-grid-tile-header { top: 0; } md-grid-tile md-grid-tile-footer { bottom: 0; } md-grid-tile [md-grid-avatar] { padding-right: 16px; } [dir='rtl'] md-grid-tile [md-grid-avatar] { padding-right: 0; padding-left: 16px; } md-grid-tile [md-grid-avatar]:empty { display: none; } "],
            encapsulation: core_1.ViewEncapsulation.None,
        }),
        __param(2, core_1.Optional()), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, dir_1.Dir])
    ], MdGridList);
    return MdGridList;
}());
exports.MdGridList = MdGridList;
/** @deprecated */
exports.MD_GRID_LIST_DIRECTIVES = [MdGridList, grid_tile_1.MdGridTile, grid_tile_1.MdGridTileText];
var MdGridListModule = (function () {
    function MdGridListModule() {
    }
    MdGridListModule = __decorate([
        core_1.NgModule({
            imports: [line_1.MdLineModule],
            exports: [exports.MD_GRID_LIST_DIRECTIVES, line_1.MdLineModule],
            declarations: exports.MD_GRID_LIST_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdGridListModule);
    return MdGridListModule;
}());
exports.MdGridListModule = MdGridListModule;
//# sourceMappingURL=grid-list.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var line_1 = require('@angular2-material/core/line/line');
var grid_list_measure_1 = require('./grid-list-measure');
var MdGridTile = (function () {
    function MdGridTile(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        this._rowspan = 1;
        this._colspan = 1;
    }
    Object.defineProperty(MdGridTile.prototype, "rowspan", {
        get: function () {
            return this._rowspan;
        },
        set: function (value) {
            this._rowspan = grid_list_measure_1.coerceToNumber(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridTile.prototype, "colspan", {
        get: function () {
            return this._colspan;
        },
        set: function (value) {
            this._colspan = grid_list_measure_1.coerceToNumber(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     */
    MdGridTile.prototype._setStyle = function (property, value) {
        this._renderer.setElementStyle(this._element.nativeElement, property, value);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdGridTile.prototype, "rowspan", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdGridTile.prototype, "colspan", null);
    MdGridTile = __decorate([
        core_1.Component({            selector: 'md-grid-tile',
            host: { 'role': 'listitem' },
            template: "<!-- TODO(kara): Revisit why this is a figure.--> <figure> <ng-content></ng-content> </figure>",
            styles: ["/** * This mixin will ensure that lines that overflow the container will * hide the overflow and truncate neatly with an ellipsis. */ /** * This mixin provides all md-line styles, changing secondary font size * based on whether the list is in dense mode. */ /** * This mixin provides base styles for the wrapper around md-line * elements in a list. */ /** * This mixin normalizes default element styles, e.g. font weight for heading text. */ /* height of tile header or footer if it has one line */ /* height of tile header or footer if it has two lines */ /* side padding for text in tile headers and footers */ /* font styles for text in tile headers and footers */ md-grid-list { display: block; position: relative; } md-grid-tile { display: block; position: absolute; } md-grid-tile figure { display: -webkit-box; display: -ms-flexbox; display: flex; position: absolute; -webkit-box-align: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; height: 100%; top: 0; right: 0; bottom: 0; left: 0; padding: 0; margin: 0; } md-grid-tile md-grid-tile-header, md-grid-tile md-grid-tile-footer { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; height: 48px; color: #fff; background: rgba(0, 0, 0, 0.18); overflow: hidden; padding: 0 16px; font-size: 16px; position: absolute; left: 0; right: 0; } md-grid-tile md-grid-tile-header [md-line], md-grid-tile md-grid-tile-footer [md-line] { white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; display: block; box-sizing: border-box; } md-grid-tile md-grid-tile-header [md-line]:nth-child(n+2), md-grid-tile md-grid-tile-footer [md-line]:nth-child(n+2) { font-size: 12px; } md-grid-tile md-grid-tile-header > *, md-grid-tile md-grid-tile-footer > * { margin: 0; padding: 0; font-weight: normal; font-size: inherit; } md-grid-tile md-grid-tile-header.md-2-line, md-grid-tile md-grid-tile-footer.md-2-line { height: 68px; } md-grid-tile .md-grid-list-text { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; width: 100%; box-sizing: border-box; overflow: hidden; } md-grid-tile .md-grid-list-text > * { margin: 0; padding: 0; font-weight: normal; font-size: inherit; } md-grid-tile .md-grid-list-text:empty { display: none; } md-grid-tile md-grid-tile-header { top: 0; } md-grid-tile md-grid-tile-footer { bottom: 0; } md-grid-tile [md-grid-avatar] { padding-right: 16px; } [dir='rtl'] md-grid-tile [md-grid-avatar] { padding-right: 0; padding-left: 16px; } md-grid-tile [md-grid-avatar]:empty { display: none; } "],
            encapsulation: core_1.ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], MdGridTile);
    return MdGridTile;
}());
exports.MdGridTile = MdGridTile;
var MdGridTileText = (function () {
    function MdGridTileText(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
    }
    MdGridTileText.prototype.ngAfterContentInit = function () {
        this._lineSetter = new line_1.MdLineSetter(this._lines, this._renderer, this._element);
    };
    __decorate([
        core_1.ContentChildren(line_1.MdLine), 
        __metadata('design:type', core_1.QueryList)
    ], MdGridTileText.prototype, "_lines", void 0);
    MdGridTileText = __decorate([
        core_1.Component({            selector: 'md-grid-tile-header, md-grid-tile-footer',
            template: "<ng-content select=\"[md-grid-avatar]\"></ng-content> <div class=\"md-grid-list-text\"><ng-content select=\"[md-line]\"></ng-content></div> <ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], MdGridTileText);
    return MdGridTileText;
}());
exports.MdGridTileText = MdGridTileText;
//# sourceMappingURL=grid-tile.js.map
"use strict";
var grid_list_errors_1 = require('./grid-list-errors');
/**
 * Class for determining, from a list of tiles, the (row, col) position of each of those tiles
 * in the grid. This is necessary (rather than just rendering the tiles in normal document flow)
 * because the tiles can have a rowspan.
 *
 * The positioning algorithm greedily places each tile as soon as it encounters a gap in the grid
 * large enough to accommodate it so that the tiles still render in the same order in which they
 * are given.
 *
 * The basis of the algorithm is the use of an array to track the already placed tiles. Each
 * element of the array corresponds to a column, and the value indicates how many cells in that
 * column are already occupied; zero indicates an empty cell. Moving "down" to the next row
 * decrements each value in the tracking array (indicating that the column is one cell closer to
 * being free).
 */
var TileCoordinator = (function () {
    function TileCoordinator(numColumns, tiles) {
        var _this = this;
        /** Index at which the search for the next gap will start. */
        this.columnIndex = 0;
        /** The current row index. */
        this.rowIndex = 0;
        this.tracker = new Array(numColumns);
        this.tracker.fill(0, 0, this.tracker.length);
        this.positions = tiles.map(function (tile) { return _this._trackTile(tile); });
    }
    Object.defineProperty(TileCoordinator.prototype, "rowCount", {
        /** Gets the total number of rows occupied by tiles */
        get: function () { return this.rowIndex + 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TileCoordinator.prototype, "rowspan", {
        /** Gets the total span of rows occupied by tiles.
         * Ex: A list with 1 row that contains a tile with rowspan 2 will have a total rowspan of 2. */
        get: function () {
            var lastRowMax = Math.max.apply(Math, this.tracker);
            // if any of the tiles has a rowspan that pushes it beyond the total row count,
            // add the difference to the rowcount
            return lastRowMax > 1 ? this.rowCount + lastRowMax - 1 : this.rowCount;
        },
        enumerable: true,
        configurable: true
    });
    /** Calculates the row and col position of a tile. */
    TileCoordinator.prototype._trackTile = function (tile) {
        // Find a gap large enough for this tile.
        var gapStartIndex = this._findMatchingGap(tile.colspan);
        // Place tile in the resulting gap.
        this._markTilePosition(gapStartIndex, tile);
        // The next time we look for a gap, the search will start at columnIndex, which should be
        // immediately after the tile that has just been placed.
        this.columnIndex = gapStartIndex + tile.colspan;
        return new TilePosition(this.rowIndex, gapStartIndex);
    };
    /** Finds the next available space large enough to fit the tile. */
    TileCoordinator.prototype._findMatchingGap = function (tileCols) {
        if (tileCols > this.tracker.length) {
            throw new grid_list_errors_1.MdGridTileTooWideError(tileCols, this.tracker.length);
        }
        // Start index is inclusive, end index is exclusive.
        var gapStartIndex = -1;
        var gapEndIndex = -1;
        // Look for a gap large enough to fit the given tile. Empty spaces are marked with a zero.
        do {
            // If we've reached the end of the row, go to the next row.
            if (this.columnIndex + tileCols > this.tracker.length) {
                this._nextRow();
                continue;
            }
            gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
            // If there are no more empty spaces in this row at all, move on to the next row.
            if (gapStartIndex == -1) {
                this._nextRow();
                continue;
            }
            gapEndIndex = this._findGapEndIndex(gapStartIndex);
            // If a gap large enough isn't found, we want to start looking immediately after the current
            // gap on the next iteration.
            this.columnIndex = gapStartIndex + 1;
        } while (gapEndIndex - gapStartIndex < tileCols);
        return gapStartIndex;
    };
    /** Move "down" to the next row. */
    TileCoordinator.prototype._nextRow = function () {
        this.columnIndex = 0;
        this.rowIndex++;
        // Decrement all spaces by one to reflect moving down one row.
        for (var i = 0; i < this.tracker.length; i++) {
            this.tracker[i] = Math.max(0, this.tracker[i] - 1);
        }
    };
    /**
     * Finds the end index (exclusive) of a gap given the index from which to start looking.
     * The gap ends when a non-zero value is found.
     */
    TileCoordinator.prototype._findGapEndIndex = function (gapStartIndex) {
        for (var i = gapStartIndex + 1; i < this.tracker.length; i++) {
            if (this.tracker[i] != 0) {
                return i;
            }
        }
        // The gap ends with the end of the row.
        return this.tracker.length;
    };
    /** Update the tile tracker to account for the given tile in the given space. */
    TileCoordinator.prototype._markTilePosition = function (start, tile) {
        for (var i = 0; i < tile.colspan; i++) {
            this.tracker[start + i] = tile.rowspan;
        }
    };
    return TileCoordinator;
}());
exports.TileCoordinator = TileCoordinator;
/** Simple data structure for tile position (row, col). */
var TilePosition = (function () {
    function TilePosition(row, col) {
        this.row = row;
        this.col = col;
    }
    return TilePosition;
}());
exports.TilePosition = TilePosition;
//# sourceMappingURL=tile-coordinator.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var grid_list_errors_1 = require('./grid-list-errors');
/**
 * Sets the style properties for an individual tile, given the position calculated by the
 * Tile Coordinator.
 * TODO: internal
 */
var TileStyler = (function () {
    function TileStyler() {
        this._rows = 0;
        this._rowspan = 0;
    }
    /**
     * Adds grid-list layout info once it is available. Cannot be processed in the constructor
     * because these properties haven't been calculated by that point.
     */
    TileStyler.prototype.init = function (_gutterSize, tracker, cols, direction) {
        this._gutterSize = normalizeUnits(_gutterSize);
        this._rows = tracker.rowCount;
        this._rowspan = tracker.rowspan;
        this._cols = cols;
        this._direction = direction;
    };
    /**
     * Computes the amount of space a single 1x1 tile would take up (width or height).
     * Used as a basis for other calculations.
     * @param sizePercent Percent of the total grid-list space that one 1x1 tile would take up.
     * @param gutterFraction Fraction of the gutter size taken up by one 1x1 tile.
     * @return The size of a 1x1 tile as an expression that can be evaluated via CSS calc().
     */
    TileStyler.prototype.getBaseTileSize = function (sizePercent, gutterFraction) {
        // Take the base size percent (as would be if evenly dividing the size between cells),
        // and then subtracting the size of one gutter. However, since there are no gutters on the
        // edges, each tile only uses a fraction (gutterShare = numGutters / numCells) of the gutter
        // size. (Imagine having one gutter per tile, and then breaking up the extra gutter on the
        // edge evenly among the cells).
        return "(" + sizePercent + "% - ( " + this._gutterSize + " * " + gutterFraction + " ))";
    };
    /**
     * Gets The horizontal or vertical position of a tile, e.g., the 'top' or 'left' property value.
     * @param offset Number of tiles that have already been rendered in the row/column.
     * @param baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @return Position of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTilePosition = function (baseSize, offset) {
        // The position comes the size of a 1x1 tile plus gutter for each previous tile in the
        // row/column (offset).
        return calc("(" + baseSize + " + " + this._gutterSize + ") * " + offset);
    };
    /**
     * Gets the actual size of a tile, e.g., width or height, taking rowspan or colspan into account.
     * @param baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param span The tile's rowspan or colspan.
     * @return Size of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTileSize = function (baseSize, span) {
        return "(" + baseSize + " * " + span + ") + (" + (span - 1) + " * " + this._gutterSize + ")";
    };
    /** Gets the style properties to be applied to a tile for the given row and column index. */
    TileStyler.prototype.setStyle = function (tile, rowIndex, colIndex) {
        // Percent of the available horizontal space that one column takes up.
        var percentWidthPerTile = 100 / this._cols;
        // Fraction of the vertical gutter size that each column takes up.
        // For example, if there are 5 columns, each column uses 4/5 = 0.8 times the gutter width.
        var gutterWidthFractionPerTile = (this._cols - 1) / this._cols;
        this.setColStyles(tile, colIndex, percentWidthPerTile, gutterWidthFractionPerTile);
        this.setRowStyles(tile, rowIndex, percentWidthPerTile, gutterWidthFractionPerTile);
    };
    /** Sets the horizontal placement of the tile in the list. */
    TileStyler.prototype.setColStyles = function (tile, colIndex, percentWidth, gutterWidth) {
        // Base horizontal size of a column.
        var baseTileWidth = this.getBaseTileSize(percentWidth, gutterWidth);
        // The width and horizontal position of each tile is always calculated the same way, but the
        // height and vertical position depends on the rowMode.
        var side = this._direction === 'ltr' ? 'left' : 'right';
        tile._setStyle(side, this.getTilePosition(baseTileWidth, colIndex));
        tile._setStyle('width', calc(this.getTileSize(baseTileWidth, tile.colspan)));
    };
    /** Calculates the total size taken up by gutters across one axis of a list. */
    TileStyler.prototype.getGutterSpan = function () {
        return this._gutterSize + " * (" + this._rowspan + " - 1)";
    };
    /** Calculates the total size taken up by tiles across one axis of a list. */
    TileStyler.prototype.getTileSpan = function (tileHeight) {
        return this._rowspan + " * " + this.getTileSize(tileHeight, 1);
    };
    /**
     * Sets the vertical placement of the tile in the list.
     * This method will be implemented by each type of TileStyler.
     */
    TileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) { };
    /**
     * Calculates the computed height and returns the correct style property to set.
     * This method will be implemented by each type of TileStyler.
     */
    TileStyler.prototype.getComputedHeight = function () { return null; };
    return TileStyler;
}());
exports.TileStyler = TileStyler;
/**
 * This type of styler is instantiated when the user passes in a fixed row height.
 * Example <md-grid-list cols="3" rowHeight="100px">
 * TODO: internal
 */
var FixedTileStyler = (function (_super) {
    __extends(FixedTileStyler, _super);
    function FixedTileStyler(fixedRowHeight) {
        _super.call(this);
        this.fixedRowHeight = fixedRowHeight;
    }
    FixedTileStyler.prototype.init = function (gutterSize, tracker, cols, direction) {
        _super.prototype.init.call(this, gutterSize, tracker, cols, direction);
        this.fixedRowHeight = normalizeUnits(this.fixedRowHeight);
    };
    FixedTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        tile._setStyle('top', this.getTilePosition(this.fixedRowHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(this.fixedRowHeight, tile.rowspan)));
    };
    FixedTileStyler.prototype.getComputedHeight = function () {
        return [
            'height', calc(this.getTileSpan(this.fixedRowHeight) + " + " + this.getGutterSpan())
        ];
    };
    return FixedTileStyler;
}(TileStyler));
exports.FixedTileStyler = FixedTileStyler;
/**
 * This type of styler is instantiated when the user passes in a width:height ratio
 * for the row height.  Example <md-grid-list cols="3" rowHeight="3:1">
 * TODO: internal
 */
var RatioTileStyler = (function (_super) {
    __extends(RatioTileStyler, _super);
    function RatioTileStyler(value) {
        _super.call(this);
        this._parseRatio(value);
    }
    RatioTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        var percentHeightPerTile = percentWidth / this.rowHeightRatio;
        this.baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterWidth);
        // Use paddingTop and marginTop to maintain the given aspect ratio, as
        // a percentage-based value for these properties is applied versus the *width* of the
        // containing block. See http://www.w3.org/TR/CSS2/box.html#margin-properties
        tile._setStyle('marginTop', this.getTilePosition(this.baseTileHeight, rowIndex));
        tile._setStyle('paddingTop', calc(this.getTileSize(this.baseTileHeight, tile.rowspan)));
    };
    RatioTileStyler.prototype.getComputedHeight = function () {
        return [
            'paddingBottom', calc(this.getTileSpan(this.baseTileHeight) + " + " + this.getGutterSpan())
        ];
    };
    RatioTileStyler.prototype._parseRatio = function (value) {
        var ratioParts = value.split(':');
        if (ratioParts.length !== 2) {
            throw new grid_list_errors_1.MdGridListBadRatioError(value);
        }
        this.rowHeightRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
    };
    return RatioTileStyler;
}(TileStyler));
exports.RatioTileStyler = RatioTileStyler;
/*  This type of styler is instantiated when the user selects a "fit" row height mode.
 *  In other words, the row height will reflect the total height of the container divided
 *  by the number of rows.  Example <md-grid-list cols="3" rowHeight="fit"> */
var FitTileStyler = (function (_super) {
    __extends(FitTileStyler, _super);
    function FitTileStyler() {
        _super.apply(this, arguments);
    }
    FitTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        // Percent of the available vertical space that one row takes up.
        var percentHeightPerTile = 100 / this._rowspan;
        // Fraction of the horizontal gutter size that each column takes up.
        var gutterHeightPerTile = (this._rows - 1) / this._rows;
        // Base vertical size of a column.
        var baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterHeightPerTile);
        tile._setStyle('top', this.getTilePosition(baseTileHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(baseTileHeight, tile.rowspan)));
    };
    return FitTileStyler;
}(TileStyler));
exports.FitTileStyler = FitTileStyler;
/** Wraps a CSS string in a calc function */
function calc(exp) { return "calc(" + exp + ")"; }
/** Appends pixels to a CSS string if no units are given. */
function normalizeUnits(value) {
    return (value.match(/px|em|rem/)) ? value : value + 'px';
}
//# sourceMappingURL=tile-styler.js.map
"use strict";
var http_1 = require('@angular/http');
/**
 * Fake URLs and associated SVG documents used by tests.
 */
var FAKE_SVGS = (function () {
    var svgs = new Map();
    svgs.set('cat.svg', '<svg><path id="meow"></path></svg>');
    svgs.set('dog.svg', '<svg><path id="woof"></path></svg>');
    svgs.set('farm-set-1.svg', "\n      <svg>\n        <defs>\n          <g id=\"pig\"><path id=\"oink\"></path></g>\n          <g id=\"cow\"><path id=\"moo\"></path></g>\n        </defs>\n      </svg>\n  ");
    svgs.set('farm-set-2.svg', "\n      <svg>\n        <defs>\n          <g id=\"cow\"><path id=\"moo moo\"></path></g>\n          <g id=\"sheep\"><path id=\"baa\"></path></g>\n        </defs>\n      </svg>\n  ");
    svgs.set('arrow-set.svg', "\n      <svg>\n        <defs>\n          <svg id=\"left-arrow\"><path id=\"left\"></path></svg>\n          <svg id=\"right-arrow\"><path id=\"right\"></path></svg>\n        </defs>\n      </svg>\n  ");
    return svgs;
})();
/**
 * Returns an HTTP response for a fake SVG URL.
 */
function getFakeSvgHttpResponse(url) {
    if (FAKE_SVGS.has(url)) {
        return new http_1.Response(new http_1.ResponseOptions({
            status: 200,
            body: FAKE_SVGS.get(url),
        }));
    }
    else {
        return new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
    }
}
exports.getFakeSvgHttpResponse = getFakeSvgHttpResponse;
//# sourceMappingURL=fake-svgs.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var error_1 = require('@angular2-material/core/errors/error');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/observable/forkJoin');
require('rxjs/add/observable/of');
require('rxjs/add/operator/map');
require('rxjs/add/operator/filter');
require('rxjs/add/operator/do');
require('rxjs/add/operator/share');
require('rxjs/add/operator/finally');
require('rxjs/add/operator/catch');
/** Exception thrown when attempting to load an icon with a name that cannot be found. */
var MdIconNameNotFoundError = (function (_super) {
    __extends(MdIconNameNotFoundError, _super);
    function MdIconNameNotFoundError(iconName) {
        _super.call(this, "Unable to find icon with the name \"" + iconName + "\"");
    }
    return MdIconNameNotFoundError;
}(error_1.MdError));
exports.MdIconNameNotFoundError = MdIconNameNotFoundError;
/**
 * Exception thrown when attempting to load SVG content that does not contain the expected
 * <svg> tag.
 */
var MdIconSvgTagNotFoundError = (function (_super) {
    __extends(MdIconSvgTagNotFoundError, _super);
    function MdIconSvgTagNotFoundError() {
        _super.call(this, '<svg> tag not found');
    }
    return MdIconSvgTagNotFoundError;
}(error_1.MdError));
exports.MdIconSvgTagNotFoundError = MdIconSvgTagNotFoundError;
/** Configuration for an icon, including the URL and possibly the cached SVG element. */
var SvgIconConfig = (function () {
    function SvgIconConfig(url) {
        this.url = url;
        this.svgElement = null;
    }
    return SvgIconConfig;
}());
/** Returns the cache key to use for an icon namespace and name. */
var iconKey = function (namespace, name) { return namespace + ':' + name; };
/**
 * Service to register and display icons used by the <md-icon> component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Registers aliases for CSS classes, for use with icon fonts.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
var MdIconRegistry = (function () {
    function MdIconRegistry(_http) {
        this._http = _http;
        /**
         * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
         */
        this._svgIconConfigs = new Map();
        /**
         * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
         * Multiple icon sets can be registered under the same namespace.
         */
        this._iconSetConfigs = new Map();
        /** Cache for icons loaded by direct URLs. */
        this._cachedIconsByUrl = new Map();
        /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
        this._inProgressUrlFetches = new Map();
        /** Map from font identifiers to their CSS class names. Used for icon fonts. */
        this._fontCssClassesByAlias = new Map();
        /**
         * The CSS class to apply when an <md-icon> component has no icon name, url, or font specified.
         * The default 'material-icons' value assumes that the material icon font has been loaded as
         * described at http://google.github.io/material-design-icons/#icon-font-for-the-web
         */
        this._defaultFontSetClass = 'material-icons';
    }
    /** Registers an icon by URL in the default namespace. */
    MdIconRegistry.prototype.addSvgIcon = function (iconName, url) {
        return this.addSvgIconInNamespace('', iconName, url);
    };
    /** Registers an icon by URL in the specified namespace. */
    MdIconRegistry.prototype.addSvgIconInNamespace = function (namespace, iconName, url) {
        var key = iconKey(namespace, iconName);
        this._svgIconConfigs.set(key, new SvgIconConfig(url));
        return this;
    };
    /** Registers an icon set by URL in the default namespace. */
    MdIconRegistry.prototype.addSvgIconSet = function (url) {
        return this.addSvgIconSetInNamespace('', url);
    };
    /** Registers an icon set by URL in the specified namespace. */
    MdIconRegistry.prototype.addSvgIconSetInNamespace = function (namespace, url) {
        var config = new SvgIconConfig(url);
        if (this._iconSetConfigs.has(namespace)) {
            this._iconSetConfigs.get(namespace).push(config);
        }
        else {
            this._iconSetConfigs.set(namespace, [config]);
        }
        return this;
    };
    /**
     * Defines an alias for a CSS class name to be used for icon fonts. Creating an mdIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the <md-icon> element.
     */
    MdIconRegistry.prototype.registerFontClassAlias = function (alias, className) {
        if (className === void 0) { className = alias; }
        this._fontCssClassesByAlias.set(alias, className);
        return this;
    };
    /**
     * Returns the CSS class name associated with the alias by a previous call to
     * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
     */
    MdIconRegistry.prototype.classNameForFontAlias = function (alias) {
        return this._fontCssClassesByAlias.get(alias) || alias;
    };
    /**
     * Sets the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    MdIconRegistry.prototype.setDefaultFontSetClass = function (className) {
        this._defaultFontSetClass = className;
        return this;
    };
    /**
     * Returns the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    MdIconRegistry.prototype.getDefaultFontSetClass = function () {
        return this._defaultFontSetClass;
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) from the given URL.
     * The response from the URL may be cached so this will not always cause an HTTP request, but
     * the produced element will always be a new copy of the originally fetched icon. (That is,
     * it will not contain any modifications made to elements previously returned).
     */
    MdIconRegistry.prototype.getSvgIconFromUrl = function (url) {
        var _this = this;
        if (this._cachedIconsByUrl.has(url)) {
            return Observable_1.Observable.of(cloneSvg(this._cachedIconsByUrl.get(url)));
        }
        return this._loadSvgIconFromConfig(new SvgIconConfig(url))
            .do(function (svg) { return _this._cachedIconsByUrl.set(url, svg); })
            .map(function (svg) { return cloneSvg(svg); });
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) with the given name
     * and namespace. The icon must have been previously registered with addIcon or addIconSet;
     * if not, the Observable will throw an MdIconNameNotFoundError.
     */
    MdIconRegistry.prototype.getNamedSvgIcon = function (name, namespace) {
        if (namespace === void 0) { namespace = ''; }
        // Return (copy of) cached icon if possible.
        var key = iconKey(namespace, name);
        if (this._svgIconConfigs.has(key)) {
            return this._getSvgFromConfig(this._svgIconConfigs.get(key));
        }
        // See if we have any icon sets registered for the namespace.
        var iconSetConfigs = this._iconSetConfigs.get(namespace);
        if (iconSetConfigs) {
            return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
        }
        return Observable_1.Observable.throw(new MdIconNameNotFoundError(key));
    };
    /**
     * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
     */
    MdIconRegistry.prototype._getSvgFromConfig = function (config) {
        if (config.svgElement) {
            // We already have the SVG element for this icon, return a copy.
            return Observable_1.Observable.of(cloneSvg(config.svgElement));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return this._loadSvgIconFromConfig(config)
                .do(function (svg) { return config.svgElement = svg; })
                .map(function (svg) { return cloneSvg(svg); });
        }
    };
    /**
     * Attempts to find an icon with the specified name in any of the SVG icon sets.
     * First searches the available cached icons for a nested element with a matching name, and
     * if found copies the element to a new <svg> element. If not found, fetches all icon sets
     * that have not been cached, and searches again after all fetches are completed.
     * The returned Observable produces the SVG element if possible, and throws
     * MdIconNameNotFoundError if no icon with the specified name can be found.
     */
    MdIconRegistry.prototype._getSvgFromIconSetConfigs = function (name, iconSetConfigs) {
        var _this = this;
        // For all the icon set SVG elements we've fetched, see if any contain an icon with the
        // requested name.
        var namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (namedIcon) {
            // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
            // time anyway, there's probably not much advantage compared to just always extracting
            // it from the icon set.
            return Observable_1.Observable.of(namedIcon);
        }
        // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
        // fetched, fetch them now and look for iconName in the results.
        var iconSetFetchRequests = iconSetConfigs
            .filter(function (iconSetConfig) { return !iconSetConfig.svgElement; })
            .map(function (iconSetConfig) {
            return _this._loadSvgIconSetFromConfig(iconSetConfig)
                .catch(function (err, caught) {
                // Swallow errors fetching individual URLs so the combined Observable won't
                // necessarily fail.
                console.log("Loading icon set URL: " + iconSetConfig.url + " failed: " + err);
                return Observable_1.Observable.of(null);
            })
                .do(function (svg) {
                // Cache SVG element.
                if (svg) {
                    iconSetConfig.svgElement = svg;
                }
            });
        });
        // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
        // cached SVG element (unless the request failed), and we can check again for the icon.
        return Observable_1.Observable.forkJoin(iconSetFetchRequests)
            .map(function (ignoredResults) {
            var foundIcon = _this._extractIconWithNameFromAnySet(name, iconSetConfigs);
            if (!foundIcon) {
                throw new MdIconNameNotFoundError(name);
            }
            return foundIcon;
        });
    };
    /**
     * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    MdIconRegistry.prototype._extractIconWithNameFromAnySet = function (iconName, iconSetConfigs) {
        // Iterate backwards, so icon sets added later have precedence.
        for (var i = iconSetConfigs.length - 1; i >= 0; i--) {
            var config = iconSetConfigs[i];
            if (config.svgElement) {
                var foundIcon = this._extractSvgIconFromSet(config.svgElement, iconName, config);
                if (foundIcon) {
                    return foundIcon;
                }
            }
        }
        return null;
    };
    /**
     * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    MdIconRegistry.prototype._loadSvgIconFromConfig = function (config) {
        var _this = this;
        return this._fetchUrl(config.url)
            .map(function (svgText) { return _this._createSvgElementForSingleIcon(svgText, config); });
    };
    /**
     * Loads the content of the icon set URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    MdIconRegistry.prototype._loadSvgIconSetFromConfig = function (config) {
        var _this = this;
        // TODO: Document that icons should only be loaded from trusted sources.
        return this._fetchUrl(config.url)
            .map(function (svgText) { return _this._svgElementFromString(svgText); });
    };
    /**
     * Creates a DOM element from the given SVG string, and adds default attributes.
     */
    MdIconRegistry.prototype._createSvgElementForSingleIcon = function (responseText, config) {
        var svg = this._svgElementFromString(responseText);
        this._setSvgAttributes(svg, config);
        return svg;
    };
    /**
     * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    MdIconRegistry.prototype._extractSvgIconFromSet = function (iconSet, iconName, config) {
        var iconNode = iconSet.querySelector('#' + iconName);
        if (!iconNode) {
            return null;
        }
        // If the icon node is itself an <svg> node, clone and return it directly. If not, set it as
        // the content of a new <svg> node.
        if (iconNode.tagName.toLowerCase() == 'svg') {
            return this._setSvgAttributes(iconNode.cloneNode(true), config);
        }
        // createElement('SVG') doesn't work as expected; the DOM ends up with
        // the correct nodes, but the SVG content doesn't render. Instead we
        // have to create an empty SVG node using innerHTML and append its content.
        // Elements created using DOMParser.parseFromString have the same problem.
        // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
        var svg = this._svgElementFromString('<svg></svg>');
        // Clone the node so we don't remove it from the parent icon set element.
        svg.appendChild(iconNode.cloneNode(true));
        return this._setSvgAttributes(svg, config);
    };
    /**
     * Creates a DOM element from the given SVG string.
     */
    MdIconRegistry.prototype._svgElementFromString = function (str) {
        // TODO: Is there a better way than innerHTML? Renderer doesn't appear to have a method for
        // creating an element from an HTML string.
        var div = document.createElement('DIV');
        div.innerHTML = str;
        var svg = div.querySelector('svg');
        if (!svg) {
            throw new MdIconSvgTagNotFoundError();
        }
        return svg;
    };
    /**
     * Sets the default attributes for an SVG element to be used as an icon.
     */
    MdIconRegistry.prototype._setSvgAttributes = function (svg, config) {
        if (!svg.getAttribute('xmlns')) {
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        svg.setAttribute('fit', '');
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
        return svg;
    };
    /**
     * Returns an Observable which produces the string contents of the given URL. Results may be
     * cached, so future calls with the same URL may not cause another HTTP request.
     */
    MdIconRegistry.prototype._fetchUrl = function (url) {
        var _this = this;
        // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
        // already a request in progress for that URL. It's necessary to call share() on the
        // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
        if (this._inProgressUrlFetches.has(url)) {
            return this._inProgressUrlFetches.get(url);
        }
        // TODO(jelbourn): for some reason, the `finally` operator "loses" the generic type on the
        // Observable. Figure out why and fix it.
        var req = this._http.get(url)
            .map(function (response) { return response.text(); })
            .finally(function () {
            _this._inProgressUrlFetches.delete(url);
        })
            .share();
        this._inProgressUrlFetches.set(url, req);
        return req;
    };
    MdIconRegistry = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MdIconRegistry);
    return MdIconRegistry;
}());
exports.MdIconRegistry = MdIconRegistry;
/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg) {
    return svg.cloneNode(true);
}
//# sourceMappingURL=icon-registry.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var error_1 = require('@angular2-material/core/errors/error');
var icon_registry_1 = require('./icon-registry');
var icon_registry_2 = require('./icon-registry');
exports.MdIconRegistry = icon_registry_2.MdIconRegistry;
/** Exception thrown when an invalid icon name is passed to an md-icon component. */
var MdIconInvalidNameError = (function (_super) {
    __extends(MdIconInvalidNameError, _super);
    function MdIconInvalidNameError(iconName) {
        _super.call(this, "Invalid icon name: \"" + iconName + "\"");
    }
    return MdIconInvalidNameError;
}(error_1.MdError));
exports.MdIconInvalidNameError = MdIconInvalidNameError;
/**
 * Component to display an icon. It can be used in the following ways:
 * - Specify the svgSrc input to load an SVG icon from a URL. The SVG content is directly inlined
 *   as a child of the <md-icon> component, so that CSS styles can easily be applied to it.
 *   The URL is loaded via an XMLHttpRequest, so it must be on the same domain as the page or its
 *   server must be configured to allow cross-domain requests.
 *   Example:
 *     <md-icon svgSrc="assets/arrow.svg"></md-icon>
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MdIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     <md-icon svgIcon="left-arrow"></md-icon>
 *     <md-icon svgIcon="animals:cat"></md-icon>
 *
 * - Use a font ligature as an icon by putting the ligature text in the content of the <md-icon>
 *   component. By default the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MdIconRegistry.registerFontClassAlias.
 *   Examples:
 *     <md-icon>home</md-icon>
 *     <md-icon fontSet="myfont">sun</md-icon>
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     <md-icon fontSet="fa" fontIcon="alarm"></md-icon>
 */
var MdIcon = (function () {
    function MdIcon(_element, _renderer, _mdIconRegistry) {
        this._element = _element;
        this._renderer = _renderer;
        this._mdIconRegistry = _mdIconRegistry;
        this.hostAriaLabel = '';
    }
    /**
     * Splits an svgIcon binding value into its icon set and icon name components.
     * Returns a 2-element array of [(icon set), (icon name)].
     * The separator for the two fields is ':'. If there is no separator, an empty
     * string is returned for the icon set and the entire value is returned for
     * the icon name. If the argument is falsy, returns an array of two empty strings.
     * Throws a MdIconInvalidNameError if the name contains two or more ':' separators.
     * Examples:
     *   'social:cake' -> ['social', 'cake']
     *   'penguin' -> ['', 'penguin']
     *   null -> ['', '']
     *   'a:b:c' -> (throws MdIconInvalidNameError)
     */
    MdIcon.prototype._splitIconName = function (iconName) {
        if (!iconName) {
            return ['', ''];
        }
        var parts = iconName.split(':');
        switch (parts.length) {
            case 1:
                // Use default namespace.
                return ['', parts[0]];
            case 2:
                return parts;
            default:
                throw new MdIconInvalidNameError(iconName);
        }
    };
    /** TODO: internal */
    MdIcon.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var changedInputs = Object.keys(changes);
        // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
        if (changedInputs.indexOf('svgIcon') != -1 || changedInputs.indexOf('svgSrc') != -1) {
            if (this.svgIcon) {
                var _a = this._splitIconName(this.svgIcon), namespace = _a[0], iconName = _a[1];
                this._mdIconRegistry.getNamedSvgIcon(iconName, namespace).subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) { return console.log("Error retrieving icon: " + err); });
            }
            else if (this.svgSrc) {
                this._mdIconRegistry.getSvgIconFromUrl(this.svgSrc).subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) { return console.log("Error retrieving icon: " + err); });
            }
        }
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
        this._updateAriaLabel();
    };
    /** TODO: internal */
    MdIcon.prototype.ngOnInit = function () {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <md-icon>arrow</md-icon>. In this case we need to add a CSS class for the default font.
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    /** TODO: internal */
    MdIcon.prototype.ngAfterViewChecked = function () {
        // Update aria label here because it may depend on the projected text content.
        // (e.g. <md-icon>home</md-icon> should use 'home').
        this._updateAriaLabel();
    };
    MdIcon.prototype._updateAriaLabel = function () {
        var ariaLabel = this._getAriaLabel();
        if (ariaLabel) {
            this._renderer.setElementAttribute(this._element.nativeElement, 'aria-label', ariaLabel);
        }
    };
    MdIcon.prototype._getAriaLabel = function () {
        // If the parent provided an aria-label attribute value, use it as-is. Otherwise look for a
        // reasonable value from the alt attribute, font icon name, SVG icon name, or (for ligatures)
        // the text content of the directive.
        var label = this.hostAriaLabel ||
            this.alt ||
            this.fontIcon ||
            this._splitIconName(this.svgIcon)[1];
        if (label) {
            return label;
        }
        // The "content" of an SVG icon is not a useful label.
        if (this._usingFontIcon()) {
            var text = this._element.nativeElement.textContent;
            if (text) {
                return text;
            }
        }
        // TODO: Warn here in dev mode.
        return null;
    };
    MdIcon.prototype._usingFontIcon = function () {
        return !(this.svgIcon || this.svgSrc);
    };
    MdIcon.prototype._setSvgElement = function (svg) {
        var layoutElement = this._element.nativeElement;
        // Remove existing child nodes and add the new SVG element.
        // We would use renderer.detachView(Array.from(layoutElement.childNodes)) here,
        // but it fails in IE11: https://github.com/angular/angular/issues/6327
        layoutElement.innerHTML = '';
        this._renderer.projectNodes(layoutElement, [svg]);
    };
    MdIcon.prototype._updateFontIconClasses = function () {
        if (!this._usingFontIcon()) {
            return;
        }
        var elem = this._element.nativeElement;
        var fontSetClass = this.fontSet ?
            this._mdIconRegistry.classNameForFontAlias(this.fontSet) :
            this._mdIconRegistry.getDefaultFontSetClass();
        if (fontSetClass != this._previousFontSetClass) {
            if (this._previousFontSetClass) {
                this._renderer.setElementClass(elem, this._previousFontSetClass, false);
            }
            if (fontSetClass) {
                this._renderer.setElementClass(elem, fontSetClass, true);
            }
            this._previousFontSetClass = fontSetClass;
        }
        if (this.fontIcon != this._previousFontIconClass) {
            if (this._previousFontIconClass) {
                this._renderer.setElementClass(elem, this._previousFontIconClass, false);
            }
            if (this.fontIcon) {
                this._renderer.setElementClass(elem, this.fontIcon, true);
            }
            this._previousFontIconClass = this.fontIcon;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "svgSrc", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "svgIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "fontSet", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "fontIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "alt", void 0);
    __decorate([
        core_1.Input('aria-label'), 
        __metadata('design:type', String)
    ], MdIcon.prototype, "hostAriaLabel", void 0);
    MdIcon = __decorate([
        core_1.Component({            template: '<ng-content></ng-content>',
            selector: 'md-icon',
            styles: ["/** The width/height of the icon element. */ /** This works because we're using ViewEncapsulation.None. If we used the default encapsulation, the selector would need to be \":host\". */ md-icon { background-repeat: no-repeat; display: inline-block; fill: currentColor; height: 24px; width: 24px; } "],
            host: {
                'role': 'img',
            },
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, icon_registry_1.MdIconRegistry])
    ], MdIcon);
    return MdIcon;
}());
exports.MdIcon = MdIcon;
/** @deprecated */
exports.MD_ICON_DIRECTIVES = [MdIcon];
var MdIconModule = (function () {
    function MdIconModule() {
    }
    MdIconModule = __decorate([
        core_1.NgModule({
            imports: [http_1.HttpModule],
            exports: exports.MD_ICON_DIRECTIVES,
            declarations: exports.MD_ICON_DIRECTIVES,
            providers: [icon_registry_1.MdIconRegistry],
        }), 
        __metadata('design:paramtypes', [])
    ], MdIconModule);
    return MdIconModule;
}());
exports.MdIconModule = MdIconModule;
//# sourceMappingURL=icon.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var common_1 = require('@angular/common');
var field_value_1 = require('@angular2-material/core/annotations/field-value');
var error_1 = require('@angular2-material/core/errors/error');
var Observable_1 = require('rxjs/Observable');
var noop = function () { };
exports.MD_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MdInput; }),
    multi: true
};
// Invalid input type. Using one of these will throw an MdInputUnsupportedTypeError.
var MD_INPUT_INVALID_INPUT_TYPE = [
    'file',
    'radio',
    'checkbox',
];
var nextUniqueId = 0;
var MdInputPlaceholderConflictError = (function (_super) {
    __extends(MdInputPlaceholderConflictError, _super);
    function MdInputPlaceholderConflictError() {
        _super.call(this, 'Placeholder attribute and child element were both specified.');
    }
    return MdInputPlaceholderConflictError;
}(error_1.MdError));
exports.MdInputPlaceholderConflictError = MdInputPlaceholderConflictError;
var MdInputUnsupportedTypeError = (function (_super) {
    __extends(MdInputUnsupportedTypeError, _super);
    function MdInputUnsupportedTypeError(type) {
        _super.call(this, "Input type \"" + type + "\" isn't supported by md-input.");
    }
    return MdInputUnsupportedTypeError;
}(error_1.MdError));
exports.MdInputUnsupportedTypeError = MdInputUnsupportedTypeError;
var MdInputDuplicatedHintError = (function (_super) {
    __extends(MdInputDuplicatedHintError, _super);
    function MdInputDuplicatedHintError(align) {
        _super.call(this, "A hint was already declared for 'align=\"" + align + "\"'.");
    }
    return MdInputDuplicatedHintError;
}(error_1.MdError));
exports.MdInputDuplicatedHintError = MdInputDuplicatedHintError;
/**
 * The placeholder directive. The content can declare this to implement more
 * complex placeholders.
 */
var MdPlaceholder = (function () {
    function MdPlaceholder() {
    }
    MdPlaceholder = __decorate([
        core_1.Directive({
            selector: 'md-placeholder'
        }), 
        __metadata('design:paramtypes', [])
    ], MdPlaceholder);
    return MdPlaceholder;
}());
exports.MdPlaceholder = MdPlaceholder;
/** The hint directive, used to tag content as hint labels (going under the input). */
var MdHint = (function () {
    function MdHint() {
        // Whether to align the hint label at the start or end of the line.
        this.align = 'start';
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdHint.prototype, "align", void 0);
    MdHint = __decorate([
        core_1.Directive({
            selector: 'md-hint',
            host: {
                '[class.md-right]': 'align == "end"',
                '[class.md-hint]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdHint);
    return MdHint;
}());
exports.MdHint = MdHint;
/**
 * Component that represents a text input. It encapsulates the <input> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 */
var MdInput = (function () {
    function MdInput() {
        this._focused = false;
        this._value = '';
        /** Callback registered via registerOnTouched (ControlValueAccessor) */
        this._onTouchedCallback = noop;
        /** Callback registered via registerOnChange (ControlValueAccessor) */
        this._onChangeCallback = noop;
        /**
         * Bindings.
         */
        this.align = 'start';
        this.dividerColor = 'primary';
        this.floatingPlaceholder = true;
        this.hintLabel = '';
        this.autoFocus = false;
        this.disabled = false;
        this.id = "md-input-" + nextUniqueId++;
        this.list = null;
        this.max = null;
        this.maxLength = null;
        this.min = null;
        this.minLength = null;
        this.placeholder = null;
        this.readOnly = false;
        this.required = false;
        this.spellCheck = false;
        this.step = null;
        this.tabIndex = null;
        this.type = 'text';
        this.name = null;
        this._blurEmitter = new core_1.EventEmitter();
        this._focusEmitter = new core_1.EventEmitter();
    }
    Object.defineProperty(MdInput.prototype, "focused", {
        /** Readonly properties. */
        get: function () { return this._focused; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "empty", {
        get: function () { return this._value == null || this._value === ''; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "characterCount", {
        get: function () {
            return this.empty ? 0 : ('' + this._value).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "inputId", {
        get: function () { return this.id + "-input"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "onBlur", {
        get: function () {
            return this._blurEmitter.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "onFocus", {
        get: function () {
            return this._focusEmitter.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "value", {
        get: function () { return this._value; },
        set: function (v) {
            v = this._convertValueForInputType(v);
            if (v !== this._value) {
                this._value = v;
                this._onChangeCallback(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdInput.prototype, "_align", {
        // This is to remove the `align` property of the `md-input` itself. Otherwise HTML5
        // might place it as RTL when we don't want to. We still want to use `align` as an
        // Input though, so we use HostBinding.
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    /** Set focus on input */
    MdInput.prototype.focus = function () {
        this._inputElement.nativeElement.focus();
    };
    MdInput.prototype._handleFocus = function (event) {
        this._focused = true;
        this._focusEmitter.emit(event);
    };
    MdInput.prototype._handleBlur = function (event) {
        this._focused = false;
        this._onTouchedCallback();
        this._blurEmitter.emit(event);
    };
    MdInput.prototype._handleChange = function (event) {
        this.value = event.target.value;
        this._onTouchedCallback();
    };
    MdInput.prototype._hasPlaceholder = function () {
        return !!this.placeholder || this._placeholderChild != null;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdInput.prototype.writeValue = function (value) {
        this._value = value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdInput.prototype.registerOnChange = function (fn) {
        this._onChangeCallback = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdInput.prototype.registerOnTouched = function (fn) {
        this._onTouchedCallback = fn;
    };
    /** TODO: internal */
    MdInput.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._validateConstraints();
        // Trigger validation when the hint children change.
        this._hintChildren.changes.subscribe(function () {
            _this._validateConstraints();
        });
    };
    /** TODO: internal */
    MdInput.prototype.ngOnChanges = function (changes) {
        this._validateConstraints();
    };
    /**
     * Convert the value passed in to a value that is expected from the type of the md-input.
     * This is normally performed by the *_VALUE_ACCESSOR in forms, but since the type is bound
     * on our internal input it won't work locally.
     * @private
     */
    MdInput.prototype._convertValueForInputType = function (v) {
        switch (this.type) {
            case 'number': return parseFloat(v);
            default: return v;
        }
    };
    /**
     * Ensure that all constraints defined by the API are validated, or throw errors otherwise.
     * Constraints for now:
     *   - placeholder attribute and <md-placeholder> are mutually exclusive.
     *   - type attribute is not one of the forbidden types (see constant at the top).
     *   - Maximum one of each `<md-hint>` alignment specified, with the attribute being
     *     considered as align="start".
     * @private
     */
    MdInput.prototype._validateConstraints = function () {
        var _this = this;
        if (this.placeholder != '' && this.placeholder != null && this._placeholderChild != null) {
            throw new MdInputPlaceholderConflictError();
        }
        if (MD_INPUT_INVALID_INPUT_TYPE.indexOf(this.type) != -1) {
            throw new MdInputUnsupportedTypeError(this.type);
        }
        if (this._hintChildren) {
            // Validate the hint labels.
            var startHint_1 = null;
            var endHint_1 = null;
            this._hintChildren.forEach(function (hint) {
                if (hint.align == 'start') {
                    if (startHint_1 || _this.hintLabel) {
                        throw new MdInputDuplicatedHintError('start');
                    }
                    startHint_1 = hint;
                }
                else if (hint.align == 'end') {
                    if (endHint_1) {
                        throw new MdInputDuplicatedHintError('end');
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    __decorate([
        core_1.Input('aria-label'), 
        __metadata('design:type', String)
    ], MdInput.prototype, "ariaLabel", void 0);
    __decorate([
        core_1.Input('aria-labelledby'), 
        __metadata('design:type', String)
    ], MdInput.prototype, "ariaLabelledBy", void 0);
    __decorate([
        core_1.Input('aria-disabled'),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "ariaDisabled", void 0);
    __decorate([
        core_1.Input('aria-required'),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "ariaRequired", void 0);
    __decorate([
        core_1.Input('aria-invalid'),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "ariaInvalid", void 0);
    __decorate([
        core_1.ContentChild(MdPlaceholder), 
        __metadata('design:type', MdPlaceholder)
    ], MdInput.prototype, "_placeholderChild", void 0);
    __decorate([
        core_1.ContentChildren(MdHint), 
        __metadata('design:type', core_1.QueryList)
    ], MdInput.prototype, "_hintChildren", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdInput.prototype, "align", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdInput.prototype, "dividerColor", void 0);
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "floatingPlaceholder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "hintLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "autoComplete", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "autoCorrect", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "autoCapitalize", void 0);
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "autoFocus", void 0);
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "list", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdInput.prototype, "max", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MdInput.prototype, "maxLength", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdInput.prototype, "min", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MdInput.prototype, "minLength", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "readOnly", void 0);
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "required", void 0);
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdInput.prototype, "spellCheck", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MdInput.prototype, "step", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MdInput.prototype, "tabIndex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "type", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdInput.prototype, "name", void 0);
    __decorate([
        core_1.Output('blur'), 
        __metadata('design:type', Observable_1.Observable)
    ], MdInput.prototype, "onBlur", null);
    __decorate([
        core_1.Output('focus'), 
        __metadata('design:type', Observable_1.Observable)
    ], MdInput.prototype, "onFocus", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdInput.prototype, "value", null);
    __decorate([
        core_1.HostBinding('attr.align'), 
        __metadata('design:type', Object)
    ], MdInput.prototype, "_align", null);
    __decorate([
        core_1.ViewChild('input'), 
        __metadata('design:type', core_1.ElementRef)
    ], MdInput.prototype, "_inputElement", void 0);
    MdInput = __decorate([
        core_1.Component({            selector: 'md-input',
            template: "<div class=\"md-input-wrapper\"> <div class=\"md-input-table\"> <div class=\"md-input-prefix\"><ng-content select=\"[md-prefix]\"></ng-content></div> <div class=\"md-input-infix\"> <input #input aria-target class=\"md-input-element\" [class.md-end]=\"align == 'end'\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledBy\" [attr.aria-disabled]=\"ariaDisabled\" [attr.aria-required]=\"ariaRequired\" [attr.aria-invalid]=\"ariaInvalid\" [attr.autocomplete]=\"autoComplete\" [attr.autocorrect]=\"autoCorrect\" [attr.autocapitalize]=\"autoCapitalize\" [autofocus]=\"autoFocus\" [disabled]=\"disabled\" [id]=\"inputId\" [attr.list]=\"list\" [attr.max]=\"max\" [attr.maxlength]=\"maxLength\" [attr.min]=\"min\" [attr.minlength]=\"minLength\" [readonly]=\"readOnly\" [required]=\"required\" [spellcheck]=\"spellCheck\" [attr.step]=\"step\" [attr.tabindex]=\"tabIndex\" [type]=\"type\" [attr.name]=\"name\" (focus)=\"_handleFocus($event)\" (blur)=\"_handleBlur($event)\" [(ngModel)]=\"value\" (change)=\"_handleChange($event)\"> <label class=\"md-input-placeholder\" [attr.for]=\"inputId\" [class.md-empty]=\"empty\" [class.md-focused]=\"focused\" [class.md-float]=\"floatingPlaceholder\" [class.md-accent]=\"dividerColor == 'accent'\" [class.md-warn]=\"dividerColor == 'warn'\" *ngIf=\"_hasPlaceholder()\"> <ng-content select=\"md-placeholder\"></ng-content> {{placeholder}} <span class=\"md-placeholder-required\" *ngIf=\"required\">*</span> </label> </div> <div class=\"md-input-suffix\"><ng-content select=\"[md-suffix]\"></ng-content></div> </div> <div class=\"md-input-underline\" [class.md-disabled]=\"disabled\"> <span class=\"md-input-ripple\" [class.md-focused]=\"focused\" [class.md-accent]=\"dividerColor == 'accent'\" [class.md-warn]=\"dividerColor == 'warn'\"></span> </div> <div *ngIf=\"hintLabel != ''\" class=\"md-hint\">{{hintLabel}}</div> <ng-content select=\"md-hint\"></ng-content> </div> ",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ /** * Undo the red box-shadow glow added by Firefox on invalid inputs. * See https://developer.mozilla.org/en-US/docs/Web/CSS/:-moz-ui-invalid */ :-moz-ui-invalid { box-shadow: none; } /** * Applies a floating placeholder above the input itself. */ :host { display: inline-block; position: relative; font-family: Roboto, \"Helvetica Neue\", sans-serif; text-align: left; } :host .md-input-wrapper { margin: 16px 0; } :host .md-input-table { display: inline-table; -ms-flex-flow: column; flex-flow: column; vertical-align: bottom; width: 100%; } :host .md-input-table > * { display: table-cell; } :host .md-input-element { font: inherit; background: transparent; border: none; outline: none; padding: 0; width: 100%; } :host .md-input-element.md-end { text-align: right; } :host .md-input-infix { position: relative; } :host .md-input-placeholder { position: absolute; left: 0; top: 0; font-size: 100%; pointer-events: none; color: rgba(0, 0, 0, 0.38); z-index: 1; width: 100%; display: none; white-space: nowrap; text-overflow: ellipsis; overflow-x: hidden; -webkit-transform: translateY(0); transform: translateY(0); -webkit-transform-origin: bottom left; transform-origin: bottom left; -webkit-transition: scale 400ms cubic-bezier(0.25, 0.8, 0.25, 1), color 400ms cubic-bezier(0.25, 0.8, 0.25, 1), width 400ms cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: scale 400ms cubic-bezier(0.25, 0.8, 0.25, 1), color 400ms cubic-bezier(0.25, 0.8, 0.25, 1), width 400ms cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), scale 400ms cubic-bezier(0.25, 0.8, 0.25, 1), color 400ms cubic-bezier(0.25, 0.8, 0.25, 1), width 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), scale 400ms cubic-bezier(0.25, 0.8, 0.25, 1), color 400ms cubic-bezier(0.25, 0.8, 0.25, 1), width 400ms cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); } :host .md-input-placeholder.md-empty { display: block; cursor: text; } :host .md-input-placeholder.md-float:not(.md-empty), :host .md-input-placeholder.md-float.md-focused { display: block; padding-bottom: 5px; -webkit-transform: translateY(-100%) scale(0.75); transform: translateY(-100%) scale(0.75); width: 133.33333%; } :host .md-input-placeholder.md-float:not(.md-empty) .md-placeholder-required, :host .md-input-placeholder.md-float.md-focused .md-placeholder-required { color: #9c27b0; } :host .md-input-placeholder.md-focused { color: #009688; } :host .md-input-placeholder.md-focused.md-accent { color: #9c27b0; } :host .md-input-placeholder.md-focused.md-warn { color: #f44336; } :host input:-webkit-autofill + .md-input-placeholder { display: block; padding-bottom: 5px; -webkit-transform: translateY(-100%) scale(0.75); transform: translateY(-100%) scale(0.75); width: 133.33333%; } :host input:-webkit-autofill + .md-input-placeholder .md-placeholder-required { color: #9c27b0; } :host .md-input-underline { position: absolute; height: 1px; width: 100%; margin-top: 4px; border-top: 1px solid rgba(0, 0, 0, 0.38); } :host .md-input-underline.md-disabled { border-top: 0; background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.26) 0%, rgba(0, 0, 0, 0.26) 33%, transparent 0%); background-image: linear-gradient(to right, rgba(0, 0, 0, 0.26) 0%, rgba(0, 0, 0, 0.26) 33%, transparent 0%); background-position: 0; background-size: 4px 1px; background-repeat: repeat-x; } :host .md-input-underline .md-input-ripple { position: absolute; height: 2px; z-index: 1; background-color: #009688; top: -1px; width: 100%; -webkit-transform-origin: top; transform-origin: top; opacity: 0; -webkit-transform: scaleY(0); transform: scaleY(0); -webkit-transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); } :host .md-input-underline .md-input-ripple.md-accent { background-color: #9c27b0; } :host .md-input-underline .md-input-ripple.md-warn { background-color: #f44336; } :host .md-input-underline .md-input-ripple.md-focused { opacity: 1; -webkit-transform: scaleY(1); transform: scaleY(1); } :host .md-hint { position: absolute; font-size: 75%; bottom: -0.5em; } :host .md-hint.md-right { right: 0; } :host-context([dir='rtl']) { text-align: right; } :host-context([dir='rtl']) .md-input-placeholder { -webkit-transform-origin: bottom right; transform-origin: bottom right; } :host-context([dir='rtl']) .md-input-element.md-end { text-align: left; } :host-context([dir='rtl']) .md-hint { right: 0; left: auto; } :host-context([dir='rtl']) .md-hint.md-right { right: auto; left: 0; } "],
            providers: [exports.MD_INPUT_CONTROL_VALUE_ACCESSOR],
            host: { '(click)': 'focus()' }
        }), 
        __metadata('design:paramtypes', [])
    ], MdInput);
    return MdInput;
}());
exports.MdInput = MdInput;
/** @deprecated */
exports.MD_INPUT_DIRECTIVES = [MdPlaceholder, MdInput, MdHint];
var MdInputModule = (function () {
    function MdInputModule() {
    }
    MdInputModule = __decorate([
        core_1.NgModule({
            declarations: exports.MD_INPUT_DIRECTIVES,
            imports: [common_1.CommonModule, forms_1.FormsModule],
            exports: exports.MD_INPUT_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdInputModule);
    return MdInputModule;
}());
exports.MdInputModule = MdInputModule;
//# sourceMappingURL=input.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var line_1 = require('@angular2-material/core/line/line');
var MdList = (function () {
    function MdList() {
    }
    MdList = __decorate([
        core_1.Component({            selector: 'md-list, md-nav-list',
            host: { 'role': 'list' },
            template: '<ng-content></ng-content>',
            styles: ["/** * This mixin will ensure that lines that overflow the container will * hide the overflow and truncate neatly with an ellipsis. */ /** * This mixin provides all md-line styles, changing secondary font size * based on whether the list is in dense mode. */ /** * This mixin provides base styles for the wrapper around md-line * elements in a list. */ /** * This mixin normalizes default element styles, e.g. font weight for heading text. */ /*  Normal list variables */ /* Dense list variables */ /* This mixin provides all list-item styles, changing font size and height based on whether the list is in dense mode. */ /* This mixin provides all subheader styles, adjusting heights and padding based on whether the list is in dense mode. */ md-list, md-nav-list { padding-top: 8px; display: block; } md-list [md-subheader], md-nav-list [md-subheader] { display: block; box-sizing: border-box; height: 48px; padding: 16px; margin: 0; font-size: 14px; font-weight: 500; color: rgba(0, 0, 0, 0.54); } md-list [md-subheader]:first-child, md-nav-list [md-subheader]:first-child { margin-top: -8px; } md-list md-list-item .md-list-item, md-list a[md-list-item] .md-list-item, md-nav-list md-list-item .md-list-item, md-nav-list a[md-list-item] .md-list-item { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; -webkit-box-align: center; -ms-flex-align: center; align-items: center; font-family: Roboto, \"Helvetica Neue\", sans-serif; box-sizing: border-box; font-size: 16px; height: 48px; padding: 0 16px; color: black; } md-list md-list-item.md-list-avatar .md-list-item, md-list a[md-list-item].md-list-avatar .md-list-item, md-nav-list md-list-item.md-list-avatar .md-list-item, md-nav-list a[md-list-item].md-list-avatar .md-list-item { height: 56px; } md-list md-list-item.md-2-line .md-list-item, md-list a[md-list-item].md-2-line .md-list-item, md-nav-list md-list-item.md-2-line .md-list-item, md-nav-list a[md-list-item].md-2-line .md-list-item { height: 72px; } md-list md-list-item.md-3-line .md-list-item, md-list a[md-list-item].md-3-line .md-list-item, md-nav-list md-list-item.md-3-line .md-list-item, md-nav-list a[md-list-item].md-3-line .md-list-item { height: 88px; } md-list md-list-item .md-list-text, md-list a[md-list-item] .md-list-text, md-nav-list md-list-item .md-list-text, md-nav-list a[md-list-item] .md-list-text { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; width: 100%; box-sizing: border-box; overflow: hidden; padding: 0 16px; } md-list md-list-item .md-list-text > *, md-list a[md-list-item] .md-list-text > *, md-nav-list md-list-item .md-list-text > *, md-nav-list a[md-list-item] .md-list-text > * { margin: 0; padding: 0; font-weight: normal; font-size: inherit; } md-list md-list-item .md-list-text:empty, md-list a[md-list-item] .md-list-text:empty, md-nav-list md-list-item .md-list-text:empty, md-nav-list a[md-list-item] .md-list-text:empty { display: none; } md-list md-list-item .md-list-text:first-child, md-list a[md-list-item] .md-list-text:first-child, md-nav-list md-list-item .md-list-text:first-child, md-nav-list a[md-list-item] .md-list-text:first-child { padding: 0; } md-list md-list-item [md-list-avatar], md-list a[md-list-item] [md-list-avatar], md-nav-list md-list-item [md-list-avatar], md-nav-list a[md-list-item] [md-list-avatar] { width: 40px; height: 40px; border-radius: 50%; } md-list md-list-item [md-list-icon], md-list a[md-list-item] [md-list-icon], md-nav-list md-list-item [md-list-icon], md-nav-list a[md-list-item] [md-list-icon] { width: 24px; height: 24px; border-radius: 50%; padding: 4px; } md-list md-list-item [md-line], md-list a[md-list-item] [md-line], md-nav-list md-list-item [md-line], md-nav-list a[md-list-item] [md-line] { white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; display: block; box-sizing: border-box; } md-list md-list-item [md-line]:nth-child(n+2), md-list a[md-list-item] [md-line]:nth-child(n+2), md-nav-list md-list-item [md-line]:nth-child(n+2), md-nav-list a[md-list-item] [md-line]:nth-child(n+2) { font-size: 14px; } md-list[dense], md-nav-list[dense] { padding-top: 4px; display: block; } md-list[dense] [md-subheader], md-nav-list[dense] [md-subheader] { display: block; box-sizing: border-box; height: 40px; padding: 16px; margin: 0; font-size: 13px; font-weight: 500; color: rgba(0, 0, 0, 0.54); } md-list[dense] [md-subheader]:first-child, md-nav-list[dense] [md-subheader]:first-child { margin-top: -4px; } md-list[dense] md-list-item .md-list-item, md-list[dense] a[md-list-item] .md-list-item, md-nav-list[dense] md-list-item .md-list-item, md-nav-list[dense] a[md-list-item] .md-list-item { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; -webkit-box-align: center; -ms-flex-align: center; align-items: center; font-family: Roboto, \"Helvetica Neue\", sans-serif; box-sizing: border-box; font-size: 13px; height: 40px; padding: 0 16px; color: black; } md-list[dense] md-list-item.md-list-avatar .md-list-item, md-list[dense] a[md-list-item].md-list-avatar .md-list-item, md-nav-list[dense] md-list-item.md-list-avatar .md-list-item, md-nav-list[dense] a[md-list-item].md-list-avatar .md-list-item { height: 48px; } md-list[dense] md-list-item.md-2-line .md-list-item, md-list[dense] a[md-list-item].md-2-line .md-list-item, md-nav-list[dense] md-list-item.md-2-line .md-list-item, md-nav-list[dense] a[md-list-item].md-2-line .md-list-item { height: 60px; } md-list[dense] md-list-item.md-3-line .md-list-item, md-list[dense] a[md-list-item].md-3-line .md-list-item, md-nav-list[dense] md-list-item.md-3-line .md-list-item, md-nav-list[dense] a[md-list-item].md-3-line .md-list-item { height: 76px; } md-list[dense] md-list-item .md-list-text, md-list[dense] a[md-list-item] .md-list-text, md-nav-list[dense] md-list-item .md-list-text, md-nav-list[dense] a[md-list-item] .md-list-text { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; width: 100%; box-sizing: border-box; overflow: hidden; padding: 0 16px; } md-list[dense] md-list-item .md-list-text > *, md-list[dense] a[md-list-item] .md-list-text > *, md-nav-list[dense] md-list-item .md-list-text > *, md-nav-list[dense] a[md-list-item] .md-list-text > * { margin: 0; padding: 0; font-weight: normal; font-size: inherit; } md-list[dense] md-list-item .md-list-text:empty, md-list[dense] a[md-list-item] .md-list-text:empty, md-nav-list[dense] md-list-item .md-list-text:empty, md-nav-list[dense] a[md-list-item] .md-list-text:empty { display: none; } md-list[dense] md-list-item .md-list-text:first-child, md-list[dense] a[md-list-item] .md-list-text:first-child, md-nav-list[dense] md-list-item .md-list-text:first-child, md-nav-list[dense] a[md-list-item] .md-list-text:first-child { padding: 0; } md-list[dense] md-list-item [md-list-avatar], md-list[dense] a[md-list-item] [md-list-avatar], md-nav-list[dense] md-list-item [md-list-avatar], md-nav-list[dense] a[md-list-item] [md-list-avatar] { width: 40px; height: 40px; border-radius: 50%; } md-list[dense] md-list-item [md-list-icon], md-list[dense] a[md-list-item] [md-list-icon], md-nav-list[dense] md-list-item [md-list-icon], md-nav-list[dense] a[md-list-item] [md-list-icon] { width: 24px; height: 24px; border-radius: 50%; padding: 4px; } md-list[dense] md-list-item [md-line], md-list[dense] a[md-list-item] [md-line], md-nav-list[dense] md-list-item [md-line], md-nav-list[dense] a[md-list-item] [md-line] { white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; display: block; box-sizing: border-box; } md-list[dense] md-list-item [md-line]:nth-child(n+2), md-list[dense] a[md-list-item] [md-line]:nth-child(n+2), md-nav-list[dense] md-list-item [md-line]:nth-child(n+2), md-nav-list[dense] a[md-list-item] [md-line]:nth-child(n+2) { font-size: 13px; } md-divider { display: block; border-top: 1px solid rgba(0, 0, 0, 0.12); margin: 0; } md-nav-list a { text-decoration: none; color: inherit; } md-nav-list .md-list-item { cursor: pointer; } md-nav-list .md-list-item:hover, md-nav-list .md-list-item.md-list-item-focus { outline: none; background: rgba(0, 0, 0, 0.04); } "],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], MdList);
    return MdList;
}());
exports.MdList = MdList;
/* Need directive for a ContentChild query in list-item */
var MdListAvatar = (function () {
    function MdListAvatar() {
    }
    MdListAvatar = __decorate([
        core_1.Directive({ selector: '[md-list-avatar]' }), 
        __metadata('design:paramtypes', [])
    ], MdListAvatar);
    return MdListAvatar;
}());
exports.MdListAvatar = MdListAvatar;
var MdListItem = (function () {
    function MdListItem(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        this._hasFocus = false;
    }
    Object.defineProperty(MdListItem.prototype, "_hasAvatar", {
        set: function (avatar) {
            this._renderer.setElementClass(this._element.nativeElement, 'md-list-avatar', avatar != null);
        },
        enumerable: true,
        configurable: true
    });
    /** TODO: internal */
    MdListItem.prototype.ngAfterContentInit = function () {
        this._lineSetter = new line_1.MdLineSetter(this._lines, this._renderer, this._element);
    };
    MdListItem.prototype._handleFocus = function () {
        this._hasFocus = true;
    };
    MdListItem.prototype._handleBlur = function () {
        this._hasFocus = false;
    };
    __decorate([
        core_1.ContentChildren(line_1.MdLine), 
        __metadata('design:type', core_1.QueryList)
    ], MdListItem.prototype, "_lines", void 0);
    __decorate([
        core_1.ContentChild(MdListAvatar), 
        __metadata('design:type', MdListAvatar), 
        __metadata('design:paramtypes', [MdListAvatar])
    ], MdListItem.prototype, "_hasAvatar", null);
    MdListItem = __decorate([
        core_1.Component({            selector: 'md-list-item, a[md-list-item]',
            host: {
                'role': 'listitem',
                '(focus)': '_handleFocus()',
                '(blur)': '_handleBlur()',
            },
            template: "<div class=\"md-list-item\" [class.md-list-item-focus]=\"_hasFocus\"> <ng-content select=\"[md-list-avatar],[md-list-icon]\"></ng-content> <div class=\"md-list-text\"><ng-content select=\"[md-line]\"></ng-content></div> <ng-content></ng-content> </div> ",
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], MdListItem);
    return MdListItem;
}());
exports.MdListItem = MdListItem;
/** @deprecated */
exports.MD_LIST_DIRECTIVES = [MdList, MdListItem, MdListAvatar];
var MdListModule = (function () {
    function MdListModule() {
    }
    MdListModule = __decorate([
        core_1.NgModule({
            imports: [line_1.MdLineModule],
            exports: [exports.MD_LIST_DIRECTIVES, line_1.MdLineModule],
            declarations: exports.MD_LIST_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdListModule);
    return MdListModule;
}());
exports.MdListModule = MdListModule;
//# sourceMappingURL=list.js.map
// TODO(kara): keyboard events for menu navigation
// TODO(kara): prevent-close functionality
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var menu_errors_1 = require('./menu-errors');
var MdMenu = (function () {
    function MdMenu(posX, posY) {
        this._showClickCatcher = false;
        this.positionX = 'after';
        this.positionY = 'below';
        this.close = new core_1.EventEmitter;
        if (posX) {
            this._setPositionX(posX);
        }
        if (posY) {
            this._setPositionY(posY);
        }
    }
    Object.defineProperty(MdMenu.prototype, "classList", {
        /**
         * This method takes classes set on the host md-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @param classes list of class names
         */
        set: function (classes) {
            this._classList = classes.split(' ').reduce(function (obj, className) {
                obj[className] = true;
                return obj;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This function toggles the display of the menu's click catcher element.
     * This element covers the viewport when the menu is open to detect clicks outside the menu.
     * TODO: internal
     */
    MdMenu.prototype._setClickCatcher = function (bool) {
        this._showClickCatcher = bool;
    };
    MdMenu.prototype._setPositionX = function (pos) {
        if (pos !== 'before' && pos !== 'after') {
            throw new menu_errors_1.MdMenuInvalidPositionX();
        }
        this.positionX = pos;
    };
    MdMenu.prototype._setPositionY = function (pos) {
        if (pos !== 'above' && pos !== 'below') {
            throw new menu_errors_1.MdMenuInvalidPositionY();
        }
        this.positionY = pos;
    };
    MdMenu.prototype._emitCloseEvent = function () {
        this.close.emit(null);
    };
    __decorate([
        core_1.ViewChild(core_1.TemplateRef), 
        __metadata('design:type', core_1.TemplateRef)
    ], MdMenu.prototype, "templateRef", void 0);
    __decorate([
        core_1.Input('class'), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], MdMenu.prototype, "classList", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MdMenu.prototype, "close", void 0);
    MdMenu = __decorate([
        core_1.Component({            selector: 'md-menu',
            host: { 'role': 'menu' },
            template: "<template> <div class=\"md-menu\" [ngClass]=\"_classList\" (click)=\"_emitCloseEvent()\"> <ng-content></ng-content> </div> </template> <div class=\"md-menu-click-catcher\" *ngIf=\"_showClickCatcher\" (click)=\"_emitCloseEvent()\"></div>",
            styles: ["/** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ /** * This mixin overrides default button styles like the gray background, * the border, and the outline. */ /* This mixin ensures an element spans the whole viewport.*/ /** * This mixin will ensure that lines that overflow the container will * hide the overflow and truncate neatly with an ellipsis. */ /** * This mixin provides all md-line styles, changing secondary font size * based on whether the list is in dense mode. */ /** * This mixin provides base styles for the wrapper around md-line * elements in a list. */ /** * This mixin normalizes default element styles, e.g. font weight for heading text. */ .md-menu { box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); min-width: 112px; max-width: 280px; max-height: calc(100vh + 48px); overflow: auto; -webkit-overflow-scrolling: touch; background: white; padding-top: 8px; padding-bottom: 8px; } [md-menu-item] { background: transparent; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; outline: none; border: none; white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; -webkit-box-align: center; -ms-flex-align: center; align-items: center; height: 48px; padding: 0 16px; font-size: 16px; font-family: Roboto, \"Helvetica Neue\", sans-serif; text-align: start; text-decoration: none; color: rgba(0, 0, 0, 0.87); } [md-menu-item][disabled] { color: rgba(0, 0, 0, 0.38); cursor: default; } [md-menu-item]:hover:not([disabled]) { background: rgba(0, 0, 0, 0.04); } button[md-menu-item] { width: 100%; } .md-menu-click-catcher { position: fixed; top: 0; left: 0; right: 0; bottom: 0; } "],
            encapsulation: core_1.ViewEncapsulation.None,
            exportAs: 'mdMenu'
        }),
        __param(0, core_1.Attribute('x-position')),
        __param(1, core_1.Attribute('y-position')), 
        __metadata('design:paramtypes', [String, String])
    ], MdMenu);
    return MdMenu;
}());
exports.MdMenu = MdMenu;
//# sourceMappingURL=menu-directive.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var error_1 = require('@angular2-material/core/errors/error');
/**
 * Exception thrown when menu trigger doesn't have a valid md-menu instance
 */
var MdMenuMissingError = (function (_super) {
    __extends(MdMenuMissingError, _super);
    function MdMenuMissingError() {
        _super.call(this, "md-menu-trigger: must pass in an md-menu instance.\n\n    Example:\n      <md-menu #menu=\"mdMenu\"></md-menu>\n      <button [md-menu-trigger-for]=\"menu\"></button>\n    ");
    }
    return MdMenuMissingError;
}(error_1.MdError));
exports.MdMenuMissingError = MdMenuMissingError;
/**
 * Exception thrown when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 */
var MdMenuInvalidPositionX = (function (_super) {
    __extends(MdMenuInvalidPositionX, _super);
    function MdMenuInvalidPositionX() {
        _super.call(this, "x-position value must be either 'before' or after'.\n      Example: <md-menu x-position=\"before\" #menu=\"mdMenu\"></md-menu>\n    ");
    }
    return MdMenuInvalidPositionX;
}(error_1.MdError));
exports.MdMenuInvalidPositionX = MdMenuInvalidPositionX;
/**
 * Exception thrown when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 */
var MdMenuInvalidPositionY = (function (_super) {
    __extends(MdMenuInvalidPositionY, _super);
    function MdMenuInvalidPositionY() {
        _super.call(this, "y-position value must be either 'above' or below'.\n      Example: <md-menu y-position=\"above\" #menu=\"mdMenu\"></md-menu>\n    ");
    }
    return MdMenuInvalidPositionY;
}(error_1.MdError));
exports.MdMenuInvalidPositionY = MdMenuInvalidPositionY;
//# sourceMappingURL=menu-errors.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/**
 * This directive is intended to be used inside an md-menu tag.
 * It exists mostly to set the role attribute.
 */
var MdMenuItem = (function () {
    function MdMenuItem() {
    }
    MdMenuItem = __decorate([
        core_1.Directive({
            selector: 'button[md-menu-item]',
            host: { 'role': 'menuitem' }
        }), 
        __metadata('design:paramtypes', [])
    ], MdMenuItem);
    return MdMenuItem;
}());
exports.MdMenuItem = MdMenuItem;
/**
 * This directive is intended to be used inside an md-menu tag.
 * It sets the role attribute and adds support for the disabled property to anchors.
 */
var MdMenuAnchor = (function () {
    function MdMenuAnchor() {
    }
    Object.defineProperty(MdMenuAnchor.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = (value === false || value === undefined) ? null : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuAnchor.prototype, "isAriaDisabled", {
        get: function () {
            return String(this.disabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuAnchor.prototype, "tabIndex", {
        get: function () {
            return this.disabled ? -1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    MdMenuAnchor.prototype.checkDisabled = function (event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    __decorate([
        core_1.HostBinding('attr.disabled'),
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdMenuAnchor.prototype, "disabled", null);
    __decorate([
        core_1.HostBinding('attr.aria-disabled'), 
        __metadata('design:type', String)
    ], MdMenuAnchor.prototype, "isAriaDisabled", null);
    __decorate([
        core_1.HostBinding('tabIndex'), 
        __metadata('design:type', Number)
    ], MdMenuAnchor.prototype, "tabIndex", null);
    MdMenuAnchor = __decorate([
        core_1.Directive({
            selector: 'a[md-menu-item]',
            host: {
                'role': 'menuitem',
                '(click)': 'checkDisabled($event)'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdMenuAnchor);
    return MdMenuAnchor;
}());
exports.MdMenuAnchor = MdMenuAnchor;
//# sourceMappingURL=menu-item.js.map
"use strict";
//# sourceMappingURL=menu-positions.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var menu_directive_1 = require('./menu-directive');
var menu_errors_1 = require('./menu-errors');
var core_2 = require('@angular2-material/core/core');
/**
 * This directive is intended to be used in conjunction with an md-menu tag.  It is
 * responsible for toggling the display of the provided menu instance.
 */
var MdMenuTrigger = (function () {
    function MdMenuTrigger(_overlay, _element, _viewContainerRef) {
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
        this._menuOpen = false;
        this.onMenuOpen = new core_1.EventEmitter();
        this.onMenuClose = new core_1.EventEmitter();
    }
    MdMenuTrigger.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._checkMenu();
        this.menu.close.subscribe(function () { return _this.closeMenu(); });
    };
    MdMenuTrigger.prototype.ngOnDestroy = function () { this.destroyMenu(); };
    Object.defineProperty(MdMenuTrigger.prototype, "menuOpen", {
        get: function () { return this._menuOpen; },
        enumerable: true,
        configurable: true
    });
    MdMenuTrigger.prototype.toggleMenu = function () {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    };
    MdMenuTrigger.prototype.openMenu = function () {
        var _this = this;
        return this._createOverlay()
            .then(function () { return _this._overlayRef.attach(_this._portal); })
            .then(function () { return _this._setIsMenuOpen(true); });
    };
    MdMenuTrigger.prototype.closeMenu = function () {
        var _this = this;
        if (!this._overlayRef) {
            return Promise.resolve();
        }
        return this._overlayRef.detach()
            .then(function () { return _this._setIsMenuOpen(false); });
    };
    MdMenuTrigger.prototype.destroyMenu = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    };
    // set state rather than toggle to support triggers sharing a menu
    MdMenuTrigger.prototype._setIsMenuOpen = function (isOpen) {
        this._menuOpen = isOpen;
        this.menu._setClickCatcher(isOpen);
        this._menuOpen ? this.onMenuOpen.emit(null) : this.onMenuClose.emit(null);
    };
    /**
     *  This method checks that a valid instance of MdMenu has been passed into
     *  md-menu-trigger-for.  If not, an exception is thrown.
     */
    MdMenuTrigger.prototype._checkMenu = function () {
        if (!this.menu || !(this.menu instanceof menu_directive_1.MdMenu)) {
            throw new menu_errors_1.MdMenuMissingError();
        }
    };
    /**
     *  This method creates the overlay from the provided menu's template and saves its
     *  OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    MdMenuTrigger.prototype._createOverlay = function () {
        var _this = this;
        if (this._overlayRef) {
            return Promise.resolve();
        }
        this._portal = new core_2.TemplatePortal(this.menu.templateRef, this._viewContainerRef);
        return this._overlay.create(this._getOverlayConfig())
            .then(function (overlay) { return _this._overlayRef = overlay; });
    };
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayState
     */
    MdMenuTrigger.prototype._getOverlayConfig = function () {
        var overlayState = new core_2.OverlayState();
        overlayState.positionStrategy = this._getPosition();
        return overlayState;
    };
    /**
     * This method builds the position strategy for the overlay, so the menu is properly connected
     * to the trigger.
     * @returns ConnectedPositionStrategy
     */
    MdMenuTrigger.prototype._getPosition = function () {
        var positionX = this.menu.positionX === 'before' ? 'end' : 'start';
        var positionY = this.menu.positionY === 'above' ? 'bottom' : 'top';
        return this._overlay.position().connectedTo(this._element, { originX: positionX, originY: positionY }, { overlayX: positionX, overlayY: positionY });
    };
    __decorate([
        core_1.Input('md-menu-trigger-for'), 
        __metadata('design:type', menu_directive_1.MdMenu)
    ], MdMenuTrigger.prototype, "menu", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MdMenuTrigger.prototype, "onMenuOpen", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MdMenuTrigger.prototype, "onMenuClose", void 0);
    __decorate([
        core_1.HostListener('click'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', Promise)
    ], MdMenuTrigger.prototype, "toggleMenu", null);
    MdMenuTrigger = __decorate([
        core_1.Directive({
            selector: '[md-menu-trigger-for]',
            host: { 'aria-haspopup': 'true' },
            providers: [core_2.OVERLAY_PROVIDERS],
            exportAs: 'mdMenuTrigger'
        }), 
        __metadata('design:paramtypes', [core_2.Overlay, core_1.ElementRef, core_1.ViewContainerRef])
    ], MdMenuTrigger);
    return MdMenuTrigger;
}());
exports.MdMenuTrigger = MdMenuTrigger;
//# sourceMappingURL=menu-trigger.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var core_2 = require('@angular2-material/core/core');
var menu_directive_1 = require('./menu-directive');
var menu_item_1 = require('./menu-item');
var menu_trigger_1 = require('./menu-trigger');
var menu_directive_2 = require('./menu-directive');
exports.MdMenu = menu_directive_2.MdMenu;
var menu_item_2 = require('./menu-item');
exports.MdMenuItem = menu_item_2.MdMenuItem;
exports.MdMenuAnchor = menu_item_2.MdMenuAnchor;
var menu_trigger_2 = require('./menu-trigger');
exports.MdMenuTrigger = menu_trigger_2.MdMenuTrigger;
/** @deprecated */
exports.MD_MENU_DIRECTIVES = [menu_directive_1.MdMenu, menu_item_1.MdMenuItem, menu_trigger_1.MdMenuTrigger, menu_item_1.MdMenuAnchor];
var MdMenuModule = (function () {
    function MdMenuModule() {
    }
    MdMenuModule = __decorate([
        core_1.NgModule({
            imports: [core_2.OverlayModule, common_1.CommonModule],
            exports: exports.MD_MENU_DIRECTIVES,
            declarations: exports.MD_MENU_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdMenuModule);
    return MdMenuModule;
}());
exports.MdMenuModule = MdMenuModule;
//# sourceMappingURL=menu.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
// TODO(josephperrott): Benchpress tests.
// TODO(josephperrott): Add ARIA attributes for progressbar "for".
/**
 * <md-progress-bar> component.
 */
var MdProgressBar = (function () {
    function MdProgressBar() {
        /** Value of the progressbar. Defaults to zero. Mirrored to aria-valuenow. */
        this._value = 0;
        /** Buffer value of the progress bar. Defaults to zero. */
        this._bufferValue = 0;
        /**
         * Mode of the progress bar.
         *
         * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
         * 'determinate'.
         * Mirrored to mode attribute.
         */
        this.mode = 'determinate';
    }
    Object.defineProperty(MdProgressBar.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = clamp(v || 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressBar.prototype, "bufferValue", {
        get: function () {
            return this._bufferValue;
        },
        set: function (v) {
            this._bufferValue = clamp(v || 0);
        },
        enumerable: true,
        configurable: true
    });
    /** Gets the current transform value for the progress bar's primary indicator. */
    MdProgressBar.prototype._primaryTransform = function () {
        var scale = this.value / 100;
        return { transform: "scaleX(" + scale + ")" };
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator.  Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     */
    MdProgressBar.prototype._bufferTransform = function () {
        if (this.mode == 'buffer') {
            var scale = this.bufferValue / 100;
            return { transform: "scaleX(" + scale + ")" };
        }
    };
    __decorate([
        core_1.Input(),
        core_1.HostBinding('attr.aria-valuenow'), 
        __metadata('design:type', Object)
    ], MdProgressBar.prototype, "value", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdProgressBar.prototype, "bufferValue", null);
    __decorate([
        core_1.Input(),
        core_1.HostBinding('attr.mode'), 
        __metadata('design:type', Object)
    ], MdProgressBar.prototype, "mode", void 0);
    MdProgressBar = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'md-progress-bar',
            host: {
                'role': 'progressbar',
                'aria-valuemin': '0',
                'aria-valuemax': '100',
            },
            template: "<!-- The background div is named as such because it appears below the other divs and is not sized based on values. --> <div class=\"md-progress-bar-background\"></div> <div class=\"md-progress-bar-buffer\" [ngStyle]=\"_bufferTransform()\"></div> <div class=\"md-progress-bar-primary md-progress-bar-fill\" [ngStyle]=\"_primaryTransform()\"></div> <div class=\"md-progress-bar-secondary md-progress-bar-fill\"></div> ",
            styles: ["/** In buffer mode a repeated SVG object is used as a background.  Each of the following defines the SVG object for each of the class defined colors. Each string is a URL encoded version of: <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" enable-background=\"new 0 0 5 2\" xml:space=\"preserve\" viewBox=\"0 0 5 2\" preserveAspectRatio=\"none slice\"> <circle cx=\"1\" cy=\"1\" r=\"1\" fill=\"{INJECTED_COLOR}\"/> </svg> */ :host { display: block; height: 5px; overflow: hidden; position: relative; transform: translateZ(0); transition: opacity 250ms linear; width: 100%; /** * The progress bar buffer is the bar indicator showing the buffer value and is only visible beyond the current value * of the primary progress bar. */ /** * The secondary progress bar is only used in the indeterminate animation, because of this it is hidden in other uses. */ /** * The progress bar fill fills the progress bar with the indicator color. */ /** * A pseudo element is created for each progress bar bar that fills with the indicator color. */ } :host .md-progress-bar-background { background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27#b2dfdb%27%2F%3E%3C%2Fsvg%3E\"); background-repeat: repeat-x; background-size: 10px 4px; height: 100%; position: absolute; visibility: hidden; width: 100%; } :host .md-progress-bar-buffer { background-color: #b2dfdb; height: 100%; position: absolute; transform-origin: top left; transition: transform 250ms ease; width: 100%; } :host .md-progress-bar-secondary { visibility: hidden; } :host .md-progress-bar-fill { animation: none; height: 100%; position: absolute; transform-origin: top left; transition: transform 250ms ease; width: 100%; } :host .md-progress-bar-fill::after { animation: none; background-color: #00897b; content: ''; display: inline-block; height: 100%; position: absolute; width: 100%; } :host[color='accent'] .md-progress-bar-background { background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27#e1bee7%27%2F%3E%3C%2Fsvg%3E\"); background-repeat: repeat-x; background-size: 10px 4px; } :host[color='accent'] .md-progress-bar-buffer { background-color: #e1bee7; } :host[color='accent'] .md-progress-bar-fill::after { background-color: #8e24aa; } :host[color='warn'] .md-progress-bar-background { background: url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27#ffcdd2%27%2F%3E%3C%2Fsvg%3E\"); background-repeat: repeat-x; background-size: 10px 4px; } :host[color='warn'] .md-progress-bar-buffer { background-color: #ffcdd2; } :host[color='warn'] .md-progress-bar-fill::after { background-color: #e53935; } :host[mode='query'] { transform: rotateZ(180deg); } :host[mode='indeterminate'] .md-progress-bar-fill, :host[mode='query'] .md-progress-bar-fill { transition: none; } :host[mode='indeterminate'] .md-progress-bar-primary, :host[mode='query'] .md-progress-bar-primary { animation: md-progress-bar-primary-indeterminate-translate 2000ms infinite linear; left: -145.166611%; } :host[mode='indeterminate'] .md-progress-bar-primary.md-progress-bar-fill::after, :host[mode='query'] .md-progress-bar-primary.md-progress-bar-fill::after { animation: md-progress-bar-primary-indeterminate-scale 2000ms infinite linear; } :host[mode='indeterminate'] .md-progress-bar-secondary, :host[mode='query'] .md-progress-bar-secondary { animation: md-progress-bar-secondary-indeterminate-translate 2000ms infinite linear; left: -54.888891%; visibility: visible; } :host[mode='indeterminate'] .md-progress-bar-secondary.md-progress-bar-fill::after, :host[mode='query'] .md-progress-bar-secondary.md-progress-bar-fill::after { animation: md-progress-bar-secondary-indeterminate-scale 2000ms infinite linear; } :host[mode='buffer'] .md-progress-bar-background { animation: md-progress-bar-background-scroll 250ms infinite linear; visibility: visible; } :host-context([dir='rtl']) { transform: rotateY(180deg); } /** The values used for animations in md-progress-bar, both timing and transformation, can be considered magic values. They are sourced from the Material Design example spec and duplicate the values of the original designers definitions. The indeterminate state is essentially made up of two progress bars, one primary (the one that is shown in both the determinate and indeterminate states) and one secondary, which essentially mirrors the primary progress bar in appearance but is only shown to assist with the indeterminate animations. KEYFRAME BLOCK	                    DESCRIPTION primary-indeterminate-translate     Translation of the primary progressbar across the screen primary-indeterminate-scale         Scaling of the primary progressbar as it's being translated across the screen secondary-indeterminate-translate   Translation of the secondary progressbar across the screen secondary-indeterminate-scale       Scaling of the secondary progressbar as it's being translated across the screen Because two different transform animations need to be applied at once, the translation is applied to the outer element and the scaling is applied to the inner element, which provides the illusion necessary to make the animation work. */ /** Animations for indeterminate and query mode. */ @keyframes md-progress-bar-primary-indeterminate-translate { 0% { transform: translateX(0); } 20% { animation-timing-function: cubic-bezier(0.5, 0, 0.70173, 0.49582); transform: translateX(0); } 59.15% { animation-timing-function: cubic-bezier(0.30244, 0.38135, 0.55, 0.95635); transform: translateX(83.67142%); } 100% { transform: translateX(200.61106%); } } @keyframes md-progress-bar-primary-indeterminate-scale { 0% { transform: scaleX(0.08); } 36.65% { animation-timing-function: cubic-bezier(0.33473, 0.12482, 0.78584, 1); transform: scaleX(0.08); } 69.15% { animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1); transform: scaleX(0.66148); } 100% { transform: scaleX(0.08); } } @keyframes md-progress-bar-secondary-indeterminate-translate { 0% { animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969); transform: translateX(0); } 25% { animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371); transform: translateX(37.65191%); } 48.35% { animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203); transform: translateX(84.38617%); } 100% { transform: translateX(160.27778%); } } @keyframes md-progress-bar-secondary-indeterminate-scale { 0% { animation-timing-function: cubic-bezier(0.15, 0, 0.51506, 0.40969); transform: scaleX(0.08); } 19.15% { animation-timing-function: cubic-bezier(0.31033, 0.28406, 0.8, 0.73371); transform: scaleX(0.4571); } 44.15% { animation-timing-function: cubic-bezier(0.4, 0.62704, 0.6, 0.90203); transform: scaleX(0.72796); } 100% { transform: scaleX(0.08); } } /** Animation for buffer mode. */ @keyframes md-progress-bar-background-scroll { to { transform: translateX(-10px); } } /*# sourceMappingURL=progress-bar.css.map */ "],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdProgressBar);
    return MdProgressBar;
}());
exports.MdProgressBar = MdProgressBar;
/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp(v, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100; }
    return Math.max(min, Math.min(max, v));
}
/** @deprecated */
exports.MD_PROGRESS_BAR_DIRECTIVES = [MdProgressBar];
var MdProgressBarModule = (function () {
    function MdProgressBarModule() {
    }
    MdProgressBarModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            exports: exports.MD_PROGRESS_BAR_DIRECTIVES,
            declarations: exports.MD_PROGRESS_BAR_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdProgressBarModule);
    return MdProgressBarModule;
}());
exports.MdProgressBarModule = MdProgressBarModule;

//# sourceMappingURL=progress-bar.js.map

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
// TODO(josephperrott): Benchpress tests.
/** A single degree in radians. */
var DEGREE_IN_RADIANS = Math.PI / 180;
/** Duration of the indeterminate animation. */
var DURATION_INDETERMINATE = 667;
/** Duration of the indeterminate animation. */
var DURATION_DETERMINATE = 225;
/** Start animation value of the indeterminate animation */
var startIndeterminate = 3;
/** End animation value of the indeterminate animation */
var endIndeterminate = 80;
/**
 * <md-progress-circle> component.
 */
var MdProgressCircle = (function () {
    function MdProgressCircle(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The id of the last requested animation. */
        this._lastAnimationId = 0;
        this._mode = 'determinate';
    }
    Object.defineProperty(MdProgressCircle.prototype, "_ariaValueMin", {
        /**
         * Values for aria max and min are only defined as numbers when in a determinate mode.  We do this
         * because voiceover does not report the progress indicator as indeterminate if the aria min
         * and/or max value are number values.
         */
        get: function () {
            return this.mode == 'determinate' ? 0 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressCircle.prototype, "_ariaValueMax", {
        get: function () {
            return this.mode == 'determinate' ? 100 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressCircle.prototype, "interdeterminateInterval", {
        /** TODO: internal */
        get: function () {
            return this._interdeterminateInterval;
        },
        /** TODO: internal */
        set: function (interval) {
            clearInterval(this._interdeterminateInterval);
            this._interdeterminateInterval = interval;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressCircle.prototype, "currentPath", {
        /** TODO: internal */
        get: function () {
            return this._currentPath;
        },
        set: function (path) {
            this._currentPath = path;
            // Mark for check as our ChangeDetectionStrategy is OnPush, when changes come from within the
            // component, change detection must be called for.
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    /** Clean up any animations that were running. */
    MdProgressCircle.prototype.ngOnDestroy = function () {
        this._cleanupIndeterminateAnimation();
    };
    Object.defineProperty(MdProgressCircle.prototype, "value", {
        get: function () {
            if (this.mode == 'determinate') {
                return this._value;
            }
        },
        set: function (v) {
            if (v && this.mode == 'determinate') {
                var newValue = clamp(v);
                this._animateCircle((this.value || 0), newValue, linearEase, DURATION_DETERMINATE, 0);
                this._value = newValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressCircle.prototype, "mode", {
        /**
         * Mode of the progress circle
         *
         * Input must be one of the values from ProgressMode, defaults to 'determinate'.
         * mode is bound to the host as the attribute host.
         */
        get: function () {
            return this._mode;
        },
        set: function (m) {
            if (m == 'indeterminate') {
                this._startIndeterminateAnimation();
            }
            else {
                this._cleanupIndeterminateAnimation();
            }
            this._mode = m;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Animates the circle from one percentage value to another.
     *
     * @param animateFrom The percentage of the circle filled starting the animation.
     * @param animateTo The percentage of the circle filled ending the animation.
     * @param ease The easing function to manage the pace of change in the animation.
     * @param duration The length of time to show the animation, in milliseconds.
     * @param rotation The starting angle of the circle fill, with 0° represented at the top center
     *    of the circle.
     */
    MdProgressCircle.prototype._animateCircle = function (animateFrom, animateTo, ease, duration, rotation) {
        var _this = this;
        var id = ++this._lastAnimationId;
        var startTime = Date.now();
        var changeInValue = animateTo - animateFrom;
        // No need to animate it if the values are the same
        if (animateTo === animateFrom) {
            this.currentPath = getSvgArc(animateTo, rotation);
        }
        else {
            var animation_1 = function () {
                var elapsedTime = Math.max(0, Math.min(Date.now() - startTime, duration));
                _this.currentPath = getSvgArc(ease(elapsedTime, animateFrom, changeInValue, duration), rotation);
                // Prevent overlapping animations by checking if a new animation has been called for and
                // if the animation has lasted long than the animation duration.
                if (id === _this._lastAnimationId && elapsedTime < duration) {
                    requestAnimationFrame(animation_1);
                }
            };
            requestAnimationFrame(animation_1);
        }
    };
    /**
     * Starts the indeterminate animation interval, if it is not already running.
     */
    MdProgressCircle.prototype._startIndeterminateAnimation = function () {
        var _this = this;
        var rotationStartPoint = 0;
        var start = startIndeterminate;
        var end = endIndeterminate;
        var duration = DURATION_INDETERMINATE;
        var animate = function () {
            _this._animateCircle(start, end, materialEase, duration, rotationStartPoint);
            // Prevent rotation from reaching Number.MAX_SAFE_INTEGER.
            rotationStartPoint = (rotationStartPoint + end) % 100;
            var temp = start;
            start = -end;
            end = -temp;
        };
        if (!this.interdeterminateInterval) {
            this.interdeterminateInterval = setInterval(animate, duration + 50, 0, false);
            animate();
        }
    };
    /**
     * Removes interval, ending the animation.
     */
    MdProgressCircle.prototype._cleanupIndeterminateAnimation = function () {
        this.interdeterminateInterval = null;
    };
    __decorate([
        core_1.Input(),
        core_1.HostBinding('attr.aria-valuenow'), 
        __metadata('design:type', Object)
    ], MdProgressCircle.prototype, "value", null);
    __decorate([
        core_1.HostBinding('attr.mode'),
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdProgressCircle.prototype, "mode", null);
    MdProgressCircle = __decorate([
        core_1.Component({            selector: 'md-progress-circle',
            host: {
                'role': 'progressbar',
                '[attr.aria-valuemin]': '_ariaValueMin',
                '[attr.aria-valuemax]': '_ariaValueMax',
            },
            template: "<!-- preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's center.  The center of the circle with remain at the center of the md-progress-circle element containing the SVG. --> <svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"> <path [attr.d]=\"currentPath\"></path> </svg> ",
            styles: ["/* Animation Durations */ /** Component sizing */ :host { display: block; /** Height and width are provided for md-progress-circle to act as a default. The height and width are expected to be overwritten by application css. */ height: 100px; width: 100px; /** SVG's viewBox is defined as 0 0 100 100, this means that all SVG children will placed based on a 100px by 100px box.  Additionally all SVG sizes and locations are in reference to this viewBox. */ } :host svg { height: 100%; width: 100%; -webkit-transform-origin: center; transform-origin: center; } :host path { fill: transparent; stroke: #00897b; /** Stroke width of 10px defines stroke as 10% of the viewBox */ stroke-width: 10px; } :host[color='accent'] path { stroke: #8e24aa; } :host[color='warn'] path { stroke: #e53935; } :host[mode='indeterminate'] { -webkit-animation-duration: 5250ms, 2887.5ms; animation-duration: 5250ms, 2887.5ms; -webkit-animation-name: md-progress-circle-sporadic-rotate, md-progress-circle-linear-rotate; animation-name: md-progress-circle-sporadic-rotate, md-progress-circle-linear-rotate; -webkit-animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1), linear; animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1), linear; -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite; -webkit-transition: none; transition: none; } /** Animations for indeterminate mode */ @-webkit-keyframes md-progress-circle-linear-rotate { 0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } } @keyframes md-progress-circle-linear-rotate { 0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } } @-webkit-keyframes md-progress-circle-sporadic-rotate { 12.5% { -webkit-transform: rotate(135deg); transform: rotate(135deg); } 25% { -webkit-transform: rotate(270deg); transform: rotate(270deg); } 37.5% { -webkit-transform: rotate(405deg); transform: rotate(405deg); } 50% { -webkit-transform: rotate(540deg); transform: rotate(540deg); } 62.5% { -webkit-transform: rotate(675deg); transform: rotate(675deg); } 75% { -webkit-transform: rotate(810deg); transform: rotate(810deg); } 87.5% { -webkit-transform: rotate(945deg); transform: rotate(945deg); } 100% { -webkit-transform: rotate(1080deg); transform: rotate(1080deg); } } @keyframes md-progress-circle-sporadic-rotate { 12.5% { -webkit-transform: rotate(135deg); transform: rotate(135deg); } 25% { -webkit-transform: rotate(270deg); transform: rotate(270deg); } 37.5% { -webkit-transform: rotate(405deg); transform: rotate(405deg); } 50% { -webkit-transform: rotate(540deg); transform: rotate(540deg); } 62.5% { -webkit-transform: rotate(675deg); transform: rotate(675deg); } 75% { -webkit-transform: rotate(810deg); transform: rotate(810deg); } 87.5% { -webkit-transform: rotate(945deg); transform: rotate(945deg); } 100% { -webkit-transform: rotate(1080deg); transform: rotate(1080deg); } } "],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], MdProgressCircle);
    return MdProgressCircle;
}());
exports.MdProgressCircle = MdProgressCircle;
/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-circle> instance.
 */
var MdSpinner = (function (_super) {
    __extends(MdSpinner, _super);
    function MdSpinner(changeDetectorRef) {
        _super.call(this, changeDetectorRef);
        this.mode = 'indeterminate';
    }
    MdSpinner = __decorate([
        core_1.Component({            selector: 'md-spinner',
            host: {
                'role': 'progressbar',
                'mode': 'indeterminate',
            },
            template: "<!-- preserveAspectRatio of xMidYMid meet as the center of the viewport is the circle's center.  The center of the circle with remain at the center of the md-progress-circle element containing the SVG. --> <svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"> <path [attr.d]=\"currentPath\"></path> </svg> ",
            styles: ["/* Animation Durations */ /** Component sizing */ :host { display: block; /** Height and width are provided for md-progress-circle to act as a default. The height and width are expected to be overwritten by application css. */ height: 100px; width: 100px; /** SVG's viewBox is defined as 0 0 100 100, this means that all SVG children will placed based on a 100px by 100px box.  Additionally all SVG sizes and locations are in reference to this viewBox. */ } :host svg { height: 100%; width: 100%; -webkit-transform-origin: center; transform-origin: center; } :host path { fill: transparent; stroke: #00897b; /** Stroke width of 10px defines stroke as 10% of the viewBox */ stroke-width: 10px; } :host[color='accent'] path { stroke: #8e24aa; } :host[color='warn'] path { stroke: #e53935; } :host[mode='indeterminate'] { -webkit-animation-duration: 5250ms, 2887.5ms; animation-duration: 5250ms, 2887.5ms; -webkit-animation-name: md-progress-circle-sporadic-rotate, md-progress-circle-linear-rotate; animation-name: md-progress-circle-sporadic-rotate, md-progress-circle-linear-rotate; -webkit-animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1), linear; animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1), linear; -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite; -webkit-transition: none; transition: none; } /** Animations for indeterminate mode */ @-webkit-keyframes md-progress-circle-linear-rotate { 0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } } @keyframes md-progress-circle-linear-rotate { 0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } } @-webkit-keyframes md-progress-circle-sporadic-rotate { 12.5% { -webkit-transform: rotate(135deg); transform: rotate(135deg); } 25% { -webkit-transform: rotate(270deg); transform: rotate(270deg); } 37.5% { -webkit-transform: rotate(405deg); transform: rotate(405deg); } 50% { -webkit-transform: rotate(540deg); transform: rotate(540deg); } 62.5% { -webkit-transform: rotate(675deg); transform: rotate(675deg); } 75% { -webkit-transform: rotate(810deg); transform: rotate(810deg); } 87.5% { -webkit-transform: rotate(945deg); transform: rotate(945deg); } 100% { -webkit-transform: rotate(1080deg); transform: rotate(1080deg); } } @keyframes md-progress-circle-sporadic-rotate { 12.5% { -webkit-transform: rotate(135deg); transform: rotate(135deg); } 25% { -webkit-transform: rotate(270deg); transform: rotate(270deg); } 37.5% { -webkit-transform: rotate(405deg); transform: rotate(405deg); } 50% { -webkit-transform: rotate(540deg); transform: rotate(540deg); } 62.5% { -webkit-transform: rotate(675deg); transform: rotate(675deg); } 75% { -webkit-transform: rotate(810deg); transform: rotate(810deg); } 87.5% { -webkit-transform: rotate(945deg); transform: rotate(945deg); } 100% { -webkit-transform: rotate(1080deg); transform: rotate(1080deg); } } "],
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], MdSpinner);
    return MdSpinner;
}(MdProgressCircle));
exports.MdSpinner = MdSpinner;
/**
 * Module functions.
 */
/** Clamps a value to be between 0 and 100. */
function clamp(v) {
    return Math.max(0, Math.min(100, v));
}
/**
 * Converts Polar coordinates to Cartesian.
 */
function polarToCartesian(radius, pathRadius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
    return (radius + (pathRadius * Math.cos(angleInRadians))) +
        ',' + (radius + (pathRadius * Math.sin(angleInRadians)));
}
/**
 * Easing function for linear animation.
 */
function linearEase(currentTime, startValue, changeInValue, duration) {
    return changeInValue * currentTime / duration + startValue;
}
/**
 * Easing function to match material design indeterminate animation.
 */
function materialEase(currentTime, startValue, changeInValue, duration) {
    var time = currentTime / duration;
    var timeCubed = Math.pow(time, 3);
    var timeQuad = Math.pow(time, 4);
    var timeQuint = Math.pow(time, 5);
    return startValue + changeInValue * ((6 * timeQuint) + (-15 * timeQuad) + (10 * timeCubed));
}
/**
 * Determines the path value to define the arc.  Converting percentage values to to polar
 * coordinates on the circle, and then to cartesian coordinates in the viewport.
 *
 * @param currentValue The current percentage value of the progress circle, the percentage of the
 *    circle to fill.
 * @param rotation The starting point of the circle with 0 being the 0 degree point.
 * @return A string for an SVG path representing a circle filled from the starting point to the
 *    percentage value provided.
 */
function getSvgArc(currentValue, rotation) {
    // The angle can't be exactly 360, because the arc becomes hidden.
    var maximumAngle = 359.99 / 100;
    var startPoint = rotation || 0;
    var radius = 50;
    var pathRadius = 40;
    var startAngle = startPoint * maximumAngle;
    var endAngle = currentValue * maximumAngle;
    var start = polarToCartesian(radius, pathRadius, startAngle);
    var end = polarToCartesian(radius, pathRadius, endAngle + startAngle);
    var arcSweep = endAngle < 0 ? 0 : 1;
    var largeArcFlag;
    if (endAngle < 0) {
        largeArcFlag = endAngle >= -180 ? 0 : 1;
    }
    else {
        largeArcFlag = endAngle <= 180 ? 0 : 1;
    }
    return "M" + start + "A" + pathRadius + "," + pathRadius + " 0 " + largeArcFlag + "," + arcSweep + " " + end;
}
/** @deprecated */
exports.MD_PROGRESS_CIRCLE_DIRECTIVES = [MdProgressCircle, MdSpinner];
var MdProgressCircleModule = (function () {
    function MdProgressCircleModule() {
    }
    MdProgressCircleModule = __decorate([
        core_1.NgModule({
            exports: exports.MD_PROGRESS_CIRCLE_DIRECTIVES,
            declarations: exports.MD_PROGRESS_CIRCLE_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdProgressCircleModule);
    return MdProgressCircleModule;
}());
exports.MdProgressCircleModule = MdProgressCircleModule;
//# sourceMappingURL=progress-circle.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var unique_selection_dispatcher_1 = require('@angular2-material/core/coordination/unique-selection-dispatcher');
// Re-exports.
var unique_selection_dispatcher_2 = require('@angular2-material/core/coordination/unique-selection-dispatcher');
exports.MdUniqueSelectionDispatcher = unique_selection_dispatcher_2.MdUniqueSelectionDispatcher;
/**
 * Provider Expression that allows md-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 */
exports.MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MdRadioGroup; }),
    multi: true
};
// TODO(mtlin):
// Ink ripple is currently placeholder.
// Determine motion spec for button transitions.
// Design review.
// RTL
// Support forms API.
// Use ChangeDetectionStrategy.OnPush
var _uniqueIdCounter = 0;
/** A simple change event emitted by either MdRadioButton or MdRadioGroup. */
var MdRadioChange = (function () {
    function MdRadioChange() {
    }
    return MdRadioChange;
}());
exports.MdRadioChange = MdRadioChange;
var MdRadioGroup = (function () {
    function MdRadioGroup() {
        /**
         * Selected value for group. Should equal the value of the selected radio button if there *is*
         * a corresponding radio button with a matching value. If there is *not* such a corresponding
         * radio button, this value persists to be applied in case a new radio button is added with a
         * matching value.
         */
        this._value = null;
        /** The HTML name attribute applied to radio buttons in this group. */
        this._name = "md-radio-group-" + _uniqueIdCounter++;
        /** Disables all individual radio buttons assigned to this group. */
        this._disabled = false;
        /** The currently selected radio button. Should match value. */
        this._selected = null;
        /** Whether the `value` has been set to its initial value. */
        this._isInitialized = false;
        /** The method to be called in order to update ngModel */
        this._controlValueAccessorChangeFn = function (value) { };
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = function () { };
        /** Event emitted when the group value changes. */
        this.change = new core_1.EventEmitter();
        /** Child radio buttons. */
        this._radios = null;
    }
    Object.defineProperty(MdRadioGroup.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
            this._updateRadioButtonNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            if (this._value != newValue) {
                // Set this before proceeding to ensure no circular loop occurs with selection.
                this._value = newValue;
                this._updateSelectedRadioFromValue();
                // Only fire a change event if this isn't the first time the value is ever set.
                if (this._isInitialized) {
                    this._emitChangeEvent();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     * TODO: internal
     */
    MdRadioGroup.prototype.ngAfterContentInit = function () {
        // Mark this component as initialized in AfterContentInit because the initial value can
        // possibly be set by NgModel on MdRadioGroup, and it is possible that the OnInit of the
        // NgModel occurs *after* the OnInit of the MdRadioGroup.
        this._isInitialized = true;
    };
    /**
     * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
     * radio buttons upon their blur.
     */
    MdRadioGroup.prototype._touch = function () {
        if (this.onTouched) {
            this.onTouched();
        }
    };
    MdRadioGroup.prototype._updateRadioButtonNames = function () {
        var _this = this;
        (this._radios || []).forEach(function (radio) {
            radio.name = _this.name;
        });
    };
    /** Updates the `selected` radio button from the internal _value state. */
    MdRadioGroup.prototype._updateSelectedRadioFromValue = function () {
        var _this = this;
        // If the value already matches the selected radio, do nothing.
        var isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._radios != null && !isAlreadySelected) {
            var matchingRadio = this._radios.filter(function (radio) { return radio.value == _this._value; })[0];
            if (matchingRadio) {
                this.selected = matchingRadio;
            }
            else if (this.value == null) {
                this.selected = null;
                this._radios.forEach(function (radio) { radio.checked = false; });
            }
        }
    };
    /** Dispatch change event with current selection and group value. */
    MdRadioGroup.prototype._emitChangeEvent = function () {
        var event = new MdRadioChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this.change.emit(event);
    };
    /**
      * Implemented as part of ControlValueAccessor.
      * TODO: internal
      */
    MdRadioGroup.prototype.writeValue = function (value) {
        this.value = value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdRadioGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdRadioGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], MdRadioGroup.prototype, "change", void 0);
    __decorate([
        core_1.ContentChildren(core_1.forwardRef(function () { return MdRadioButton; })), 
        __metadata('design:type', core_1.QueryList)
    ], MdRadioGroup.prototype, "_radios", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdRadioGroup.prototype, "name", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioGroup.prototype, "align", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdRadioGroup.prototype, "disabled", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioGroup.prototype, "value", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioGroup.prototype, "selected", null);
    MdRadioGroup = __decorate([
        core_1.Directive({
            selector: 'md-radio-group',
            providers: [exports.MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
            host: {
                'role': 'radiogroup',
            },
        }), 
        __metadata('design:paramtypes', [])
    ], MdRadioGroup);
    return MdRadioGroup;
}());
exports.MdRadioGroup = MdRadioGroup;
var MdRadioButton = (function () {
    function MdRadioButton(radioGroup, radioDispatcher) {
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        var _this = this;
        this.radioDispatcher = radioDispatcher;
        /** Whether this radio is checked. */
        this._checked = false;
        /** The unique ID for the radio button. */
        this.id = "md-radio-" + _uniqueIdCounter++;
        /** Value assigned to this radio.*/
        this._value = null;
        /** Event emitted when the group value changes. */
        this.change = new core_1.EventEmitter();
        this.radioGroup = radioGroup;
        radioDispatcher.listen(function (id, name) {
            if (id != _this.id && name == _this.name) {
                _this.checked = false;
            }
        });
    }
    Object.defineProperty(MdRadioButton.prototype, "inputId", {
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (newCheckedState) {
            if (newCheckedState) {
                // Notify all radio buttons with the same name to un-check.
                this.radioDispatcher.notify(this.id, this.name);
            }
            this._checked = newCheckedState;
            if (newCheckedState && this.radioGroup && this.radioGroup.value != this.value) {
                this.radioGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "value", {
        /** MdRadioGroup reads this to assign its own value. */
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (this._value != value) {
                if (this.radioGroup != null && this.checked) {
                    this.radioGroup.value = value;
                }
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "align", {
        get: function () {
            return this._align || (this.radioGroup != null && this.radioGroup.align) || 'start';
        },
        set: function (value) {
            this._align = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "disabled", {
        get: function () {
            return this._disabled || (this.radioGroup != null && this.radioGroup.disabled);
        },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    /** TODO: internal */
    MdRadioButton.prototype.ngOnInit = function () {
        if (this.radioGroup) {
            // If the radio is inside a radio group, determine if it should be checked
            this.checked = this.radioGroup.value === this._value;
            // Copy name from parent radio group
            this.name = this.radioGroup.name;
        }
    };
    /** Dispatch change event with current value. */
    MdRadioButton.prototype._emitChangeEvent = function () {
        var event = new MdRadioChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    /**
     * We use a hidden native input field to handle changes to focus state via keyboard navigation,
     * with visual rendering done separately. The native element is kept in sync with the overall
     * state of the component.
     */
    MdRadioButton.prototype._onInputFocus = function () {
        this._isFocused = true;
    };
    /** TODO: internal */
    MdRadioButton.prototype._onInputBlur = function () {
        this._isFocused = false;
        if (this.radioGroup) {
            this.radioGroup._touch();
        }
    };
    /** TODO: internal */
    MdRadioButton.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `radio-button` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Triggered when the radio button received a click or the input recognized any change.
     * Clicking on a label element, will trigger a change event on the associated input.
     * TODO: internal
     */
    MdRadioButton.prototype._onInputChange = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        this.checked = true;
        this._emitChangeEvent();
        if (this.radioGroup) {
            this.radioGroup._touch();
        }
    };
    __decorate([
        core_1.HostBinding('class.md-radio-focused'), 
        __metadata('design:type', Boolean)
    ], MdRadioButton.prototype, "_isFocused", void 0);
    __decorate([
        core_1.HostBinding('id'),
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdRadioButton.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdRadioButton.prototype, "name", void 0);
    __decorate([
        core_1.Input('aria-label'), 
        __metadata('design:type', String)
    ], MdRadioButton.prototype, "ariaLabel", void 0);
    __decorate([
        core_1.Input('aria-labelledby'), 
        __metadata('design:type', String)
    ], MdRadioButton.prototype, "ariaLabelledby", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], MdRadioButton.prototype, "change", void 0);
    __decorate([
        core_1.HostBinding('class.md-radio-checked'),
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdRadioButton.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioButton.prototype, "value", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdRadioButton.prototype, "align", null);
    __decorate([
        core_1.HostBinding('class.md-radio-disabled'),
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MdRadioButton.prototype, "disabled", null);
    MdRadioButton = __decorate([
        core_1.Component({            selector: 'md-radio-button',
            template: "<!-- TODO(jelbourn): render the radio on either side of the content --> <!-- TODO(mtlin): Evaluate trade-offs of using native radio vs. cost of additional bindings. --> <label [attr.for]=\"inputId\" class=\"md-radio-label\"> <!-- The actual 'radio' part of the control. --> <div class=\"md-radio-container\"> <div class=\"md-radio-outer-circle\"></div> <div class=\"md-radio-inner-circle\"></div> <div class=\"md-ink-ripple\"></div> </div> <input #input class=\"md-radio-input\" type=\"radio\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInputChange($event)\" (focus)=\"_onInputFocus()\" (blur)=\"_onInputBlur()\" (click)=\"_onInputClick($event)\"> <!-- The label content for radio control. --> <div class=\"md-radio-label-content\" [class.md-radio-align-end]=\"align == 'end'\"> <ng-content></ng-content> </div> </label> ",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ md-radio-button { display: inline-block; } .md-radio-label { cursor: pointer; display: -webkit-inline-box; display: -ms-inline-flexbox; display: inline-flex; -webkit-box-align: baseline; -ms-flex-align: baseline; align-items: baseline; white-space: nowrap; } .md-radio-container { box-sizing: border-box; display: inline-block; height: 20px; position: relative; width: 20px; top: 2px; } .md-radio-outer-circle { border-color: rgba(0, 0, 0, 0.54); border: solid 2px; border-radius: 50%; box-sizing: border-box; height: 20px; left: 0; position: absolute; top: 0; -webkit-transition: border-color ease 280ms; transition: border-color ease 280ms; width: 20px; } .md-radio-checked .md-radio-outer-circle { border-color: #9c27b0; } .md-radio-disabled .md-radio-outer-circle { border-color: rgba(0, 0, 0, 0.38); } .md-radio-inner-circle { background-color: #9c27b0; border-radius: 50%; box-sizing: border-box; height: 20px; left: 0; position: absolute; top: 0; -webkit-transition: background-color ease 280ms, -webkit-transform ease 280ms; transition: background-color ease 280ms, -webkit-transform ease 280ms; transition: transform ease 280ms, background-color ease 280ms; transition: transform ease 280ms, background-color ease 280ms, -webkit-transform ease 280ms; -webkit-transform: scale(0); transform: scale(0); width: 20px; } .md-radio-checked .md-radio-inner-circle { -webkit-transform: scale(0.5); transform: scale(0.5); } .md-radio-disabled .md-radio-inner-circle { background-color: rgba(0, 0, 0, 0.38); } .md-radio-label-content { display: inline-block; -webkit-box-ordinal-group: 1; -ms-flex-order: 0; order: 0; line-height: inherit; padding-left: 8px; padding-right: 0; } [dir='rtl'] .md-radio-label-content { padding-right: 8px; padding-left: 0; } .md-radio-label-content.md-radio-align-end { -webkit-box-ordinal-group: 0; -ms-flex-order: -1; order: -1; padding-left: 0; padding-right: 8px; } [dir='rtl'] .md-radio-label-content.md-radio-align-end { padding-right: 0; padding-left: 8px; } .md-radio-input { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; text-transform: none; width: 1px; } .md-radio-disabled, .md-radio-disabled .md-radio-label { cursor: default; } .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } .md-radio-focused .md-ink-ripple { opacity: 1; background-color: rgba(156, 39, 176, 0.26); } .md-radio-disabled .md-ink-ripple { background-color: #000; } "],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [MdRadioGroup, unique_selection_dispatcher_1.MdUniqueSelectionDispatcher])
    ], MdRadioButton);
    return MdRadioButton;
}());
exports.MdRadioButton = MdRadioButton;
/** @deprecated */
exports.MD_RADIO_DIRECTIVES = [MdRadioGroup, MdRadioButton];
var MdRadioModule = (function () {
    function MdRadioModule() {
    }
    MdRadioModule = __decorate([
        core_1.NgModule({
            exports: exports.MD_RADIO_DIRECTIVES,
            declarations: exports.MD_RADIO_DIRECTIVES,
            providers: [unique_selection_dispatcher_1.MdUniqueSelectionDispatcher]
        }), 
        __metadata('design:paramtypes', [])
    ], MdRadioModule);
    return MdRadioModule;
}());
exports.MdRadioModule = MdRadioModule;
//# sourceMappingURL=radio.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var dir_1 = require('@angular2-material/core/rtl/dir');
var promise_completer_1 = require('@angular2-material/core/async/promise-completer');
var error_1 = require('@angular2-material/core/errors/error');
var field_value_1 = require('@angular2-material/core/annotations/field-value');
/** Exception thrown when two MdSidenav are matching the same side. */
var MdDuplicatedSidenavError = (function (_super) {
    __extends(MdDuplicatedSidenavError, _super);
    function MdDuplicatedSidenavError(align) {
        _super.call(this, "A sidenav was already declared for 'align=\"" + align + "\"'");
    }
    return MdDuplicatedSidenavError;
}(error_1.MdError));
exports.MdDuplicatedSidenavError = MdDuplicatedSidenavError;
/**
 * <md-sidenav> component.
 *
 * This component corresponds to the drawer of the sidenav.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MdSidenav = (function () {
    /**
     * @param _elementRef The DOM element reference. Used for transition and width calculation.
     *     If not available we do not hook on transitions.
     */
    function MdSidenav(_elementRef) {
        this._elementRef = _elementRef;
        /** Alignment of the sidenav (direction neutral); whether 'start' or 'end'. */
        this.align = 'start';
        /** Mode of the sidenav; whether 'over' or 'side'. */
        this.mode = 'over';
        /** Whether the sidenav is opened. */
        this._opened = false;
        /** Event emitted when the sidenav is being opened. Use this to synchronize animations. */
        this.onOpenStart = new core_1.EventEmitter();
        /** Event emitted when the sidenav is fully opened. */
        this.onOpen = new core_1.EventEmitter();
        /** Event emitted when the sidenav is being closed. Use this to synchronize animations. */
        this.onCloseStart = new core_1.EventEmitter();
        /** Event emitted when the sidenav is fully closed. */
        this.onClose = new core_1.EventEmitter();
        this._transition = false;
    }
    Object.defineProperty(MdSidenav.prototype, "opened", {
        /**
         * Whether the sidenav is opened. We overload this because we trigger an event when it
         * starts or end.
         */
        get: function () { return this._opened; },
        set: function (v) {
            this.toggle(v);
        },
        enumerable: true,
        configurable: true
    });
    /** Open this sidenav, and return a Promise that will resolve when it's fully opened (or get
     * rejected if it didn't). */
    MdSidenav.prototype.open = function () {
        return this.toggle(true);
    };
    /**
     * Close this sidenav, and return a Promise that will resolve when it's fully closed (or get
     * rejected if it didn't).
     */
    MdSidenav.prototype.close = function () {
        return this.toggle(false);
    };
    /**
     * Toggle this sidenav. This is equivalent to calling open() when it's already opened, or
     * close() when it's closed.
     * @param isOpen
     */
    MdSidenav.prototype.toggle = function (isOpen) {
        if (isOpen === void 0) { isOpen = !this.opened; }
        // Shortcut it if we're already opened.
        if (isOpen === this.opened) {
            if (!this._transition) {
                return Promise.resolve(null);
            }
            else {
                return isOpen ? this._openPromise : this._closePromise;
            }
        }
        this._opened = isOpen;
        this._transition = true;
        if (isOpen) {
            this.onOpenStart.emit(null);
        }
        else {
            this.onCloseStart.emit(null);
        }
        if (isOpen) {
            if (this._openPromise == null) {
                var completer = new promise_completer_1.PromiseCompleter();
                this._openPromise = completer.promise;
                this._openPromiseReject = completer.reject;
                this._openPromiseResolve = completer.resolve;
            }
            return this._openPromise;
        }
        else {
            if (this._closePromise == null) {
                var completer = new promise_completer_1.PromiseCompleter();
                this._closePromise = completer.promise;
                this._closePromiseReject = completer.reject;
                this._closePromiseResolve = completer.resolve;
            }
            return this._closePromise;
        }
    };
    /**
     * When transition has finished, set the internal state for classes and emit the proper event.
     * The event passed is actually of type TransitionEvent, but that type is not available in
     * Android so we use any.
     */
    MdSidenav.prototype._onTransitionEnd = function (transitionEvent) {
        if (transitionEvent.target == this._elementRef.nativeElement
            && transitionEvent.propertyName.endsWith('transform')) {
            this._transition = false;
            if (this._opened) {
                if (this._openPromise != null) {
                    this._openPromiseResolve();
                }
                if (this._closePromise != null) {
                    this._closePromiseReject();
                }
                this.onOpen.emit(null);
            }
            else {
                if (this._closePromise != null) {
                    this._closePromiseResolve();
                }
                if (this._openPromise != null) {
                    this._openPromiseReject();
                }
                this.onClose.emit(null);
            }
            this._openPromise = null;
            this._closePromise = null;
        }
    };
    Object.defineProperty(MdSidenav.prototype, "_isClosing", {
        get: function () {
            return !this._opened && this._transition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isOpening", {
        get: function () {
            return this._opened && this._transition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isClosed", {
        get: function () {
            return !this._opened && !this._transition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isOpened", {
        get: function () {
            return this._opened && !this._transition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isEnd", {
        get: function () {
            return this.align == 'end';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modeSide", {
        get: function () {
            return this.mode == 'side';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modeOver", {
        get: function () {
            return this.mode == 'over';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modePush", {
        get: function () {
            return this.mode == 'push';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_width", {
        /** TODO: internal (needed by MdSidenavLayout). */
        get: function () {
            if (this._elementRef.nativeElement) {
                return this._elementRef.nativeElement.offsetWidth;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "align", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "mode", void 0);
    __decorate([
        core_1.Input('opened'),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdSidenav.prototype, "_opened", void 0);
    __decorate([
        core_1.Output('open-start'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "onOpenStart", void 0);
    __decorate([
        core_1.Output('open'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "onOpen", void 0);
    __decorate([
        core_1.Output('close-start'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "onCloseStart", void 0);
    __decorate([
        core_1.Output('close'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "onClose", void 0);
    __decorate([
        core_1.HostBinding('class.md-sidenav-closing'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "_isClosing", null);
    __decorate([
        core_1.HostBinding('class.md-sidenav-opening'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "_isOpening", null);
    __decorate([
        core_1.HostBinding('class.md-sidenav-closed'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "_isClosed", null);
    __decorate([
        core_1.HostBinding('class.md-sidenav-opened'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "_isOpened", null);
    __decorate([
        core_1.HostBinding('class.md-sidenav-end'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "_isEnd", null);
    __decorate([
        core_1.HostBinding('class.md-sidenav-side'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "_modeSide", null);
    __decorate([
        core_1.HostBinding('class.md-sidenav-over'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "_modeOver", null);
    __decorate([
        core_1.HostBinding('class.md-sidenav-push'), 
        __metadata('design:type', Object)
    ], MdSidenav.prototype, "_modePush", null);
    MdSidenav = __decorate([
        core_1.Component({
            selector: 'md-sidenav',
            template: '<ng-content></ng-content>',
            host: {
                '(transitionend)': '_onTransitionEnd($event)',
            },
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], MdSidenav);
    return MdSidenav;
}());
exports.MdSidenav = MdSidenav;
/**
 * <md-sidenav-layout> component.
 *
 * This is the parent component to one or two <md-sidenav>s that validates the state internally
 * and coordinate the backdrop and content styling.
 */
var MdSidenavLayout = (function () {
    function MdSidenavLayout(_dir, _element, _renderer) {
        var _this = this;
        this._dir = _dir;
        this._element = _element;
        this._renderer = _renderer;
        // If a `Dir` directive exists up the tree, listen direction changes and update the left/right
        // properties to point to the proper start/end.
        if (_dir != null) {
            _dir.dirChange.subscribe(function () { return _this._validateDrawers(); });
        }
    }
    Object.defineProperty(MdSidenavLayout.prototype, "start", {
        get: function () { return this._start; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenavLayout.prototype, "end", {
        get: function () { return this._end; },
        enumerable: true,
        configurable: true
    });
    /** TODO: internal */
    MdSidenavLayout.prototype.ngAfterContentInit = function () {
        var _this = this;
        // On changes, assert on consistency.
        this._sidenavs.changes.subscribe(function () { return _this._validateDrawers(); });
        this._sidenavs.forEach(function (sidenav) { return _this._watchSidenavToggle(sidenav); });
        this._validateDrawers();
    };
    /*
    * Subscribes to sidenav events in order to set a class on the main layout element when the sidenav
    * is open and the backdrop is visible. This ensures any overflow on the layout element is properly
    * hidden.
    */
    MdSidenavLayout.prototype._watchSidenavToggle = function (sidenav) {
        var _this = this;
        if (!sidenav || sidenav.mode === 'side') {
            return;
        }
        sidenav.onOpen.subscribe(function () { return _this._setLayoutClass(sidenav, true); });
        sidenav.onClose.subscribe(function () { return _this._setLayoutClass(sidenav, false); });
    };
    /* Toggles the 'md-sidenav-opened' class on the main 'md-sidenav-layout' element. */
    MdSidenavLayout.prototype._setLayoutClass = function (sidenav, bool) {
        this._renderer.setElementClass(this._element.nativeElement, 'md-sidenav-opened', bool);
    };
    /** Validate the state of the sidenav children components. */
    MdSidenavLayout.prototype._validateDrawers = function () {
        var _this = this;
        this._start = this._end = null;
        // Ensure that we have at most one start and one end sidenav.
        this._sidenavs.forEach(function (sidenav) {
            if (sidenav.align == 'end') {
                if (_this._end != null) {
                    throw new MdDuplicatedSidenavError('end');
                }
                _this._end = sidenav;
            }
            else {
                if (_this._start != null) {
                    throw new MdDuplicatedSidenavError('start');
                }
                _this._start = sidenav;
            }
        });
        this._right = this._left = null;
        // Detect if we're LTR or RTL.
        if (this._dir == null || this._dir.value == 'ltr') {
            this._left = this._start;
            this._right = this._end;
        }
        else {
            this._left = this._end;
            this._right = this._start;
        }
    };
    MdSidenavLayout.prototype._closeModalSidenav = function () {
        if (this._start != null && this._start.mode != 'side') {
            this._start.close();
        }
        if (this._end != null && this._end.mode != 'side') {
            this._end.close();
        }
    };
    MdSidenavLayout.prototype._isShowingBackdrop = function () {
        return (this._isSidenavOpen(this._start) && this._start.mode != 'side')
            || (this._isSidenavOpen(this._end) && this._end.mode != 'side');
    };
    MdSidenavLayout.prototype._isSidenavOpen = function (side) {
        return side != null && side.opened;
    };
    /**
     * Return the width of the sidenav, if it's in the proper mode and opened.
     * This may relayout the view, so do not call this often.
     * @param sidenav
     * @param mode
     */
    MdSidenavLayout.prototype._getSidenavEffectiveWidth = function (sidenav, mode) {
        return (this._isSidenavOpen(sidenav) && sidenav.mode == mode) ? sidenav._width : 0;
    };
    MdSidenavLayout.prototype._getMarginLeft = function () {
        return this._getSidenavEffectiveWidth(this._left, 'side');
    };
    MdSidenavLayout.prototype._getMarginRight = function () {
        return this._getSidenavEffectiveWidth(this._right, 'side');
    };
    MdSidenavLayout.prototype._getPositionLeft = function () {
        return this._getSidenavEffectiveWidth(this._left, 'push');
    };
    MdSidenavLayout.prototype._getPositionRight = function () {
        return this._getSidenavEffectiveWidth(this._right, 'push');
    };
    /**
     * Returns the horizontal offset for the content area.  There should never be a value for both
     * left and right, so by subtracting the right value from the left value, we should always get
     * the appropriate offset.
     */
    MdSidenavLayout.prototype._getPositionOffset = function () {
        return this._getPositionLeft() - this._getPositionRight();
    };
    /**
     * This is using [ngStyle] rather than separate [style...] properties because [style.transform]
     * doesn't seem to work right now.
     */
    MdSidenavLayout.prototype._getStyles = function () {
        return {
            marginLeft: this._getMarginLeft() + "px",
            marginRight: this._getMarginRight() + "px",
            transform: "translate3d(" + this._getPositionOffset() + "px, 0, 0)"
        };
    };
    __decorate([
        core_1.ContentChildren(MdSidenav), 
        __metadata('design:type', core_1.QueryList)
    ], MdSidenavLayout.prototype, "_sidenavs", void 0);
    MdSidenavLayout = __decorate([
        core_1.Component({            selector: 'md-sidenav-layout',
            // Do not use ChangeDetectionStrategy.OnPush. It does not work for this component because
            // technically it is a sibling of MdSidenav (on the content tree) and isn't updated when MdSidenav
            // changes its state.
            template: "<div class=\"md-sidenav-backdrop\" (click)=\"_closeModalSidenav()\" [class.md-sidenav-shown]=\"_isShowingBackdrop()\"></div> <ng-content select=\"md-sidenav\"></ng-content> <md-content [ngStyle]=\"_getStyles()\"> <ng-content></ng-content> </md-content> ",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ /** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ /* This mixin ensures an element spans the whole viewport.*/ /** * Mixin to help with defining LTR/RTL 'transform: translate3d()' values. * @param $open The translation value when the sidenav is opened. * @param $close The translation value when the sidenav is closed. */ :host { position: relative; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); box-sizing: border-box; -webkit-overflow-scrolling: touch; display: block; overflow: hidden; } :host[fullscreen] { position: fixed; top: 0; left: 0; right: 0; bottom: 0; } :host[fullscreen].md-sidenav-opened { overflow: hidden; } :host > .md-sidenav-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: block; z-index: 2; visibility: hidden; } :host > .md-sidenav-backdrop.md-sidenav-shown { visibility: visible; background-color: rgba(0, 0, 0, 0.6); } :host > md-content { position: relative; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); display: block; height: 100%; overflow: auto; } :host > md-sidenav { position: relative; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); display: block; position: absolute; top: 0; bottom: 0; z-index: 3; min-width: 5%; overflow-y: auto; background-color: white; -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0); } :host > md-sidenav.md-sidenav-closed { visibility: hidden; } :host > md-sidenav.md-sidenav-closing { -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0); will-change: transform; } :host > md-sidenav.md-sidenav-opening { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); visibility: visible; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); will-change: transform; } :host > md-sidenav.md-sidenav-opened { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); } :host > md-sidenav.md-sidenav-push { background-color: white; } :host > md-sidenav.md-sidenav-side { z-index: 1; } :host > md-sidenav.md-sidenav-end { right: 0; -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); } :host > md-sidenav.md-sidenav-end.md-sidenav-closed { visibility: hidden; } :host > md-sidenav.md-sidenav-end.md-sidenav-closing { -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); will-change: transform; } :host > md-sidenav.md-sidenav-end.md-sidenav-opening { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); visibility: visible; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); will-change: transform; } :host > md-sidenav.md-sidenav-end.md-sidenav-opened { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); } :host-context([dir='rtl']) > md-sidenav { -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); } :host-context([dir='rtl']) > md-sidenav.md-sidenav-closed { visibility: hidden; } :host-context([dir='rtl']) > md-sidenav.md-sidenav-closing { -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); will-change: transform; } :host-context([dir='rtl']) > md-sidenav.md-sidenav-opening { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); visibility: visible; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); will-change: transform; } :host-context([dir='rtl']) > md-sidenav.md-sidenav-opened { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); } :host-context([dir='rtl']) > md-sidenav.md-sidenav-end { left: 0; right: auto; -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0); } :host-context([dir='rtl']) > md-sidenav.md-sidenav-end.md-sidenav-closed { visibility: hidden; } :host-context([dir='rtl']) > md-sidenav.md-sidenav-end.md-sidenav-closing { -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0); will-change: transform; } :host-context([dir='rtl']) > md-sidenav.md-sidenav-end.md-sidenav-opening { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); visibility: visible; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); will-change: transform; } :host-context([dir='rtl']) > md-sidenav.md-sidenav-end.md-sidenav-opened { box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); } ",
"/** * We separate transitions to be able to disable them in unit tests, by simply not loading this file. */ :host > .md-sidenav-backdrop.md-sidenav-shown { -webkit-transition: background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: background-color 400ms cubic-bezier(0.25, 0.8, 0.25, 1); } :host > md-content { -webkit-transition: -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); } :host > md-sidenav { -webkit-transition: -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); } "],
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [dir_1.Dir, core_1.ElementRef, core_1.Renderer])
    ], MdSidenavLayout);
    return MdSidenavLayout;
}());
exports.MdSidenavLayout = MdSidenavLayout;
/** @deprecated */
exports.MD_SIDENAV_DIRECTIVES = [MdSidenavLayout, MdSidenav];
var MdSidenavModule = (function () {
    function MdSidenavModule() {
    }
    MdSidenavModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            exports: exports.MD_SIDENAV_DIRECTIVES,
            declarations: exports.MD_SIDENAV_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdSidenavModule);
    return MdSidenavModule;
}());
exports.MdSidenavModule = MdSidenavModule;
//# sourceMappingURL=sidenav.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var field_value_1 = require('@angular2-material/core/annotations/field-value');
var Observable_1 = require('rxjs/Observable');
var apply_transform_1 = require('@angular2-material/core/style/apply-transform');
var core_2 = require('@angular2-material/core/core');
exports.MD_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MdSlideToggle; }),
    multi: true
};
// A simple change event emitted by the MdSlideToggle component.
var MdSlideToggleChange = (function () {
    function MdSlideToggleChange() {
    }
    return MdSlideToggleChange;
}());
exports.MdSlideToggleChange = MdSlideToggleChange;
// Increasing integer for generating unique ids for slide-toggle components.
var nextId = 0;
var MdSlideToggle = (function () {
    function MdSlideToggle(_elementRef, _renderer) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        // A unique id for the slide-toggle. By default the id is auto-generated.
        this._uniqueId = "md-slide-toggle-" + ++nextId;
        this._checked = false;
        this._hasFocus = false;
        this._isMousedown = false;
        this._slideRenderer = null;
        this.disabled = false;
        this.name = null;
        this.id = this._uniqueId;
        this.tabIndex = 0;
        this.ariaLabel = null;
        this.ariaLabelledby = null;
        this._change = new core_1.EventEmitter();
        this.change = this._change.asObservable();
        // Returns the unique id for the visual hidden input.
        this.getInputId = function () { return ((_this.id || _this._uniqueId) + "-input"); };
    }
    /** TODO: internal */
    MdSlideToggle.prototype.ngAfterContentInit = function () {
        this._slideRenderer = new SlideToggleRenderer(this._elementRef);
    };
    /**
     * The onChangeEvent method will be also called on click.
     * This is because everything for the slide-toggle is wrapped inside of a label,
     * which triggers a onChange event on click.
     */
    MdSlideToggle.prototype._onChangeEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        // Once a drag is currently in progress, we do not want to toggle the slide-toggle on a click.
        if (!this.disabled && !this._slideRenderer.isDragging()) {
            this.toggle();
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    MdSlideToggle.prototype._onInputClick = function (event) {
        this.onTouched();
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    MdSlideToggle.prototype._setMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this._isMousedown = true;
        setTimeout(function () { return _this._isMousedown = false; }, 100);
    };
    MdSlideToggle.prototype._onInputFocus = function () {
        // Only show the focus / ripple indicator when the focus was not triggered by a mouse
        // interaction on the component.
        if (!this._isMousedown) {
            this._hasFocus = true;
        }
    };
    MdSlideToggle.prototype._onInputBlur = function () {
        this._hasFocus = false;
        this.onTouched();
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlideToggle.prototype.writeValue = function (value) {
        this.checked = value;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlideToggle.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlideToggle.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    Object.defineProperty(MdSlideToggle.prototype, "checked", {
        get: function () {
            return !!this._checked;
        },
        set: function (value) {
            if (this.checked !== !!value) {
                this._checked = value;
                this.onChange(this._checked);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdSlideToggle.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    MdSlideToggle.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdSlideToggle.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    /** Emits the change event to the `change` output EventEmitter */
    MdSlideToggle.prototype._emitChangeEvent = function () {
        var event = new MdSlideToggleChange();
        event.source = this;
        event.checked = this.checked;
        this._change.emit(event);
    };
    /** TODO: internal */
    MdSlideToggle.prototype._onDragStart = function () {
        this._slideRenderer.startThumbDrag(this.checked);
    };
    /** TODO: internal */
    MdSlideToggle.prototype._onDrag = function (event) {
        this._slideRenderer.updateThumbPosition(event.deltaX);
    };
    /** TODO: internal */
    MdSlideToggle.prototype._onDragEnd = function () {
        var _this = this;
        // Notice that we have to stop outside of the current event handler,
        // because otherwise the click event will be fired and will reset the new checked variable.
        setTimeout(function () {
            _this.checked = _this._slideRenderer.stopThumbDrag();
        }, 0);
    };
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdSlideToggle.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MdSlideToggle.prototype, "tabIndex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "ariaLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "ariaLabelledby", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Observable_1.Observable)
    ], MdSlideToggle.prototype, "change", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MdSlideToggle.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "color", null);
    MdSlideToggle = __decorate([
        core_1.Component({            selector: 'md-slide-toggle',
            host: {
                '[class.md-checked]': 'checked',
                '[class.md-disabled]': 'disabled',
                // This md-slide-toggle prefix will change, once the temporary ripple is removed.
                '[class.md-slide-toggle-focused]': '_hasFocus',
                '(mousedown)': '_setMousedown()'
            },
            template: "<label class=\"md-slide-toggle-label\"> <div class=\"md-slide-toggle-container\"> <div class=\"md-slide-toggle-bar\"></div> <div class=\"md-slide-toggle-thumb-container\" (slidestart)=\"_onDragStart($event)\" (slide)=\"_onDrag($event)\" (slideend)=\"_onDragEnd($event)\"> <div class=\"md-slide-toggle-thumb\"> <div class=\"md-ink-ripple\"></div> </div> </div> <input #input class=\"md-slide-toggle-checkbox\" type=\"checkbox\" [id]=\"getInputId()\" [tabIndex]=\"tabIndex\" [checked]=\"checked\" [disabled]=\"disabled\" [attr.name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (blur)=\"_onInputBlur()\" (focus)=\"_onInputFocus()\" (change)=\"_onChangeEvent($event)\" (click)=\"_onInputClick($event)\"> </div> <span class=\"md-slide-toggle-content\"> <ng-content></ng-content> </span> </label> ",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ /** * A collection of mixins and CSS classes that can be used to apply elevation to a material * element. * See: https://www.google.com/design/spec/what-is-material/elevation-shadows.html * Examples: * * * .md-foo { *   @include $md-elevation(2); * *   &:active { *     @include $md-elevation(8); *   } * } * * <div id=\"external-card\" class=\"md-elevation-z2\"><p>Some content</p></div> * * For an explanation of the design behind how elevation is implemented, see the design doc at * https://goo.gl/Kq0k9Z. */ /** * The css property used for elevation. In most cases this should not be changed. It is exposed * as a variable for abstraction / easy use when needing to reference the property directly, for * example in a will-change rule. */ /** The default duration value for elevation transitions. */ /** The default easing value for elevation transitions. */ /** * Applies the correct css rules to an element to give it the elevation specified by $zValue. * The $zValue must be between 0 and 24. */ /** * Returns a string that can be used as the value for a transition property for elevation. * Calling this function directly is useful in situations where a component needs to transition * more than one property. * * .foo { *   transition: md-elevation-transition-property-value(), opacity 100ms ease; *   will-change: $md-elevation-property, opacity; * } */ /** * Applies the correct css rules needed to have an element transition between elevations. * This mixin should be applied to elements whose elevation values will change depending on their * context (e.g. when active or disabled). */ :host { display: -webkit-box; display: -ms-flexbox; display: flex; height: 24px; margin: 16px 0; line-height: 24px; white-space: nowrap; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; outline: none; } :host.md-checked .md-slide-toggle-thumb-container { -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); } :host.md-checked .md-slide-toggle-thumb { background-color: #9c27b0; } :host.md-checked .md-slide-toggle-bar { background-color: rgba(156, 39, 176, 0.5); } :host .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } :host.md-slide-toggle-focused .md-ink-ripple { opacity: 1; background-color: rgba(156, 39, 176, 0.26); } :host.md-slide-toggle-disabled .md-ink-ripple { background-color: #000; } :host.md-slide-toggle-focused:not(.md-checked) .md-ink-ripple { background-color: rgba(0, 0, 0, 0.12); } :host.md-primary.md-checked .md-slide-toggle-thumb { background-color: #009688; } :host.md-primary.md-checked .md-slide-toggle-bar { background-color: rgba(0, 150, 136, 0.5); } :host.md-primary .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } :host.md-primary.md-slide-toggle-focused .md-ink-ripple { opacity: 1; background-color: rgba(0, 150, 136, 0.26); } :host.md-primary.md-slide-toggle-disabled .md-ink-ripple { background-color: #000; } :host.md-primary.md-slide-toggle-focused:not(.md-checked) .md-ink-ripple { background-color: rgba(0, 0, 0, 0.12); } :host.md-warn.md-checked .md-slide-toggle-thumb { background-color: #f44336; } :host.md-warn.md-checked .md-slide-toggle-bar { background-color: rgba(244, 67, 54, 0.5); } :host.md-warn .md-ink-ripple { border-radius: 50%; opacity: 0; height: 48px; left: 50%; overflow: hidden; pointer-events: none; position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: opacity ease 280ms, background-color ease 280ms; transition: opacity ease 280ms, background-color ease 280ms; width: 48px; } :host.md-warn.md-slide-toggle-focused .md-ink-ripple { opacity: 1; background-color: rgba(244, 67, 54, 0.26); } :host.md-warn.md-slide-toggle-disabled .md-ink-ripple { background-color: #000; } :host.md-warn.md-slide-toggle-focused:not(.md-checked) .md-ink-ripple { background-color: rgba(0, 0, 0, 0.12); } :host.md-disabled .md-slide-toggle-label, :host.md-disabled .md-slide-toggle-container { cursor: default; } :host.md-disabled .md-slide-toggle-thumb { background-color: #bdbdbd; } :host.md-disabled .md-slide-toggle-bar { background-color: rgba(0, 0, 0, 0.12); } .md-slide-toggle-content { font-size: 14px; font-family: Roboto, \"Helvetica Neue\", sans-serif; font-weight: 500; } .md-slide-toggle-label { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-flex: 1; -ms-flex: 1; flex: 1; cursor: pointer; } .md-slide-toggle-container { cursor: -webkit-grab; cursor: grab; width: 36px; height: 24px; position: relative; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; margin-right: 8px; } .md-slide-toggle-thumb-container { position: absolute; top: 2px; left: 0; z-index: 1; width: 16px; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); -webkit-transition: all 80ms linear; transition: all 80ms linear; -webkit-transition-property: -webkit-transform; transition-property: -webkit-transform; transition-property: transform; transition-property: transform, -webkit-transform; } .md-slide-toggle-thumb-container.md-dragging { -webkit-transition-duration: 0ms; transition-duration: 0ms; } .md-slide-toggle-thumb { position: absolute; margin: 0; left: 0; top: 0; height: 20px; width: 20px; border-radius: 50%; background-color: #fafafa; box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12); } .md-slide-toggle-bar { position: absolute; left: 1px; top: 5px; width: 34px; height: 14px; background-color: #9e9e9e; border-radius: 8px; } .md-slide-toggle-checkbox { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; text-transform: none; width: 1px; } .md-slide-toggle-bar, .md-slide-toggle-thumb { -webkit-transition: all 80ms linear; transition: all 80ms linear; -webkit-transition-property: background-color; transition-property: background-color; -webkit-transition-delay: 50ms; transition-delay: 50ms; } "],
            providers: [exports.MD_SLIDE_TOGGLE_VALUE_ACCESSOR],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], MdSlideToggle);
    return MdSlideToggle;
}());
exports.MdSlideToggle = MdSlideToggle;
/**
 * Renderer for the Slide Toggle component, which separates DOM modification in its own class
 */
var SlideToggleRenderer = (function () {
    function SlideToggleRenderer(_elementRef) {
        this._elementRef = _elementRef;
        this._thumbEl = _elementRef.nativeElement.querySelector('.md-slide-toggle-thumb-container');
        this._thumbBarEl = _elementRef.nativeElement.querySelector('.md-slide-toggle-bar');
    }
    /** Whether the slide-toggle is currently dragging. */
    SlideToggleRenderer.prototype.isDragging = function () {
        return !!this._thumbBarWidth;
    };
    /** Initializes the drag of the slide-toggle. */
    SlideToggleRenderer.prototype.startThumbDrag = function (checked) {
        if (!this._thumbBarWidth) {
            this._thumbBarWidth = this._thumbBarEl.clientWidth - this._thumbEl.clientWidth;
            this._checked = checked;
            this._thumbEl.classList.add('md-dragging');
        }
    };
    /** Stops the current drag and returns the new checked value. */
    SlideToggleRenderer.prototype.stopThumbDrag = function () {
        if (this._thumbBarWidth) {
            this._thumbBarWidth = null;
            this._thumbEl.classList.remove('md-dragging');
            apply_transform_1.applyCssTransform(this._thumbEl, '');
            return this._percentage > 50;
        }
    };
    /** Updates the thumb containers position from the specified distance. */
    SlideToggleRenderer.prototype.updateThumbPosition = function (distance) {
        if (this._thumbBarWidth) {
            this._percentage = this._getThumbPercentage(distance);
            apply_transform_1.applyCssTransform(this._thumbEl, "translate3d(" + this._percentage + "%, 0, 0)");
        }
    };
    /** Retrieves the percentage of thumb from the moved distance. */
    SlideToggleRenderer.prototype._getThumbPercentage = function (distance) {
        var percentage = (distance / this._thumbBarWidth) * 100;
        // When the toggle was initially checked, then we have to start the drag at the end.
        if (this._checked) {
            percentage += 100;
        }
        return Math.max(0, Math.min(percentage, 100));
    };
    return SlideToggleRenderer;
}());
/** @deprecated */
exports.MD_SLIDE_TOGGLE_DIRECTIVES = [MdSlideToggle];
var MdSlideToggleModule = (function () {
    function MdSlideToggleModule() {
    }
    MdSlideToggleModule = __decorate([
        core_1.NgModule({
            imports: [forms_1.FormsModule],
            exports: exports.MD_SLIDE_TOGGLE_DIRECTIVES,
            declarations: exports.MD_SLIDE_TOGGLE_DIRECTIVES,
            providers: [
                { provide: platform_browser_1.HAMMER_GESTURE_CONFIG, useClass: core_2.MdGestureConfig },
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdSlideToggleModule);
    return MdSlideToggleModule;
}());
exports.MdSlideToggleModule = MdSlideToggleModule;
//# sourceMappingURL=slide-toggle.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var platform_browser_1 = require('@angular/platform-browser');
var field_value_1 = require('@angular2-material/core/annotations/field-value');
var apply_transform_1 = require('@angular2-material/core/style/apply-transform');
var core_2 = require('@angular2-material/core/core');
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
var MIN_AUTO_TICK_SEPARATION = 30;
/**
 * Provider Expression that allows md-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
exports.MD_SLIDER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MdSlider; }),
    multi: true
};
var MdSlider = (function () {
    function MdSlider(elementRef) {
        /** A renderer to handle updating the slider's thumb and fill track. */
        this._renderer = null;
        /** The dimensions of the slider. */
        this._sliderDimensions = null;
        this.disabled = false;
        /** Whether or not to show the thumb label. */
        this.thumbLabel = false;
        /** The miniumum value that the slider can have. */
        this._min = 0;
        /** The maximum value that the slider can have. */
        this._max = 100;
        /** The percentage of the slider that coincides with the value. */
        this._percent = 0;
        this._controlValueAccessorChangeFn = function (value) { };
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = function () { };
        /** The values at which the thumb will snap. */
        this.step = 1;
        /**
         * Whether or not the thumb is sliding.
         * Used to determine if there should be a transition for the thumb and fill track.
         * TODO: internal
         */
        this.isSliding = false;
        /**
         * Whether or not the slider is active (clicked or sliding).
         * Used to shrink and grow the thumb as according to the Material Design spec.
         * TODO: internal
         */
        this.isActive = false;
        /** Indicator for if the value has been set or not. */
        this._isInitialized = false;
        /** Value of the slider. */
        this._value = 0;
        this._renderer = new SliderRenderer(elementRef);
    }
    Object.defineProperty(MdSlider.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (v) {
            // This has to be forced as a number to handle the math later.
            this._min = Number(v);
            // If the value wasn't explicitly set by the user, set it to the min.
            if (!this._isInitialized) {
                this.value = this._min;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (v) {
            this._max = Number(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            // Only set the value to a valid number. v is casted to an any as we know it will come in as a
            // string but it is labeled as a number which causes parseFloat to not accept it.
            if (isNaN(parseFloat(v))) {
                return;
            }
            this._value = Number(v);
            this._isInitialized = true;
            this._controlValueAccessorChangeFn(this._value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Once the slider has rendered, grab the dimensions and update the position of the thumb and
     * fill track.
     * TODO: internal
     */
    MdSlider.prototype.ngAfterContentInit = function () {
        this._sliderDimensions = this._renderer.getSliderDimensions();
        // This needs to be called after content init because the value can be set to the min if the
        // value itself isn't set. If this happens, the control value accessor needs to be updated.
        this._controlValueAccessorChangeFn(this.value);
        this.snapThumbToValue();
        this._updateTickSeparation();
    };
    /** TODO: internal */
    MdSlider.prototype.onClick = function (event) {
        if (this.disabled) {
            return;
        }
        this.isActive = true;
        this.isSliding = false;
        this._renderer.addFocus();
        this.updateValueFromPosition(event.clientX);
        this.snapThumbToValue();
    };
    /** TODO: internal */
    MdSlider.prototype.onSlide = function (event) {
        if (this.disabled) {
            return;
        }
        // Prevent the slide from selecting anything else.
        event.preventDefault();
        this.updateValueFromPosition(event.center.x);
    };
    /** TODO: internal */
    MdSlider.prototype.onSlideStart = function (event) {
        if (this.disabled) {
            return;
        }
        event.preventDefault();
        this.isSliding = true;
        this.isActive = true;
        this._renderer.addFocus();
        this.updateValueFromPosition(event.center.x);
    };
    /** TODO: internal */
    MdSlider.prototype.onSlideEnd = function () {
        this.isSliding = false;
        this.snapThumbToValue();
    };
    /** TODO: internal */
    MdSlider.prototype.onResize = function () {
        this.isSliding = true;
        this._sliderDimensions = this._renderer.getSliderDimensions();
        // Skip updating the value and position as there is no new placement.
        this._renderer.updateThumbAndFillPosition(this._percent, this._sliderDimensions.width);
    };
    /** TODO: internal */
    MdSlider.prototype.onBlur = function () {
        this.isActive = false;
        this.onTouched();
    };
    /**
     * When the value changes without a physical position, the percentage needs to be recalculated
     * independent of the physical location.
     * This is also used to move the thumb to a snapped value once sliding is done.
     */
    MdSlider.prototype.updatePercentFromValue = function () {
        this._percent = this.calculatePercentage(this.value);
    };
    /**
     * Calculate the new value from the new physical location. The value will always be snapped.
     */
    MdSlider.prototype.updateValueFromPosition = function (pos) {
        var offset = this._sliderDimensions.left;
        var size = this._sliderDimensions.width;
        // The exact value is calculated from the event and used to find the closest snap value.
        this._percent = this.clamp((pos - offset) / size);
        var exactValue = this.calculateValue(this._percent);
        // This calculation finds the closest step by finding the closest whole number divisible by the
        // step relative to the min.
        var closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
        // The value needs to snap to the min and max.
        this.value = this.clamp(closestValue, this.min, this.max);
        this._renderer.updateThumbAndFillPosition(this._percent, this._sliderDimensions.width);
    };
    /**
     * Snaps the thumb to the current value.
     * Called after a click or drag event is over.
     */
    MdSlider.prototype.snapThumbToValue = function () {
        this.updatePercentFromValue();
        this._renderer.updateThumbAndFillPosition(this._percent, this._sliderDimensions.width);
    };
    /**
     * Calculates the separation in pixels of tick marks. If there is no tick interval or the interval
     * is set to something other than a number or 'auto', nothing happens.
     */
    MdSlider.prototype._updateTickSeparation = function () {
        if (this._tickInterval == 'auto') {
            this._updateAutoTickSeparation();
        }
        else if (Number(this._tickInterval)) {
            this._updateTickSeparationFromInterval();
        }
    };
    /**
     * Calculates the optimal separation in pixels of tick marks based on the minimum auto tick
     * separation constant.
     */
    MdSlider.prototype._updateAutoTickSeparation = function () {
        // We're looking for the multiple of step for which the separation between is greater than the
        // minimum tick separation.
        var sliderWidth = this._sliderDimensions.width;
        // This is the total "width" of the slider in terms of values.
        var valueWidth = this.max - this.min;
        // Calculate how many values exist within 1px on the slider.
        var valuePerPixel = valueWidth / sliderWidth;
        // Calculate how many values exist in the minimum tick separation (px).
        var valuePerSeparation = valuePerPixel * MIN_AUTO_TICK_SEPARATION;
        // Calculate how many steps exist in this separation. This will be the lowest value you can
        // multiply step by to get a separation that is greater than or equal to the minimum tick
        // separation.
        var stepsPerSeparation = Math.ceil(valuePerSeparation / this.step);
        // Get the percentage of the slider for which this tick would be located so we can then draw
        // it on the slider.
        var tickPercentage = this.calculatePercentage((this.step * stepsPerSeparation) + this.min);
        // The pixel value of the tick is the percentage * the width of the slider. Use this to draw
        // the ticks on the slider.
        this._renderer.drawTicks(sliderWidth * tickPercentage);
    };
    /**
     * Calculates the separation of tick marks by finding the pixel value of the tickInterval.
     */
    MdSlider.prototype._updateTickSeparationFromInterval = function () {
        // Force tickInterval to be a number so it can be used in calculations.
        var interval = this._tickInterval;
        // Calculate the first value a tick will be located at by getting the step at which the interval
        // lands and adding that to the min.
        var tickValue = (this.step * interval) + this.min;
        // The percentage of the step on the slider is needed in order to calculate the pixel offset
        // from the beginning of the slider. This offset is the tick separation.
        var tickPercentage = this.calculatePercentage(tickValue);
        this._renderer.drawTicks(this._sliderDimensions.width * tickPercentage);
    };
    /**
     * Calculates the percentage of the slider that a value is.
     */
    MdSlider.prototype.calculatePercentage = function (value) {
        return (value - this.min) / (this.max - this.min);
    };
    /**
     * Calculates the value a percentage of the slider corresponds to.
     */
    MdSlider.prototype.calculateValue = function (percentage) {
        return this.min + (percentage * (this.max - this.min));
    };
    /**
     * Return a number between two numbers.
     */
    MdSlider.prototype.clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return Math.max(min, Math.min(value, max));
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlider.prototype.writeValue = function (value) {
        this.value = value;
        if (this._sliderDimensions) {
            this.snapThumbToValue();
        }
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlider.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /**
     * Implemented as part of ControlValueAccessor.
     * TODO: internal
     */
    MdSlider.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    __decorate([
        core_1.Input(),
        field_value_1.BooleanFieldValue(),
        core_1.HostBinding('class.md-slider-disabled'),
        core_1.HostBinding('attr.aria-disabled'), 
        __metadata('design:type', Boolean)
    ], MdSlider.prototype, "disabled", void 0);
    __decorate([
        core_1.Input('thumb-label'),
        field_value_1.BooleanFieldValue(), 
        __metadata('design:type', Boolean)
    ], MdSlider.prototype, "thumbLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MdSlider.prototype, "step", void 0);
    __decorate([
        core_1.Input('tick-interval'), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "_tickInterval", void 0);
    __decorate([
        core_1.Input(),
        core_1.HostBinding('attr.aria-valuemin'), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "min", null);
    __decorate([
        core_1.Input(),
        core_1.HostBinding('attr.aria-valuemax'), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "max", null);
    __decorate([
        core_1.Input(),
        core_1.HostBinding('attr.aria-valuenow'), 
        __metadata('design:type', Object)
    ], MdSlider.prototype, "value", null);
    MdSlider = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'md-slider',
            providers: [exports.MD_SLIDER_VALUE_ACCESSOR],
            host: {
                'tabindex': '0',
                '(click)': 'onClick($event)',
                '(slide)': 'onSlide($event)',
                '(slidestart)': 'onSlideStart($event)',
                '(slideend)': 'onSlideEnd()',
                '(window:resize)': 'onResize()',
                '(blur)': 'onBlur()',
            },
            template: "<div class=\"md-slider-wrapper\"> <div class=\"md-slider-container\" [class.md-slider-sliding]=\"isSliding\" [class.md-slider-active]=\"isActive\" [class.md-slider-thumb-label-showing]=\"thumbLabel\"> <div class=\"md-slider-track-container\"> <div class=\"md-slider-track\"></div> <div class=\"md-slider-track md-slider-track-fill\"></div> <div class=\"md-slider-tick-container\"></div> <div class=\"md-slider-last-tick-container\"></div> </div> <div class=\"md-slider-thumb-container\"> <div class=\"md-slider-thumb-position\"> <div class=\"md-slider-thumb\"></div> <div class=\"md-slider-thumb-label\"> <span class=\"md-slider-thumb-label-text\">{{value}}</span> </div> </div> </div> </div> </div> ",
            styles: ["/** * Uses a container height and an item height to center an item vertically within the container. */ /** * Positions the thumb based on its width and height. */ md-slider { height: 48px; min-width: 128px; position: relative; padding: 0; display: inline-block; outline: none; vertical-align: middle; } md-slider *, md-slider *::after { box-sizing: border-box; } /** * Exists in order to pad the slider and keep everything positioned correctly. * Cannot be merged with the .md-slider-container. */ .md-slider-wrapper { width: 100%; height: 100%; padding-left: 8px; padding-right: 8px; } /** * Holds the isActive and isSliding classes as well as helps with positioning the children. * Cannot be merged with .md-slider-wrapper. */ .md-slider-container { position: relative; } .md-slider-track-container { width: 100%; position: absolute; top: 23px; height: 2px; } .md-slider-track { position: absolute; left: 0; right: 0; height: 100%; background-color: rgba(0, 0, 0, 0.26); } .md-slider-track-fill { transition-duration: 400ms; transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1); transition-property: width, height; background-color: #9c27b0; } .md-slider-tick-container, .md-slider-last-tick-container { position: absolute; left: 0; right: 0; height: 100%; } .md-slider-thumb-container { position: absolute; left: 0; top: 50%; transform: translate3d(-50%, -50%, 0); transition-duration: 400ms; transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1); transition-property: left, bottom; } .md-slider-thumb-position { transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); } .md-slider-thumb { z-index: 1; position: absolute; top: 14px; left: -10px; width: 20px; height: 20px; border-radius: 20px; transform: scale(0.7); transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1); } .md-slider-thumb::after { content: ''; position: absolute; width: 20px; height: 20px; border-radius: 20px; border-width: 3px; border-style: solid; transition: inherit; background-color: #9c27b0; border-color: #9c27b0; } .md-slider-thumb-label { display: flex; align-items: center; justify-content: center; position: absolute; left: -14px; top: -17px; width: 28px; height: 28px; border-radius: 50%; transform: scale(0.4) translate3d(0, 67.5px, 0) rotate(45deg); transition: 300ms cubic-bezier(0.35, 0, 0.25, 1); transition-property: transform, border-radius; background-color: #9c27b0; } .md-slider-thumb-label-text { z-index: 1; font-size: 12px; font-weight: bold; opacity: 0; transform: rotate(-45deg); transition: opacity 300ms cubic-bezier(0.35, 0, 0.25, 1); color: white; } .md-slider-container:not(.md-slider-thumb-label-showing) .md-slider-thumb-label { display: none; } .md-slider-active.md-slider-thumb-label-showing .md-slider-thumb { transform: scale(0); } .md-slider-sliding .md-slider-thumb-position, .md-slider-sliding .md-slider-track-fill { transition: none; cursor: default; } .md-slider-active .md-slider-thumb { transform: scale(1); } .md-slider-active .md-slider-thumb-label { border-radius: 50% 50% 0; transform: rotate(45deg); } .md-slider-active .md-slider-thumb-label-text { opacity: 1; } /*# sourceMappingURL=slider.css.map */ "],
            encapsulation: core_1.ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], MdSlider);
    return MdSlider;
}());
exports.MdSlider = MdSlider;
/**
 * Renderer class in order to keep all dom manipulation in one place and outside of the main class.
 */
var SliderRenderer = (function () {
    function SliderRenderer(elementRef) {
        this._sliderElement = elementRef.nativeElement;
    }
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    SliderRenderer.prototype.getSliderDimensions = function () {
        var trackElement = this._sliderElement.querySelector('.md-slider-track');
        return trackElement.getBoundingClientRect();
    };
    /**
     * Update the physical position of the thumb and fill track on the slider.
     */
    SliderRenderer.prototype.updateThumbAndFillPosition = function (percent, width) {
        // A container element that is used to avoid overwriting the transform on the thumb itself.
        var thumbPositionElement = this._sliderElement.querySelector('.md-slider-thumb-position');
        var fillTrackElement = this._sliderElement.querySelector('.md-slider-track-fill');
        var position = Math.round(percent * width);
        fillTrackElement.style.width = position + "px";
        apply_transform_1.applyCssTransform(thumbPositionElement, "translateX(" + position + "px)");
    };
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    SliderRenderer.prototype.addFocus = function () {
        this._sliderElement.focus();
    };
    /**
     * Draws ticks onto the tick container.
     */
    SliderRenderer.prototype.drawTicks = function (tickSeparation) {
        var tickContainer = this._sliderElement.querySelector('.md-slider-tick-container');
        var tickContainerWidth = tickContainer.getBoundingClientRect().width;
        // An extra element for the last tick is needed because the linear gradient cannot be told to
        // always draw a tick at the end of the gradient. To get around this, there is a second
        // container for ticks that has a single tick mark on the very right edge.
        var lastTickContainer = this._sliderElement.querySelector('.md-slider-last-tick-container');
        // Subtract 1 from the tick separation to center the tick.
        // TODO: Evaluate the rendering performance of using repeating background gradients.
        tickContainer.style.background = "repeating-linear-gradient(to right, black, black 2px, " +
            ("transparent 2px, transparent " + (tickSeparation - 1) + "px)");
        // Add a tick to the very end by starting on the right side and adding a 2px black line.
        lastTickContainer.style.background = "linear-gradient(to left, black, black 2px, transparent " +
            "2px, transparent)";
        // If the second to last tick is too close (a separation of less than half the normal
        // separation), don't show it by decreasing the width of the tick container element.
        if (tickContainerWidth % tickSeparation < (tickSeparation / 2)) {
            tickContainer.style.width = tickContainerWidth - tickSeparation + 'px';
        }
    };
    return SliderRenderer;
}());
exports.SliderRenderer = SliderRenderer;
/** @deprecated */
exports.MD_SLIDER_DIRECTIVES = [MdSlider];
var MdSliderModule = (function () {
    function MdSliderModule() {
    }
    MdSliderModule = __decorate([
        core_1.NgModule({
            imports: [forms_1.FormsModule],
            exports: exports.MD_SLIDER_DIRECTIVES,
            declarations: exports.MD_SLIDER_DIRECTIVES,
            providers: [
                { provide: platform_browser_1.HAMMER_GESTURE_CONFIG, useClass: core_2.MdGestureConfig },
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdSliderModule);
    return MdSliderModule;
}());
exports.MdSliderModule = MdSliderModule;

//# sourceMappingURL=slider.js.map

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var MdGestureConfig_1 = require('@angular2-material/core/gestures/MdGestureConfig');
/**
 * An extension of MdGestureConfig that exposes the underlying HammerManager instances.
 * Tests can use these instances to emit fake gesture events.
 */
var TestGestureConfig = (function (_super) {
    __extends(TestGestureConfig, _super);
    function TestGestureConfig() {
        _super.apply(this, arguments);
        /**
         * A map of Hammer instances to element.
         * Used to emit events over instances for an element.
         */
        this.hammerInstances = new Map();
    }
    /**
     * Create a mapping of Hammer instances to element so that events can be emitted during testing.
     */
    TestGestureConfig.prototype.buildHammer = function (element) {
        var mc = _super.prototype.buildHammer.call(this, element);
        if (this.hammerInstances.get(element)) {
            this.hammerInstances.get(element).push(mc);
        }
        else {
            this.hammerInstances.set(element, [mc]);
        }
        return mc;
    };
    /**
     * The Angular event plugin for Hammer creates a new HammerManager instance for each listener,
     * so we need to apply our event on all instances to hit the correct listener.
     */
    TestGestureConfig.prototype.emitEventForElement = function (eventType, element, eventData) {
        var instances = this.hammerInstances.get(element);
        instances.forEach(function (instance) { return instance.emit(eventType, eventData); });
    };
    TestGestureConfig = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TestGestureConfig);
    return TestGestureConfig;
}(MdGestureConfig_1.MdGestureConfig));
exports.TestGestureConfig = TestGestureConfig;

//# sourceMappingURL=test-gesture-config.js.map

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/** The ink-bar is used to display and animate the line underneath the current active tab label. */
var MdInkBar = (function () {
    function MdInkBar(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    /**
     * Calculates the styles from the provided element in order to align the ink-bar to that element.
     * @param element
     */
    MdInkBar.prototype.alignToElement = function (element) {
        this._renderer.setElementStyle(this._elementRef.nativeElement, 'left', this._getLeftPosition(element));
        this._renderer.setElementStyle(this._elementRef.nativeElement, 'width', this._getElementWidth(element));
    };
    /**
     * Generates the pixel distance from the left based on the provided element in string format.
     * @param element
     * @returns {string}
     */
    MdInkBar.prototype._getLeftPosition = function (element) {
        return element ? element.offsetLeft + 'px' : '0';
    };
    /**
     * Generates the pixel width from the provided element in string format.
     * @param element
     * @returns {string}
     */
    MdInkBar.prototype._getElementWidth = function (element) {
        return element ? element.offsetWidth + 'px' : '0';
    };
    MdInkBar = __decorate([
        core_1.Directive({
            selector: 'md-ink-bar',
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], MdInkBar);
    return MdInkBar;
}());
exports.MdInkBar = MdInkBar;
//# sourceMappingURL=ink-bar.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var portal_directives_1 = require('@angular2-material/core/portal/portal-directives');
/** Used to flag tab contents for use with the portal directive */
var MdTabContent = (function (_super) {
    __extends(MdTabContent, _super);
    function MdTabContent(templateRef, viewContainerRef) {
        _super.call(this, templateRef, viewContainerRef);
    }
    MdTabContent = __decorate([
        core_1.Directive({
            selector: '[md-tab-content]'
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef])
    ], MdTabContent);
    return MdTabContent;
}(portal_directives_1.TemplatePortalDirective));
exports.MdTabContent = MdTabContent;
//# sourceMappingURL=tab-content.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/** Used in the `md-tab-group` view to display tab labels */
var MdTabLabelWrapper = (function () {
    function MdTabLabelWrapper(elementRef) {
        this.elementRef = elementRef;
    }
    /**
     * Sets focus on the wrapper element
     */
    MdTabLabelWrapper.prototype.focus = function () {
        this.elementRef.nativeElement.focus();
    };
    MdTabLabelWrapper = __decorate([
        core_1.Directive({
            selector: '[md-tab-label-wrapper]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], MdTabLabelWrapper);
    return MdTabLabelWrapper;
}());
exports.MdTabLabelWrapper = MdTabLabelWrapper;
//# sourceMappingURL=tab-label-wrapper.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var portal_directives_1 = require('@angular2-material/core/portal/portal-directives');
/** Used to flag tab labels for use with the portal directive */
var MdTabLabel = (function (_super) {
    __extends(MdTabLabel, _super);
    function MdTabLabel(templateRef, viewContainerRef) {
        _super.call(this, templateRef, viewContainerRef);
    }
    MdTabLabel = __decorate([
        core_1.Directive({
            selector: '[md-tab-label]',
        }), 
        __metadata('design:paramtypes', [core_1.TemplateRef, core_1.ViewContainerRef])
    ], MdTabLabel);
    return MdTabLabel;
}(portal_directives_1.TemplatePortalDirective));
exports.MdTabLabel = MdTabLabel;
//# sourceMappingURL=tab-label.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var portal_directives_1 = require('@angular2-material/core/portal/portal-directives');
var tab_label_1 = require('./tab-label');
var tab_content_1 = require('./tab-content');
var tab_label_wrapper_1 = require('./tab-label-wrapper');
var ink_bar_1 = require('./ink-bar');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/map');
// Due to a bug in the ChromeDriver, Angular 2 keyboard events are not triggered by `sendKeys`
// during E2E tests when using dot notation such as `(keydown.rightArrow)`. To get around this,
// we are temporarily using a single (keydown) handler.
// See: https://github.com/angular/angular/issues/9419
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var ENTER = 13;
/** Used to generate unique ID's for each tab component */
var nextId = 0;
/** A simple change event emitted on focus or selection changes. */
var MdTabChangeEvent = (function () {
    function MdTabChangeEvent() {
    }
    return MdTabChangeEvent;
}());
exports.MdTabChangeEvent = MdTabChangeEvent;
var MdTab = (function () {
    function MdTab() {
    }
    __decorate([
        core_1.ContentChild(tab_label_1.MdTabLabel), 
        __metadata('design:type', tab_label_1.MdTabLabel)
    ], MdTab.prototype, "label", void 0);
    __decorate([
        core_1.ContentChild(tab_content_1.MdTabContent), 
        __metadata('design:type', tab_content_1.MdTabContent)
    ], MdTab.prototype, "content", void 0);
    MdTab = __decorate([
        core_1.Directive({
            selector: 'md-tab'
        }), 
        __metadata('design:paramtypes', [])
    ], MdTab);
    return MdTab;
}());
exports.MdTab = MdTab;
/**
 * Material design tab-group component.  Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://www.google.com/design/spec/components/tabs.html
 */
var MdTabGroup = (function () {
    function MdTabGroup(_zone) {
        this._zone = _zone;
        this._isInitialized = false;
        this._selectedIndex = 0;
        this._onFocusChange = new core_1.EventEmitter();
        this._onSelectChange = new core_1.EventEmitter();
        this._focusIndex = 0;
        this._groupId = nextId++;
    }
    Object.defineProperty(MdTabGroup.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        set: function (value) {
            if (value != this._selectedIndex) {
                this._selectedIndex = value;
                if (this._isInitialized) {
                    this._onSelectChange.emit(this._createChangeEvent(value));
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "_selectedIndexChange", {
        /** Output to enable support for two-way binding on `selectedIndex`. */
        get: function () {
            return this.selectChange.map(function (event) { return event.index; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "focusChange", {
        get: function () {
            return this._onFocusChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectChange", {
        get: function () {
            return this._onSelectChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Waits one frame for the view to update, then upates the ink bar
     * Note: This must be run outside of the zone or it will create an infinite change detection loop
     * TODO: internal
     */
    MdTabGroup.prototype.ngAfterViewChecked = function () {
        var _this = this;
        this._zone.runOutsideAngular(function () {
            window.requestAnimationFrame(function () {
                _this._updateInkBar();
            });
        });
        this._isInitialized = true;
    };
    /** Tells the ink-bar to align itself to the current label wrapper */
    MdTabGroup.prototype._updateInkBar = function () {
        this._inkBar.toArray()[0].alignToElement(this._currentLabelWrapper);
    };
    Object.defineProperty(MdTabGroup.prototype, "_currentLabelWrapper", {
        /**
         * Reference to the current label wrapper; defaults to null for initial render before the
         * ViewChildren references are ready.
         */
        get: function () {
            return this._labelWrappers && this._labelWrappers.length
                ? this._labelWrappers.toArray()[this.selectedIndex].elementRef.nativeElement
                : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "focusIndex", {
        /** Tracks which element has focus; used for keyboard navigation */
        get: function () {
            return this._focusIndex;
        },
        /** When the focus index is set, we must manually send focus to the correct label */
        set: function (value) {
            this._focusIndex = value;
            if (this._isInitialized) {
                this._onFocusChange.emit(this._createChangeEvent(value));
            }
            if (this._labelWrappers && this._labelWrappers.length) {
                this._labelWrappers.toArray()[value].focus();
            }
        },
        enumerable: true,
        configurable: true
    });
    MdTabGroup.prototype._createChangeEvent = function (index) {
        var event = new MdTabChangeEvent;
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    };
    /** Returns a unique id for each tab label element */
    MdTabGroup.prototype._getTabLabelId = function (i) {
        return "md-tab-label-" + this._groupId + "-" + i;
    };
    /** Returns a unique id for each tab content element */
    MdTabGroup.prototype._getTabContentId = function (i) {
        return "md-tab-content-" + this._groupId + "-" + i;
    };
    MdTabGroup.prototype.handleKeydown = function (event) {
        switch (event.keyCode) {
            case RIGHT_ARROW:
                this.focusNextTab();
                break;
            case LEFT_ARROW:
                this.focusPreviousTab();
                break;
            case ENTER:
                this.selectedIndex = this.focusIndex;
                break;
        }
    };
    /** Increment the focus index by 1; prevent going over the number of tabs */
    MdTabGroup.prototype.focusNextTab = function () {
        if (this._labelWrappers && this.focusIndex < this._labelWrappers.length - 1) {
            this.focusIndex++;
        }
    };
    /** Decrement the focus index by 1; prevent going below 0 */
    MdTabGroup.prototype.focusPreviousTab = function () {
        if (this.focusIndex > 0) {
            this.focusIndex--;
        }
    };
    __decorate([
        core_1.ContentChildren(MdTab), 
        __metadata('design:type', core_1.QueryList)
    ], MdTabGroup.prototype, "_tabs", void 0);
    __decorate([
        core_1.ViewChildren(tab_label_wrapper_1.MdTabLabelWrapper), 
        __metadata('design:type', core_1.QueryList)
    ], MdTabGroup.prototype, "_labelWrappers", void 0);
    __decorate([
        core_1.ViewChildren(ink_bar_1.MdInkBar), 
        __metadata('design:type', core_1.QueryList)
    ], MdTabGroup.prototype, "_inkBar", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], MdTabGroup.prototype, "selectedIndex", null);
    __decorate([
        core_1.Output('selectedIndexChange'), 
        __metadata('design:type', Observable_1.Observable)
    ], MdTabGroup.prototype, "_selectedIndexChange", null);
    __decorate([
        core_1.Output('focusChange'), 
        __metadata('design:type', Observable_1.Observable)
    ], MdTabGroup.prototype, "focusChange", null);
    __decorate([
        core_1.Output('selectChange'), 
        __metadata('design:type', Observable_1.Observable)
    ], MdTabGroup.prototype, "selectChange", null);
    MdTabGroup = __decorate([
        core_1.Component({            selector: 'md-tab-group',
            template: "<div class=\"md-tab-header\" role=\"tablist\" (keydown)=\"handleKeydown($event)\"> <div class=\"md-tab-label\" role=\"tab\" md-tab-label-wrapper *ngFor=\"let tab of _tabs; let i = index\" [id]=\"_getTabLabelId(i)\" [tabIndex]=\"selectedIndex == i ? 0 : -1\" [attr.aria-controls]=\"_getTabContentId(i)\" [attr.aria-selected]=\"selectedIndex == i\" [class.md-active]=\"selectedIndex == i\" (click)=\"focusIndex = selectedIndex = i\"> <template [portalHost]=\"tab.label\"></template> </div> <md-ink-bar></md-ink-bar> </div> <div class=\"md-tab-body-wrapper\"> <div class=\"md-tab-body\" role=\"tabpanel\" *ngFor=\"let tab of _tabs; let i = index\" [id]=\"_getTabContentId(i)\" [class.md-active]=\"selectedIndex == i\" [attr.aria-labelledby]=\"_getTabLabelId(i)\"> <template [ngIf]=\"selectedIndex == i\"> <template [portalHost]=\"tab.content\"></template> </template> </div> </div> ",
            styles: [":host { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; font-family: Roboto, \"Helvetica Neue\", sans-serif; } /** The top section of the view; contains the tab labels */ .md-tab-header { overflow: hidden; position: relative; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; border-bottom: 1px solid #e0e0e0; -ms-flex-negative: 0; flex-shrink: 0; } /** Wraps each tab label */ .md-tab-label { line-height: 48px; height: 48px; padding: 0 12px; font-size: 14px; font-family: Roboto, \"Helvetica Neue\", sans-serif; font-weight: 500; cursor: pointer; box-sizing: border-box; color: currentColor; opacity: 0.6; min-width: 160px; text-align: center; } .md-tab-label:focus { outline: none; opacity: 1; background-color: rgba(178, 223, 219, 0.3); } /** The bottom section of the view; contains the tab bodies */ .md-tab-body-wrapper { position: relative; overflow: hidden; -webkit-box-flex: 1; -ms-flex-positive: 1; flex-grow: 1; display: -webkit-box; display: -ms-flexbox; display: flex; } /** Wraps each tab body */ .md-tab-body { display: none; overflow: auto; box-sizing: border-box; -webkit-box-flex: 1; -ms-flex-positive: 1; flex-grow: 1; -ms-flex-negative: 1; flex-shrink: 1; } .md-tab-body.md-active { display: block; } /** The colored bar that underlines the active tab */ md-ink-bar { position: absolute; bottom: 0; height: 2px; background-color: #009688; -webkit-transition: 350ms ease-out; transition: 350ms ease-out; } "],
        }), 
        __metadata('design:paramtypes', [core_1.NgZone])
    ], MdTabGroup);
    return MdTabGroup;
}());
exports.MdTabGroup = MdTabGroup;
/** @deprecated */
exports.MD_TABS_DIRECTIVES = [MdTabGroup, tab_label_1.MdTabLabel, tab_content_1.MdTabContent, MdTab];
exports.TABS_INTERNAL_DIRECTIVES = [ink_bar_1.MdInkBar, tab_label_wrapper_1.MdTabLabelWrapper];
var MdTabsModule = (function () {
    function MdTabsModule() {
    }
    MdTabsModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, portal_directives_1.PortalModule],
            exports: [exports.MD_TABS_DIRECTIVES],
            declarations: [exports.MD_TABS_DIRECTIVES, exports.TABS_INTERNAL_DIRECTIVES],
        }), 
        __metadata('design:paramtypes', [])
    ], MdTabsModule);
    return MdTabsModule;
}());
exports.MdTabsModule = MdTabsModule;
//# sourceMappingURL=tabs.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var core_3 = require('@angular/core');
var MdToolbar = (function () {
    function MdToolbar(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    Object.defineProperty(MdToolbar.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdToolbar.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdToolbar.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this.renderer.setElementClass(this.elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MdToolbar.prototype, "color", null);
    MdToolbar = __decorate([
        core_1.Component({            selector: 'md-toolbar',
            template: "<div class=\"md-toolbar-layout\"> <md-toolbar-row> <ng-content></ng-content> </md-toolbar-row> <ng-content select=\"md-toolbar-row\"></ng-content> </div>",
            styles: ["/** * Mixin that creates a new stacking context. * see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */ /** * This mixin hides an element visually. * That means it's still accessible for screen-readers but not visible in view. */ /** * Forces an element to grow to fit floated contents; used as as an alternative to * `overflow: hidden;` because it doesn't cut off contents. */ /** * A mixin, which generates temporary ink ripple on a given component. * When $bindToParent is set to true, it will check for the focused class on the same selector as you included * that mixin. * It is also possible to specify the color palette of the temporary ripple. By default it uses the * accent palette for its background. */ md-toolbar { display: -webkit-box; display: -ms-flexbox; display: flex; box-sizing: border-box; width: 100%; min-height: 64px; font-size: 20px; font-weight: 400; font-family: Roboto, \"Helvetica Neue\", sans-serif; padding: 0 16px; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; background: whitesmoke; color: rgba(0, 0, 0, 0.87); } md-toolbar.md-primary { background: #009688; color: white; } md-toolbar.md-accent { background: #9c27b0; color: rgba(255, 255, 255, 0.870588); } md-toolbar.md-warn { background: #f44336; color: white; } md-toolbar md-toolbar-row { display: -webkit-box; display: -ms-flexbox; display: flex; box-sizing: border-box; width: 100%; height: 64px; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -ms-flex-direction: row; flex-direction: row; -webkit-box-align: center; -ms-flex-align: center; align-items: center; } "],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [core_3.ElementRef, core_2.Renderer])
    ], MdToolbar);
    return MdToolbar;
}());
exports.MdToolbar = MdToolbar;
/** @deprecated */
exports.MD_TOOLBAR_DIRECTIVES = [MdToolbar];
var MdToolbarModule = (function () {
    function MdToolbarModule() {
    }
    MdToolbarModule = __decorate([
        core_1.NgModule({
            exports: exports.MD_TOOLBAR_DIRECTIVES,
            declarations: exports.MD_TOOLBAR_DIRECTIVES,
        }), 
        __metadata('design:paramtypes', [])
    ], MdToolbarModule);
    return MdToolbarModule;
}());
exports.MdToolbarModule = MdToolbarModule;
//# sourceMappingURL=toolbar.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule, Component, Directive, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Overlay, OverlayState, OverlayModule, ComponentPortal, OVERLAY_PROVIDERS } from '@angular2-material/core';
export var MdTooltip = (function () {
    function MdTooltip(_overlay, _elementRef, _viewContainerRef, _changeDetectionRef) {
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetectionRef = _changeDetectionRef;
        this.visible = false;
        /** Allows the user to define the position of the tooltip relative to the parent element */
        this._position = 'below';
    }
    Object.defineProperty(MdTooltip.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            if (value !== this._position) {
                this._position = value;
                this._createOverlay();
                this._updatePosition();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            this._message = value;
            this._updatePosition();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create overlay on init
     * TODO: internal
     */
    MdTooltip.prototype.ngOnInit = function () {
        this._createOverlay();
    };
    /**
     * Create the overlay config and position strategy
     */
    MdTooltip.prototype._createOverlay = function () {
        if (this._overlayRef) {
            if (this.visible) {
                // if visible, hide before destroying
                this.hide();
                this._createOverlay();
            }
            else {
                // if not visible, dispose and recreate
                this._overlayRef.dispose();
                this._overlayRef = null;
                this._createOverlay();
            }
        }
        else {
            var origin = this._getOrigin();
            var position = this._getOverlayPosition();
            var strategy = this._overlay.position().connectedTo(this._elementRef, origin, position);
            var config = new OverlayState();
            config.positionStrategy = strategy;
            this._overlayRef = this._overlay.create(config);
        }
    };
    /**
     * Returns the origin position based on the user's position preference
     */
    MdTooltip.prototype._getOrigin = function () {
        switch (this.position) {
            case 'before': return { originX: 'start', originY: 'center' };
            case 'after': return { originX: 'end', originY: 'center' };
            case 'above': return { originX: 'center', originY: 'top' };
            case 'below': return { originX: 'center', originY: 'bottom' };
        }
    };
    /**
     * Returns the overlay position based on the user's preference
     */
    MdTooltip.prototype._getOverlayPosition = function () {
        switch (this.position) {
            case 'before': return { overlayX: 'end', overlayY: 'center' };
            case 'after': return { overlayX: 'start', overlayY: 'center' };
            case 'above': return { overlayX: 'center', overlayY: 'bottom' };
            case 'below': return { overlayX: 'center', overlayY: 'top' };
        }
    };
    /**
     * Shows the tooltip on mouse enter
     * @param event
     */
    MdTooltip.prototype._handleMouseEnter = function (event) {
        this.show();
    };
    /**
     * Hides the tooltip on mouse leave
     * @param event
     */
    MdTooltip.prototype._handleMouseLeave = function (event) {
        this.hide();
    };
    /**
     * Shows the tooltip and returns a promise that will resolve when the tooltip is visible
     */
    MdTooltip.prototype.show = function () {
        if (!this.visible && this._overlayRef && !this._overlayRef.hasAttached()) {
            this.visible = true;
            var portal = new ComponentPortal(TooltipComponent, this._viewContainerRef);
            var tooltipRef = this._overlayRef.attach(portal);
            tooltipRef.instance.message = this.message;
            this._updatePosition();
        }
    };
    /**
     * Hides the tooltip and returns a promise that will resolve when the tooltip is hidden
     */
    MdTooltip.prototype.hide = function () {
        if (this.visible && this._overlayRef && this._overlayRef.hasAttached()) {
            this.visible = false;
            this._overlayRef.detach();
        }
    };
    /**
     * Shows/hides the tooltip and returns a promise that will resolve when it is done
     */
    MdTooltip.prototype.toggle = function () {
        if (this.visible) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    /**
     * Updates the tooltip's position
     */
    MdTooltip.prototype._updatePosition = function () {
        if (this._overlayRef) {
            this._changeDetectionRef.detectChanges();
            this._overlayRef.updatePosition();
        }
    };
    __decorate([
        Input('tooltip-position'), 
        __metadata('design:type', String)
    ], MdTooltip.prototype, "position", null);
    __decorate([
        Input('md-tooltip'), 
        __metadata('design:type', Object)
    ], MdTooltip.prototype, "message", null);
    MdTooltip = __decorate([
        Directive({
            selector: '[md-tooltip]',
            host: {
                '(mouseenter)': '_handleMouseEnter($event)',
                '(mouseleave)': '_handleMouseLeave($event)',
            }
        }), 
        __metadata('design:paramtypes', [Overlay, ElementRef, ViewContainerRef, ChangeDetectorRef])
    ], MdTooltip);
    return MdTooltip;
}());
export var TooltipComponent = (function () {
    function TooltipComponent() {
    }
    TooltipComponent = __decorate([
        Component({selector: 'md-tooltip-component',
            template: "<div class=\"md-tooltip\">{{message}}</div>",
            styles: [":host { pointer-events: none; } .md-tooltip { color: white; padding: 0 8px; border-radius: 2px; font-family: Roboto, \"Helvetica Neue\", sans-serif; font-size: 10px; margin: 14px; height: 22px; line-height: 22px; } /*# sourceMappingURL=tooltip.css.map */ "],
        }), 
        __metadata('design:paramtypes', [])
    ], TooltipComponent);
    return TooltipComponent;
}());
export var MdTooltipModule = (function () {
    function MdTooltipModule() {
    }
    MdTooltipModule.forRoot = function () {
        return {
            ngModule: MdTooltipModule,
            providers: OVERLAY_PROVIDERS,
        };
    };
    MdTooltipModule = __decorate([
        NgModule({
            imports: [OverlayModule],
            exports: [MdTooltip, TooltipComponent],
            declarations: [MdTooltip, TooltipComponent],
            entryComponents: [TooltipComponent],
        }), 
        __metadata('design:paramtypes', [])
    ], MdTooltipModule);
    return MdTooltipModule;
}());

//# sourceMappingURL=tooltip.js.map
