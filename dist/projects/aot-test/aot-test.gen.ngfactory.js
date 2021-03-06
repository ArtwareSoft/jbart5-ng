/**
 * This file is generated by the Angular 2 template compiler.
 * Do not edit.
 */
/* tslint:disable */
System.register(['_@angular/core/src/linker/ng_module_factory', './aot-test.gen', '_@angular/core/src/linker/view', '_@angular/core/src/linker/element', '_@angular/core/src/linker/view_utils', '_@angular/core/src/linker/view_type', '_@angular/core/src/change_detection/change_detection', '_@angular/core/src/metadata/view', '_@angular/core/src/linker/component_factory'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var import0, import1, import3, import5, import6, import7, import8, import9, import10;
    var jBartCompiledViewsModuleInjector, jBartCompiledViewsModuleNgFactory, Wrapper_label__aot___test, renderType_label__aot___test_Host, _View_label__aot___test_Host0, label__aot___testNgFactory, styles_label__aot___test, renderType_label__aot___test, _View_label__aot___test0;
    function viewFactory_label__aot___test_Host0(viewUtils, parentInjector, declarationEl) {
        if ((renderType_label__aot___test_Host === null)) {
            (renderType_label__aot___test_Host = viewUtils.createRenderComponentType('', 0, import9.ViewEncapsulation.None, [], {}));
        }
        return new _View_label__aot___test_Host0(viewUtils, parentInjector, declarationEl);
    }
    function viewFactory_label__aot___test0(viewUtils, parentInjector, declarationEl) {
        if ((renderType_label__aot___test === null)) {
            (renderType_label__aot___test = viewUtils.createRenderComponentType('', 0, import9.ViewEncapsulation.None, styles_label__aot___test, {}));
        }
        return new _View_label__aot___test0(viewUtils, parentInjector, declarationEl);
    }
    exports_1("viewFactory_label__aot___test0", viewFactory_label__aot___test0);
    return {
        setters:[
            function (import0_1) {
                import0 = import0_1;
            },
            function (import1_1) {
                import1 = import1_1;
            },
            function (import3_1) {
                import3 = import3_1;
            },
            function (import5_1) {
                import5 = import5_1;
            },
            function (import6_1) {
                import6 = import6_1;
            },
            function (import7_1) {
                import7 = import7_1;
            },
            function (import8_1) {
                import8 = import8_1;
            },
            function (import9_1) {
                import9 = import9_1;
            },
            function (import10_1) {
                import10 = import10_1;
            }],
        execute: function() {
            jBartCompiledViewsModuleInjector = (function (_super) {
                __extends(jBartCompiledViewsModuleInjector, _super);
                function jBartCompiledViewsModuleInjector(parent) {
                    _super.call(this, parent, [], []);
                }
                jBartCompiledViewsModuleInjector.prototype.createInternal = function () {
                    this._jBartCompiledViewsModule_0 = new import1.jBartCompiledViewsModule();
                    return this._jBartCompiledViewsModule_0;
                };
                jBartCompiledViewsModuleInjector.prototype.getInternal = function (token, notFoundResult) {
                    if ((token === import1.jBartCompiledViewsModule)) {
                        return this._jBartCompiledViewsModule_0;
                    }
                    return notFoundResult;
                };
                jBartCompiledViewsModuleInjector.prototype.destroyInternal = function () {
                };
                return jBartCompiledViewsModuleInjector;
            }(import0.NgModuleInjector));
            exports_1("jBartCompiledViewsModuleNgFactory", jBartCompiledViewsModuleNgFactory = new import0.NgModuleFactory(jBartCompiledViewsModuleInjector, import1.jBartCompiledViewsModule));
            Wrapper_label__aot___test = (function () {
                function Wrapper_label__aot___test() {
                    this.changed = false;
                    this.context = new import1.label__aot___test();
                }
                Wrapper_label__aot___test.prototype.detectChangesInInputProps = function (view, el, throwOnChange) {
                    var changed = this.changed;
                    this.changed = false;
                    return changed;
                };
                Wrapper_label__aot___test.prototype.detectChangesInHostProps = function (view, el, throwOnChange) {
                };
                return Wrapper_label__aot___test;
            }());
            exports_1("Wrapper_label__aot___test", Wrapper_label__aot___test);
            renderType_label__aot___test_Host = null;
            _View_label__aot___test_Host0 = (function (_super) {
                __extends(_View_label__aot___test_Host0, _super);
                function _View_label__aot___test_Host0(viewUtils, parentInjector, declarationEl) {
                    _super.call(this, _View_label__aot___test_Host0, renderType_label__aot___test_Host, import7.ViewType.HOST, viewUtils, parentInjector, declarationEl, import8.ChangeDetectorStatus.CheckAlways);
                }
                _View_label__aot___test_Host0.prototype.createInternal = function (rootSelector) {
                    this._el_0 = import6.selectOrCreateRenderHostElement(this.renderer, 'jb-comp', import6.EMPTY_INLINE_ARRAY, rootSelector, null);
                    this._appEl_0 = new import5.AppElement(0, null, this, this._el_0);
                    var compView_0 = viewFactory_label__aot___test0(this.viewUtils, this.injector(0), this._appEl_0);
                    this._label__aot___test_0_4 = new Wrapper_label__aot___test();
                    this._appEl_0.initComponent(this._label__aot___test_0_4.context, [], compView_0);
                    compView_0.create(this._label__aot___test_0_4.context, this.projectableNodes, null);
                    this.init([].concat([this._el_0]), [this._el_0], [], []);
                    return this._appEl_0;
                };
                _View_label__aot___test_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
                    if (((token === import1.label__aot___test) && (0 === requestNodeIndex))) {
                        return this._label__aot___test_0_4.context;
                    }
                    return notFoundResult;
                };
                _View_label__aot___test_Host0.prototype.detectChangesInternal = function (throwOnChange) {
                    this._label__aot___test_0_4.detectChangesInInputProps(this, this._el_0, throwOnChange);
                    this.detectContentChildrenChanges(throwOnChange);
                    this._label__aot___test_0_4.detectChangesInHostProps(this, this._el_0, throwOnChange);
                    this.detectViewChildrenChanges(throwOnChange);
                };
                return _View_label__aot___test_Host0;
            }(import3.AppView));
            exports_1("label__aot___testNgFactory", label__aot___testNgFactory = new import10.ComponentFactory('jb-comp', viewFactory_label__aot___test_Host0, import1.label__aot___test));
            styles_label__aot___test = [];
            renderType_label__aot___test = null;
            _View_label__aot___test0 = (function (_super) {
                __extends(_View_label__aot___test0, _super);
                function _View_label__aot___test0(viewUtils, parentInjector, declarationEl) {
                    _super.call(this, _View_label__aot___test0, renderType_label__aot___test, import7.ViewType.COMPONENT, viewUtils, parentInjector, declarationEl, import8.ChangeDetectorStatus.CheckAlways);
                    this._expr_2 = import8.UNINITIALIZED;
                }
                _View_label__aot___test0.prototype.createInternal = function (rootSelector) {
                    var parentRenderNode = this.renderer.createViewRoot(this.declarationAppElement.nativeElement);
                    this._el_0 = import6.createRenderElement(this.renderer, parentRenderNode, 'span', import6.EMPTY_INLINE_ARRAY, null);
                    this._text_1 = this.renderer.createText(this._el_0, '', null);
                    this.init([], [
                        this._el_0,
                        this._text_1
                    ], [], []);
                    return null;
                };
                _View_label__aot___test0.prototype.detectChangesInternal = function (throwOnChange) {
                    this.detectContentChildrenChanges(throwOnChange);
                    var currVal_2 = import6.interpolate(1, '', this.context.title, '');
                    if (import6.checkBinding(throwOnChange, this._expr_2, currVal_2)) {
                        this.renderer.setText(this._text_1, currVal_2);
                        this._expr_2 = currVal_2;
                    }
                    this.detectViewChildrenChanges(throwOnChange);
                };
                return _View_label__aot___test0;
            }(import3.AppView));
        }
    }
});
