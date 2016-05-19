System.register(['jb-core', 'jb-ui/tree/tree', '@angular/core'], function(exports_1, context_1) {
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
    var jb_core_1, tree_1, core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (tree_1_1) {
                tree_1 = tree_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('json.undo', {
                type: 'feature',
                params: {},
                impl: function (context) {
                    var TreeUndo = (function () {
                        function TreeUndo() {
                        }
                        TreeUndo.prototype.ngAfterViewInit = function () {
                            var undo = new Undo(this.tree);
                            jb_core_1.jb.extend(this.tree, { undo: undo });
                            jb_core_1.jb.bind(this.tree, 'store', function (e) { undo.store(); });
                            jb_core_1.jb.bind(this.tree, 'undo', function (e) { undo.undo(); });
                            jb_core_1.jb.bind(this.tree, 'redo', function (e) { undo.redo(); });
                            jb_core_1.jb.bind(this.tree, 'copy', function (e) { undo.copy(); });
                            jb_core_1.jb.bind(this.tree, 'paste', function (e) { undo.paste(); });
                        };
                        __decorate([
                            core_1.Input(), 
                            __metadata('design:type', (typeof (_a = typeof tree_1.jbTree !== 'undefined' && tree_1.jbTree) === 'function' && _a) || Object)
                        ], TreeUndo.prototype, "tree", void 0);
                        __decorate([
                            core_1.Input('tree-undo'), 
                            __metadata('design:type', Object)
                        ], TreeUndo.prototype, "treeUndo", void 0);
                        TreeUndo = __decorate([
                            core_1.Directive({
                                selector: '[tree-undo]',
                            }), 
                            __metadata('design:paramtypes', [])
                        ], TreeUndo);
                        return TreeUndo;
                        var _a;
                    }());
                    return {
                        type: 'directives',
                        atts: { '[tree-undo]': '' },
                        directives: [TreeUndo]
                    };
                }
            });
        }
    }
});
