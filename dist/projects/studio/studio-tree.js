System.register(['js/jb', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, studio;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            jb_1.jb.component('studio.openControlTree', {
                type: 'action',
                impl: { $: 'openDialog',
                    title: 'Control Tree',
                    //		styles: ['* {padding:3px}'],
                    style: { $: 'dialog.studioFloating', id: 'studio control tree', width: 250 },
                    content: { $: 'studio.controlTree' }
                }
            });
            jb_1.jb.component('studio.controlTree', {
                type: 'control',
                impl: {
                    $: 'tree', cssClass: 'jb-control-tree studio-control-tree',
                    nodeModel: { $: 'studio.controlTree.nodes' },
                    features: [
                        { $: 'tree.selection',
                            autoSelectFirst: true,
                            databind: '{%$globals/profile_path%}',
                            onSelection: { $: 'studio.highlight-in-preview' },
                            onDoubleClick: [
                                { $: 'studio.openProperties' },
                                { $: 'studio.highlight-in-preview' },
                            ],
                        },
                        { $: 'tree.keyboard-selection', onEnter: { $: 'studio.openProperties' } },
                        { $: 'tree.drag-and-drop' },
                        { $: 'studio.controlTree.refreshPathChanges' },
                    ]
                }
            });
            jb_1.jb.component('studio.controlTree.nodes', {
                type: 'tree.nodeModel',
                params: {},
                impl: function (context) {
                    var currentPath = context.str({ $firstSucceeding: ['{%$globals/profile_path%}', '{%$globals/project%}.{%$globals/page%}'] });
                    var compPath = currentPath.split('~')[0] || '';
                    return new studio.ControlModel(compPath);
                }
            });
            // after model modifications the paths of the selected and expanded nodes may change and the tree should fix it.
            jb_1.jb.component('studio.controlTree.refreshPathChanges', {
                type: 'feature',
                impl: function (context) {
                    var tree = context.vars.$tree;
                    if (jbart._refreshPathTreeObserver)
                        jbart._refreshPathTreeObserver.unsubscribe();
                    jbart._refreshPathTreeObserver = studio.pathChangesEm.subscribe(function (fixer) {
                        var new_expanded = {};
                        Object.getOwnPropertyNames(tree.expanded).filter(function (path) { return tree.expanded[path]; })
                            .forEach(function (path) { return new_expanded[fixer.fix(path)] = true; });
                        tree.expanded = new_expanded;
                        tree.selected = fixer.fix(tree.selected);
                    });
                }
            });
        }
    }
});
//# sourceMappingURL=studio-tree.js.map