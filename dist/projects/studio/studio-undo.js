System.register(['jb-core', 'jb-ui', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, studio_utils_1;
    var Undo, undo;
    function doSetComp(jbart_base, id, comp) {
        jbart_base.comps[id] = comp;
    }
    function setComp(code, jbart_base) {
        var fixed = code.replace(/^jb.component\(/, 'doSetComp(jbart_base,');
        try {
            return eval("(" + fixed + ")");
        }
        catch (e) {
            jb_core_1.jb.logException(e, 'set comp:' + code);
        }
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            }],
        execute: function() {
            Undo = (function () {
                function Undo() {
                    var _this = this;
                    this.history = [];
                    this.index = 0;
                    this.clipboard = null;
                    studio_utils_1.modifyOperationsEm.subscribe(function (change) {
                        _this.history.push(change);
                        _this.index = _this.history.length;
                    });
                }
                Undo.prototype.undo = function (ctx) {
                    if (this.index > 0) {
                        this.index--;
                        var change = this.history[this.index];
                        setComp(change.before, change.jbart);
                        jb_ui.apply(ctx);
                    }
                };
                Undo.prototype.redo = function (ctx) {
                    if (this.index < this.history.length) {
                        var change = this.history[this.index];
                        setComp(change.after, change.jbart);
                        this.index++;
                        jb_ui.apply(ctx);
                    }
                };
                Undo.prototype.copy = function (ctx, path) {
                    this.clipboard = ctx.run({ $: 'studio.profile-as-text' }, { as: 'string' });
                };
                Undo.prototype.paste = function (ctx, path) {
                    if (this.clipboard != null) {
                        var ref = ctx.run({ $: 'studio.profile-as-text' });
                        jb_core_1.jb.writeValue(ref, this.clipboard);
                    }
                };
                return Undo;
            }());
            undo = new Undo();
            jb_core_1.jb.component('studio.undo', {
                impl: function (ctx) { return undo.undo(ctx); }
            });
            jb_core_1.jb.component('studio.redo', {
                impl: function (ctx) { return undo.redo(ctx); }
            });
            jb_core_1.jb.component('studio.copy', {
                params: { path: { as: 'string' } },
                impl: function (ctx, path) {
                    return undo.copy(ctx, path);
                }
            });
            jb_core_1.jb.component('studio.paste', {
                params: { path: { as: 'string' } },
                impl: function (ctx, path) {
                    return undo.paste(ctx, path);
                }
            });
        }
    }
});
