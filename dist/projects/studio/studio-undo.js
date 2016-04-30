System.register(['jb-core', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio;
    var Undo, undo;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            studio.modifyOperationsEm.subscribe(function (e) {
            });
            Undo = (function () {
                function Undo() {
                    this.history = [];
                    this.index = 0;
                }
                Undo.prototype.store = function () {
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
                        this.clipboard = jb_core_1.jb.stringify(selectedNode.val());
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
            exports_1("undo", undo = new Undo());
        }
    }
});
