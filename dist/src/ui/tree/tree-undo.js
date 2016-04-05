System.register(['js/jb', 'ui/tree/tree', 'angular2/core'], function(exports_1, context_1) {
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
    var jb_1, tree_1, core_1;
    var Undo;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (tree_1_1) {
                tree_1 = tree_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            jb_1.jb.component('json.undo', {
                type: 'feature',
                params: {},
                impl: function (context) {
                    var TreeUndo = (function () {
                        function TreeUndo() {
                        }
                        TreeUndo.prototype.ngAfterViewInit = function () {
                            var undo = new Undo(this.tree);
                            jb_1.jb.extend(this.tree, { undo: undo });
                            jb_1.jb.bind(this.tree, 'store', function (e) { undo.store(); });
                            jb_1.jb.bind(this.tree, 'undo', function (e) { undo.undo(); });
                            jb_1.jb.bind(this.tree, 'redo', function (e) { undo.redo(); });
                            jb_1.jb.bind(this.tree, 'copy', function (e) { undo.copy(); });
                            jb_1.jb.bind(this.tree, 'paste', function (e) { undo.paste(); });
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
            Undo = (function () {
                function Undo(tree) {
                    this.tree = tree;
                    this.history = [];
                    this.index = 0;
                }
                Undo.prototype.store = function () {
                    var newContent = jb_1.jb.stringify(this.tree.root.parent);
                    if (this.index > 0 && newContent == this.history[this.index - 1].content)
                        return;
                    if (this.index != this.history.length)
                        this.history = this.history.slice(0, this.index);
                    this.history.push({ path: this.tree.selectedNode.path(), content: newContent });
                    this.index++;
                };
                Undo.prototype.undo = function () {
                    if (this.index > 1) {
                        this.index--;
                        this.tree.root.parent = JSON.parse(this.history[this.index - 1].content);
                    }
                };
                Undo.prototype.redo = function () {
                    if (this.index < this.history.length) {
                        this.tree.root.parent = JSON.parse(this.history[this.index].content);
                        this.index++;
                    }
                };
                Undo.prototype.copy = function () {
                    var selectedNode = this.tree.selectedNode();
                    if (selectedNode)
                        this.clipboard = jb_1.jb.stringify(selectedNode.val());
                };
                Undo.prototype.paste = function () {
                    var selectedNode = this.tree.selectedNode();
                    if (this.clipboard && selectedNode) {
                        selectedNode.assign(JSON.parse(this.clipboard));
                        this.store();
                    }
                };
                return Undo;
            }());
        }
    }
});
//# sourceMappingURL=tree-undo.js.map