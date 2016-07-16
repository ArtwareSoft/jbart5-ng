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
                    style: { $: 'dialog.studio-floating', id: 'studio properties' },
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
                    else if (['data', 'boolean'].indexOf(paramDef.type || 'data') != -1) {
                        if (studio.model.compName(path) || valType == 'object')
                            fieldPT = 'studio.property-data-script';
                        else if (paramDef.type == 'boolean' && (valType == 'boolean' || val == null))
                            fieldPT = 'studio.property-boolean';
                        else
                            fieldPT = 'studio.property-primitive';
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
                params: {
                    path: { as: 'string' }
                },
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
                                action: { $: 'studio.open-property-menu', path: '%$path%' }
                            }
                        },
                        { $: 'editable-text.suggestions-input-feature',
                            path: '%$path%',
                            action: { $: 'studio.jb-open-suggestions', path: '%$path%' }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.property-data-script', {
                type: 'control',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    features: [
                        { $: 'studio.undo-support', path: '%$path%' },
                        { $: 'studio.property-toobar-feature', path: '%$path%' },
                    ],
                    controls: { $: 'button',
                        title: { $: 'studio.data-script-summary', path: '%$path%' },
                        action: { $: 'openDialog',
                            content: { $: 'studio.jb-editor', path: '%$path%' },
                            style: { $: 'dialog.studio-floating',
                                id: 'jb editor',
                                width: '700',
                                height: '400'
                            },
                            title: 'Inteliscript'
                        },
                        style: { $: 'button.studio-data-script' }
                    }
                }
            });
            jb_core_1.jb.component('studio.data-script-summary', {
                type: 'data',
                params: {
                    path: { as: 'string' }
                },
                impl: function (ctx, path) {
                    var val = studio.model.val(path);
                    if (studio.model.compName(path))
                        return studio.model.compName(path);
                    if (Array.isArray(val))
                        return jb_core_1.jb.prettyPrint(val);
                    if (typeof val == 'function')
                        return 'javascript';
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
                        { $: 'studio.property-toobar-feature', path: '%$path%' }
                    ],
                }
            });
            jb_core_1.jb.component('studio.property-enum', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'picklist',
                    style: { $: 'picklist.studio-enum' },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    options: { $: 'studio.enum-options', path: '%$path%' },
                }
            });
            jb_core_1.jb.component('studio.property-slider', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'editable-number',
                    $vars: {
                        paramDef: { $: 'studio.paramDef', path: '%$path%' }
                    },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    style: { $: 'editable-number.slider', width: '120px' },
                    min: '%$paramDef/min%',
                    max: '%$paramDef/max%',
                    step: '%$paramDef/step%',
                    features: { $: 'css', css: '{ margin-left: -5px; }' },
                }
            });
            jb_core_1.jb.component('studio.property-tgp', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'group',
                    $vars: {
                        tgpCtrl: { $: 'object', expanded: true }
                    },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    features: { $: 'studio.property-toobar-feature', path: '%$path%' },
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-boolean',
                                    databind: '%$tgpCtrl/expanded%',
                                    style: { $: 'editable-boolean.expand-collapse' },
                                    features: [
                                        { $: 'css',
                                            css: '{ position: absolute; margin-left: -20px; margin-top: 2px }'
                                        },
                                        { $: 'hidden',
                                            showCondition: {
                                                $notEmpty: { $: 'studio.non-control-children', path: '%$path%' }
                                            }
                                        }
                                    ]
                                },
                                { $: 'picklist',
                                    databind: { $: 'studio.compName-ref', path: '%$path%' },
                                    options: { $: 'studio.tgp-path-options', path: '%$path%' },
                                    style: { $: 'picklist.groups' },
                                    features: { $: 'css',
                                        css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
                                    }
                                }
                            ],
                            features: { $: 'css', css: '{ position: relative }' }
                        },
                        { $: 'group',
                            controls: { $: 'studio.properties', path: '%$path%' },
                            features: [
                                { $: 'group.watch',
                                    data: { $: 'studio.compName', path: '%$path%' }
                                },
                                { $: 'hidden', showCondition: '%$tgpCtrl.expanded%' },
                                { $: 'css',
                                    css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'
                                }
                            ]
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.property-tgp-in-array', {
                type: 'control',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'group',
                    $vars: {
                        tgpCtrl: { $: 'object', expanded: false }
                    },
                    features: { $: 'studio.property-toobar-feature', path: '%$path%' },
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-boolean',
                                    databind: '%$tgpCtrl/expanded%',
                                    style: { $: 'editable-boolean.expand-collapse' },
                                    features: [
                                        { $: 'css',
                                            css: '{ position: absolute; margin-left: -20px; margin-top: 2px }'
                                        },
                                        { $: 'hidden',
                                            showCondition: {
                                                $notEmpty: { $: 'studio.non-control-children', path: '%$path%' }
                                            }
                                        }
                                    ]
                                },
                                { $: 'picklist',
                                    databind: { $: 'studio.compName-ref', path: '%$path%' },
                                    options: { $: 'studio.tgp-path-options', path: '%$path%' },
                                    style: { $: 'picklist.groups' },
                                    features: { $: 'css',
                                        css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
                                    }
                                }
                            ],
                            features: { $: 'css', css: '{ position: relative; margin-left: -80px }' }
                        },
                        { $: 'group',
                            controls: { $: 'studio.properties', path: '%$path%' },
                            features: [
                                { $: 'group.watch',
                                    data: { $: 'studio.compName', path: '%$path%' }
                                },
                                { $: 'hidden', showCondition: '%$tgpCtrl.expanded%' },
                                { $: 'css',
                                    css: '{ margin-top: 9px; margin-left: -100px; margin-bottom: 4px;}'
                                }
                            ]
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.property-array', {
                type: 'control',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'group',
                    $vars: {
                        arrayCtrl: { $: 'object', expanded: true }
                    },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    controls: [
                        { $: 'button',
                            title: 'add',
                            action: { $: 'studio.newArrayItem', path: '%$path%' },
                            style: { $: 'button.md-icon', icon: 'add', size: '12', aria: undefined },
                            features: [
                                { $: 'css',
                                    css: "{ position: absolute;   top: 0px;   right: 30px }\nbutton:hover {  background: none }"
                                },
                            ]
                        },
                        { $: 'itemlist',
                            items: { $: 'studio.array-children', path: '%$path%' },
                            controls: { $: 'group',
                                style: { $: 'property-sheet.studio-properties' },
                                controls: { $: 'studio.property-tgp-in-array', path: '%$arrayItem%' }
                            },
                            itemVariable: 'arrayItem',
                            features: [
                                { $: 'hidden', showCondition: true },
                                { $: 'css', css: '{ margin-left: 10px}' },
                                { $: 'itemlist.divider' },
                                { $: 'itemlist.drag-and-drop' }
                            ]
                        }
                    ],
                    features: [
                        { $: 'css',
                            css: "{ position: relative; width: 400px; margin-left: -110px; margin-top: -5px }\n.header {  background: #F9F9F9; } \ni { font-size: 16px; margin-right: 1px; color: #909090 }"
                        }
                    ],
                    style: { $: 'group.expandable' }
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
                            if (cmp.codeMirror) {
                                cmp.codeMirror.on('focus', function () {
                                    return before = studio.compAsStrFromPath(path);
                                });
                                cmp.codeMirror.on('blur', function () {
                                    if (before != studio.compAsStrFromPath(path))
                                        studio.notifyModifcation(path, before, ctx);
                                });
                            }
                            else {
                                $(cmp.elementRef.nativeElement).findIncludeSelf('input')
                                    .focus(function (e) {
                                    before = studio.compAsStrFromPath(path);
                                })
                                    .blur(function (e) {
                                    if (before != studio.compAsStrFromPath(path))
                                        studio.notifyModifcation(path, before, ctx);
                                });
                            }
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
