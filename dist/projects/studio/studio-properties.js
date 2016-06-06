System.register(['jb-core', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.openProperties', {
                type: 'action',
                impl: { $: 'openDialog',
                    title: [
                        { $: 'object',
                            title: { $: 'studio.short-title', path: { $: 'studio.currentProfilePath' } },
                            comp: { $: 'studio.compName', path: { $: 'studio.currentProfilePath' } }
                        },
                        'Properties of %comp% %title%'
                    ],
                    style: { $: 'dialog.studioFloating', id: 'studio properties' },
                    content: { $: 'studio.properties', path: { $: 'studio.currentProfilePath' } }
                }
            });
            jb_core_1.jb.component('studio.openSourceDialog', {
                type: 'action',
                impl: { $: 'openDialog',
                    modal: true,
                    title: 'Source',
                    style: { $: 'dialog.md-dialog-ok-cancel' },
                    content: { $: 'text',
                        text: { $: 'studio.compSource' },
                        style: { $: 'text.codemirror' }
                    },
                }
            });
            jb_core_1.jb.component('studio.properties', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'group',
                    style: { $: 'property-sheet.studio-properties' },
                    features: { $: 'group.studio-watch-path', path: '%$path%' },
                    controls: { $: 'dynamic-controls',
                        controlItems: { $: 'studio.non-control-children', path: '%$path%' },
                        genericControl: { $: 'studio.property-field', path: '%$controlItem%' }
                    }
                }
            });
            jb_core_1.jb.component('studio.property-field', {
                type: 'control',
                params: {
                    path: { as: 'string' },
                },
                impl: function (context, path) {
                    var fieldPT = 'studio.property-label';
                    var val = studio.model.val(path);
                    var valType = typeof val;
                    var paramDef = studio.model.paramDef(path);
                    if (!paramDef)
                        jb_core_1.jb.logError('property-field: no param def for path ' + path);
                    if (valType == 'function')
                        fieldPT = 'studio.property-javascript';
                    else if (paramDef.as == 'number')
                        fieldPT = 'studio.property-slider';
                    else if (paramDef.options)
                        fieldPT = 'studio.property-enum';
                    else if (['data', 'boolean'].indexOf(paramDef.type || 'data') != -1 && ['number', 'string', 'undefined'].indexOf(valType) != -1) {
                        if (studio.model.compName(path))
                            fieldPT = 'studio.property-JBEditor';
                        else
                            fieldPT = paramDef.type == 'boolean' ? 'studio.property-boolean' : 'studio.property-primitive';
                    }
                    else if ((paramDef.type || '').indexOf('[]') != -1 && isNaN(Number(path.split('~').pop())))
                        fieldPT = 'studio.property-array';
                    else
                        fieldPT = 'studio.property-tgp';
                    return context.run({ $: fieldPT, path: path });
                }
            });
            jb_core_1.jb.component('studio.property-label', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'label',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                }
            });
            jb_core_1.jb.component('studio.property-primitive', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'editable-text',
                    style: { $: 'editable-text.studio-primitive-text' },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    features: [
                        { $: 'studio.undo-support', path: '%$path%' },
                        { $: 'field.toolbar',
                            toolbar: { $: 'button',
                                title: 'more',
                                style: { $: 'button.md-icon-12', icon: 'more_vert' },
                                action: { $: 'studio.open-property-menu', path: '%$path%' },
                            }
                        }
                    ],
                }
            });
            jb_core_1.jb.component('studio.property-boolean', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'editable-boolean',
                    style: { $: 'editable-boolean.studio-slide-toggle' },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    features: [
                        { $: 'studio.undo-support', path: '%$path%' },
                        { $: 'field.toolbar',
                            toolbar: { $: 'button',
                                title: 'more',
                                style: { $: 'button.md-icon-12', icon: 'more_vert' },
                                action: { $: 'studio.open-property-menu', path: '%$path%' },
                            }
                        }
                    ],
                }
            });
            jb_core_1.jb.component('studio.property-enum', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'picklist',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    options: { $: 'studio.enum-options', path: '%$path%' },
                }
            });
            jb_core_1.jb.component('studio.property-slider', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'editable-number',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    style: { $: 'editable-number.slider', width: '120px' },
                    features: { $: 'css', css: '{ margin-left: -5px; }' },
                }
            });
            jb_core_1.jb.component('studio.property-tgp', {
                type: 'control',
                params: {
                    path: { as: 'string' },
                    inArray: { type: 'boolean' }
                },
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    $vars: {
                        'tgpCtrl': { $: 'object', expanded: true }
                    },
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-boolean',
                                    style: { $: 'editable-boolean.expand-collapse' },
                                    features: { $: 'css', css: '{ position: absolute; margin-left: -20px; margin-top: 2px }' },
                                    databind: '%$tgpCtrl/expanded%',
                                },
                                { $: 'picklist',
                                    style: { $: 'picklist.groups' },
                                    features: { $: 'css', css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}' },
                                    databind: { $: 'studio.compName-ref', path: '%$path%' },
                                    options: { $: 'studio.tgp-path-options', path: '%$path%' },
                                },
                                { $: 'button',
                                    title: 'more',
                                    style: { $: 'button.md-icon-12', icon: 'more_vert' },
                                    action: { $: 'studio.open-property-menu', path: '%$path%' },
                                },
                            ]
                        },
                        { $: 'group',
                            controls: { $: 'studio.properties', path: '%$path%' },
                            features: [
                                { $: 'group.watch', data: { $: 'studio.compName', path: '%$path%' } },
                                { $: 'hidden', showCondition: '%$tgpCtrl.expanded%' },
                                { $: 'css',
                                    css: { $if: '%$inArray%',
                                        then: '{ margin-top: 9px; margin-left: -100px; margin-bottom: 4px;}',
                                        else: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'
                                    }
                                }
                            ],
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.property-array', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'group',
                    $vars: {
                        'arrayCtrl': { $: 'object', expanded: true }
                    },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            features: { $: 'css', css: '{ height: 28px; margin-left: 174px; }' },
                            controls: [
                                { $: 'editable-boolean',
                                    style: { $: 'editable-boolean.studio-expand-collapse-in-toolbar' },
                                    features: { $: 'css', css: '.material-icons { font-size: 16px }' },
                                    databind: '%$arrayCtrl/expanded%',
                                },
                                { $: 'button',
                                    title: 'add',
                                    style: { $: 'button.md-icon-12', icon: 'add' },
                                    action: { $: 'studio.newArrayItem', path: '%$path%' },
                                    features: { $: 'css', css: '.material-icons { font-size: 16px }' },
                                },
                            ]
                        },
                        { $: 'itemlist',
                            items: { $: 'studio.array-children', path: '%$path%' },
                            itemVariable: 'arrayItem',
                            controls: { $: 'group',
                                style: { $: 'property-sheet.studio-properties' },
                                controls: { $: 'studio.property-tgp', path: '%$arrayItem%', inArray: true },
                            },
                            features: [
                                { $: 'hidden', showCondition: '%$arrayCtrl.expanded%' },
                                { $: 'css', css: "{ margin-left: -80px}" },
                                { $: 'itemlist.divider' },
                                { $: 'itemlist.drag-and-drop' },
                            ]
                        }
                    ],
                }
            });
            jb_core_1.jb.component('studio.open-property-menu', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                },
                impl: { $: 'openDialog',
                    style: { $: 'pulldownPopup.contextMenuPopup' },
                    content: { $: 'group',
                        controls: [
                            { $: 'pulldown.menu-item', title: 'Delete', icon: 'delete', shortcut: 'Delete',
                                action: [
                                    { $: 'writeValue', value: false, to: '%$TgpTypeCtrl.expanded%' },
                                    { $: 'studio.delete', path: '%$path%' },
                                ],
                            },
                            { $: 'pulldown.menu-item', title: 'javascript editor', icon: 'code',
                                action: { $: 'studio.editSource', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item', title: 'Goto sublime',
                                action: { $: 'studio.openSublime', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item', title: 'Customize Style', icon: 'build',
                                action: { $: 'studio.makeLocal', path: '%$path%' },
                                features: { $: 'hidden', showCondition: { $: 'endsWith', text: '%$path%', endsWith: '~style' } }
                            },
                        ]
                    }
                }
            });
            // jb.component('studio.property-Style',{
            // 	type: 'control',
            // 	params: { path: { as: 'string' } },
            // 	impl :{$: 'group',
            // 		title :{$: 'studio.prop-name', path: '%$path%' },
            // 		$vars: {
            // 			'TgpTypeCtrl' :{$: 'object' , expanded: true }
            // 		},
            // 		controls: [
            // 			{ $: 'group',
            // 			  style :{$: 'layout.horizontal' },
            // 			  controls: [
            // 					{ $: 'picklist',
            // 						cssClass: 'jb-studio-tgpType-picklist',
            // 						databind :{$: 'studio.compName-ref', path: '%$path%' },
            // 						options :{$: 'studio.tgp-path-options', path: '%$path%' },
            // 					},
            // 					{ $: 'group',
            // 			  			style :{$: 'layout.horizontal' },
            // 			  			controls:
            // 			  			[
            // 			  				{ $: 'editable-boolean',
            // 								style :{$: 'editable-boolean.expand-collapse'},
            // 								databind: '%$TgpTypeCtrl/expanded%',
            // 								features :{$: 'hidden', showCondition :{$not: { $: 'studio.isCustomStyle', path: '%$path%' } }}
            // 							},
            // 							{ $: 'button' ,
            // 								title: 'customize style',
            // 								style :{$: 'button.studio-properties-toolbar', icon: 'build' }, 
            // 								action : [ 
            // 									{$: 'studio.makeLocal', path: '%$path%' },
            // 									{$: 'studio.openEditStyle', path: '%$path%' },
            // 								],
            // 								features :{$: 'hidden', showCondition :{$not :{$: 'studio.isCustomStyle', path: '%$path%' } }}
            // 							},
            // 							{ $: 'button' ,
            // 								title: 'open sublime',
            // 								style :{$: 'button.studio-properties-toolbar', icon: 'code' },
            // 								action :{$: 'studio.openSublime', path: '%$path%' },
            // 							},
            // 							{ $: 'button' ,
            // 								title: 'edit custom style',
            // 								style :{$: 'button.md-icon', icon: 'input' }, 
            // 								action :{$: 'studio.openEditStyle', path: '%$path%' },
            // 								features :{$: 'hidden', showCondition :{$: 'studio.isCustomStyle', path: '%$path%' } }
            // 							},
            // 							{ $: 'button' ,
            // 								title: 'share style',
            // 								style :{$: 'button.md-icon', icon: 'add' }, 
            // 								action :{$: 'studio.shareStyle', path: '%$path%' },
            // 								features :{$: 'hidden', showCondition : false } //{$: 'studio.isCustomStyle', path: '%$path%' } }
            // 							},
            // 					  ]
            // 					},
            // 				]
            // 			},
            // 			{ $: 'group',
            // 				controls :{$: 'studio.properties', 	path: '%$path%' },
            // 				features : [ 
            // 					{$: 'group.watch', data :{$: 'studio.compName', path: '%$path%' }},
            // 					{$: 'hidden', showCondition: {$and: 
            // 						[
            // 							'%$TgpTypeCtrl.expanded%', 
            // 							{$not: { $: 'studio.isCustomStyle', path: '%$path%' } }
            // 						] 
            // 					}},
            // 					{$: 'css', css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'},
            // 				],
            // 			}
            // 		]
            // 	}
            // })
            // jb.component('studio.property-JBEditor',{
            // 	type: 'control',
            // 	params: { path: { as: 'string'} },
            // 	impl :{$: 'group',
            // 		title :{$: 'studio.prop-name', path: '%$path%' },
            // 		controls: [
            // 			{ $: 'button',
            // 				title: '(..)',
            // //				cssStyle: 'jb-studio-primitive-jbeditor',
            // 				action :{$: 'studio.openjbEditor', path: '%$path%'} 
            // 			},
            // 			{ $: 'button', 
            // 				style: {$: 'button.popup-menu' },
            // 				action: { $: 'studio.openPrimitiveArrowPopup', 
            // 					path: '%$path%', 
            // 					isPrimitive: false 
            // 				}
            // 			}
            // 		]
            // 	}
            // })
            // jb.component('studio.property-Javascript',{
            // 	type: 'control',
            // 	params: { path: { as: 'string'} },
            // 	impl :{$: 'group',
            // 		title :{$: 'studio.prop-name', path: '%$path%' },
            // 		controls: [
            // 			{ $: 'button',
            // 				text: '(..)',
            // 				cssClass: 'jb-studio-primitive-javascript',
            // 				action: { $: 'studio.openjsEditor', path: '%$path%'	}
            // 			},
            // 			{ $: 'button' ,
            // 				title: 'more',
            // 				style :{$: 'button.studio-properties-toolbar', icon: 'more_vert' }, 
            // 				action :{$: 'studio.open-property-menu', path: '%$path%' },
            // 			},
            // 		]
            // 	}
            // })
            // jb.component('studio.openPrimitiveArrowPopup',{
            // 	type: 'action',
            // 	params: { 
            // 		path: { as: 'string' },
            // 		isPrimitive: { type: 'boolean', as: 'boolean'}
            // 	},
            // 	impl :{$: 'openDialog',
            // 		style :{$: 'pulldownPopup.contextMenuPopup' },
            // 		cssClass: 'jb-popup pulldown-mainmenu-popup',
            // 		content :{$: 'group',
            // 			controls: [
            // 	 		    { $: 'pulldown.menu-item', title: 'Edit in jbEditor', spritePosition: '6,0', 
            // 				    action :{$: 'studio.openjbEditor', path: '%$path%' }
            // 	 		    },
            // 			    { $: 'pulldown.menu-item', title: 'Delete script', 
            // 			    	atts: { '[hidden]' : '%$isPrimitive%' },
            // 				    action: [
            // 				      { $: 'closeContainingPopup' },
            // 				      { $: 'studio.delete', path: '%$path%' }
            // 				    ],
            // 	 		    }
            // 			]
            // 		}
            // 	}
            // })
            jb_core_1.jb.component('studio.tgp-path-options', {
                type: 'picklist.options',
                params: {
                    path: { as: 'string' },
                },
                impl: function (context, path) {
                    return [{ code: '', text: '' }]
                        .concat(studio.model.PTsOfPath(path).map(function (op) { return ({ code: op, text: op }); }));
                }
            });
            jb_core_1.jb.component('studio.tgp-type-options', {
                type: 'picklist.options',
                params: {
                    type: { as: 'string' }
                },
                impl: function (context, type) {
                    return studio.model.PTsOfType(type).map(function (op) { return ({ code: op, text: op }); });
                }
            });
            jb_core_1.jb.component('studio.undo-support', {
                type: 'feature',
                params: {
                    path: { essential: true, as: 'string' },
                },
                impl: function (ctx, path) {
                    return ({
                        // saving state on focus and setting the change on blur
                        init: function (cmp) {
                            var before = studio.compAsStrFromPath(path);
                            $(cmp.elementRef.nativeElement).findIncludeSelf('input')
                                .focus(function (e) {
                                before = studio.compAsStrFromPath(path);
                            })
                                .blur(function (e) {
                                if (before != studio.compAsStrFromPath(path))
                                    studio.notifyModifcation(path, before, ctx);
                            });
                        }
                    });
                }
            });
            jb_core_1.jb.component('group.studio-watch-path', {
                type: 'feature',
                params: {
                    path: { essential: true, as: 'string' },
                },
                impl: function (context, initialPath) {
                    var path = initialPath;
                    studio.pathChangesEm.subscribe(function (fixer) { path = fixer.fix(path); });
                    return {
                        ctrlsEmFunc: function (originalCtrlsEmFunc, ctx, cmp) {
                            return cmp.jbEmitter
                                .map(function () { return profileChildren(path); })
                                .distinctUntilChanged()
                                .filter(function (x) { return x && x != 'undefined'; })
                                .map(function (x) { console.log('group.studio-watch-path changed', x); return x; })
                                .flatMap(function (val) {
                                return originalCtrlsEmFunc(ctx);
                            });
                        },
                        observable: function () { } // to create jbEmitter
                    };
                    function profileChildren() {
                        return studio.model.nonControlParams(path).join(' ');
                    }
                }
            });
        }
    }
});
// function jb_studioCopyDefaultValue(profile,param) {
// 	if (profile[param]) return;
// 	var comp = jb_compName(profile);
// 	if (!comp) return;
// 	var params = ((jb_jbart().comps[comp] || {}).params || {});
// 	if (params[param] && typeof params[param].defaultValue != 'undefined')
// 		profile[param] = jb_cloneData(params[param].defaultValue)
// }
