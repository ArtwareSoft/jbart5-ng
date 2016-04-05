System.register(['js/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            jb_1.jb.component('json-editable-tree', {
                type: 'control',
                params: {
                    nodeModel: { type: 'tree.nodeModel', dynamic: true },
                },
                impl: { $: 'tree', cssClass: 'jb-control-tree', nodeModel: { $call: 'nodeModel' },
                    features: [{ $: 'tree.selection' }, { $: 'tree.keyboard-selection' }] }
            });
            jb_1.jb.component('tree.json', {
                type: 'tree.nodeModel',
                params: {
                    object: {},
                    rootPath: { as: 'string' }
                },
                impl: function (context, json, rootPath) {
                    var model = {
                        rootPath: rootPath,
                        val: function (path) { return jb_1.jb.val(ref(path)); },
                        subNodes: function (path) {
                            var val = jb_1.jb.val(ref(path));
                            if (Array.isArray(val))
                                return jb_1.jb.range(0, val.length).map(function (x) { return path + '~' + x; });
                            if (typeof val == 'object')
                                return Object.getOwnPropertyNames(val || {})
                                    .map(function (x) { return path + '~' + x; });
                            return [];
                        },
                        modify: function () { },
                        icon: function () { return ''; },
                        title: function (path, collapsed) {
                            var _ref = ref(path);
                            var val = jb_1.jb.val(_ref);
                            if (!collapsed && typeof val == 'object')
                                return _ref.$jb_property;
                            if (typeof val != 'object')
                                return _ref.$jb_property + ': ' + val;
                            return _ref.$jb_property + ': ' + Object.getOwnPropertyNames(val)
                                .filter(function (p) { return p.indexOf('$jb') != 0; }).filter(function (p) { return typeof val[p] == 'string'; })
                                .map(function (p) { return p + '= ' + val[p]; }).join(', ');
                        },
                        delete: function (path) {
                            var _ref = ref(path);
                            if (Array.isArray(_ref.$jb_parent))
                                _ref.$jb_parent.splice(_ref.$jb_property, 1);
                            else
                                delete _ref.$jb_parent[_ref.$jb_property];
                        },
                        isArray: function (path) {
                            return typeof jb_1.jb.val(ref(path)) == 'object';
                        }
                    };
                    model.children = function (path) {
                        model.cache = model.cache || {};
                        var res = model.subNodes(path);
                        if (!jb_1.jb.compareArrays(res, model.cache[path])) {
                            //				console.log(path,'no cache');
                            model.cache[path] = res;
                        }
                        else {
                        }
                        return model.cache[path];
                    };
                    model.rootPath = rootPath ? rootPath : 'root';
                    model.root = jb_1.jb.obj(model.rootPath, json);
                    function ref(path) {
                        return {
                            $jb_parent: path.split('~').slice(0, -1).reduce(function (o, p) { return o[p]; }, model.root),
                            $jb_property: path.split('~').pop()
                        };
                    }
                    return model;
                }
            });
        }
    }
});
//# sourceMappingURL=json-tree.js.map