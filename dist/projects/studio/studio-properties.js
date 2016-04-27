System.register(['jb-core', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio;
    function jb_studioCopyDefaultValue(profile, param) {
        if (profile[param])
            return;
        var comp = jb_compName(profile);
        if (!comp)
            return;
        var params = ((jb_jbart().comps[comp] || {}).params || {});
        if (params[param] && typeof params[param].defaultValue != 'undefined')
            profile[param] = jb_cloneData(params[param].defaultValue);
    }
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
                    content: { $: 'group',
                        //			style :{$: 'tab-control.studio-properties-accordion' },
                        controls: [
                            { $: 'group', title: 'Properties',
                                //					cssClass: 'studio-properties-in-dialog',
                                controls: { $: 'studio.properties', path: { $: 'studio.currentProfilePath' } }
                            },
                        ]
                    }
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
                        genericControl: { $: 'studio.propertyField', path: '%$controlItem%' }
                    }
                }
            });
            jb_core_1.jb.component('studio.propertyField-Label', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'label',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                }
            });
            jb_core_1.jb.component('studio.propertyField-Primitive', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'group',
                    style: { $: 'layout.horizontal', spacing: 2 },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    controls: [
                        { $: 'editable-text',
                            features: { $: 'css', css: 'input { font-size: 12px; padding-left: 2px; width: 145px;}' },
                            databind: { $: 'studio.ref', path: '%$path%' }
                        },
                        { $: 'button',
                            title: 'more',
                            style: { $: 'button.studio-properties-toolbar', icon: 'more_vert' },
                            action: { $: 'studio.open-property-menu', path: '%$path%' },
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.propertyField-enum', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'picklist',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    options: { $: 'studio.enum-options', path: '%$path%' },
                }
            });
            jb_core_1.jb.component('studio.propertyField-slider', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'editable-number',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    style: { $: 'editable-number.slider', width: '120px' },
                    features: { $: 'css', css: '{ margin-left: -5px; }' },
                }
            });
            jb_core_1.jb.component('studio.propertyField-TgpType', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    $vars: {
                        'TgpTypeCtrl': { $: 'object', expanded: true }
                    },
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-boolean',
                                    style: { $: 'editable-boolean.expand-collapse' },
                                    features: { $: 'css', css: 'button { position: absolute; margin-left: -20px; margin-top: 5px }' },
                                    databind: '%$TgpTypeCtrl/expanded%',
                                },
                                { $: 'picklist',
                                    features: { $: 'css', css: 'select { margin-left: -3px; width: 150px; font-size: 12px; height: 23px;}' },
                                    databind: { $: 'studio.compName-ref', path: '%$path%' },
                                    options: { $: 'studio.tgp-path-options', path: '%$path%' },
                                },
                                { $: 'button',
                                    title: 'more',
                                    style: { $: 'button.studio-properties-toolbar', icon: 'more_vert' },
                                    action: { $: 'studio.open-property-menu', path: '%$path%' },
                                },
                            ]
                        },
                        { $: 'group',
                            controls: { $: 'studio.properties', path: '%$path%' },
                            features: [
                                { $: 'group.watch', data: { $: 'studio.compName', path: '%$path%' } },
                                { $: 'hidden', showCondition: '%$TgpTypeCtrl.expanded%' },
                                { $: 'css', css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}' },
                            ],
                        }
                    ]
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
                                action: { $: 'studio.openStyleEditor', path: '%$path%' },
                                features: { $: 'hidden', showCondition: { $: 'endsWith', text: '%$path%', endsWith: '~style' } }
                            },
                        ]
                    }
                }
            });
            jb_core_1.jb.component('studio.propertyField-Style', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    $vars: {
                        'TgpTypeCtrl': { $: 'object', expanded: true }
                    },
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'picklist',
                                    cssClass: 'jb-studio-tgpType-picklist',
                                    databind: { $: 'studio.compName-ref', path: '%$path%' },
                                    options: { $: 'studio.tgp-path-options', path: '%$path%' },
                                },
                                { $: 'group',
                                    style: { $: 'layout.horizontal' },
                                    controls: [
                                        { $: 'editable-boolean',
                                            style: { $: 'editable-boolean.expand-collapse' },
                                            databind: '%$TgpTypeCtrl/expanded%',
                                            features: { $: 'hidden', showCondition: { $not: { $: 'studio.isCustomStyle', path: '%$path%' } } }
                                        },
                                        { $: 'button',
                                            title: 'customize style',
                                            style: { $: 'button.studio-properties-toolbar', icon: 'build' },
                                            action: [
                                                { $: 'studio.makeLocal', path: '%$path%' },
                                                { $: 'studio.openEditStyle', path: '%$path%' },
                                            ],
                                            features: { $: 'hidden', showCondition: { $not: { $: 'studio.isCustomStyle', path: '%$path%' } } }
                                        },
                                        { $: 'button',
                                            title: 'open sublime',
                                            style: { $: 'button.studio-properties-toolbar', icon: 'code' },
                                            action: { $: 'studio.openSublime', path: '%$path%' },
                                        },
                                        { $: 'button',
                                            title: 'edit custom style',
                                            style: { $: 'button.md-icon', icon: 'input' },
                                            action: { $: 'studio.openEditStyle', path: '%$path%' },
                                            features: { $: 'hidden', showCondition: { $: 'studio.isCustomStyle', path: '%$path%' } }
                                        },
                                        { $: 'button',
                                            title: 'share style',
                                            style: { $: 'button.md-icon', icon: 'add' },
                                            action: { $: 'studio.shareStyle', path: '%$path%' },
                                            features: { $: 'hidden', showCondition: false } //{$: 'studio.isCustomStyle', path: '%$path%' } }
                                        },
                                    ]
                                },
                            ]
                        },
                        { $: 'group',
                            controls: { $: 'studio.properties', path: '%$path%' },
                            features: [
                                { $: 'group.watch', data: { $: 'studio.compName', path: '%$path%' } },
                                { $: 'hidden', showCondition: { $and: [
                                            '%$TgpTypeCtrl.expanded%',
                                            { $not: { $: 'studio.isCustomStyle', path: '%$path%' } }
                                        ]
                                    } },
                                { $: 'css', css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}' },
                            ],
                        }
                    ]
                }
            });
            // jb.component('studio.propertyField-JBEditor',{
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
            jb_core_1.jb.component('studio.propertyField-Javascript', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    controls: [
                        { $: 'button',
                            text: '(..)',
                            cssClass: 'jb-studio-primitive-javascript',
                            action: { $: 'studio.openjsEditor', path: '%$path%' }
                        },
                        { $: 'button',
                            title: 'more',
                            style: { $: 'button.studio-properties-toolbar', icon: 'more_vert' },
                            action: { $: 'studio.open-property-menu', path: '%$path%' },
                        },
                    ]
                }
            });
            jb_core_1.jb.component('studio.propertyField-Array', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    controls: [
                        // { $: 'label', text: '{{param}}:' },
                        { $: 'itemlist',
                            cssClass: 'jb-studio-array',
                            items: { $: 'studio.children', path: '%$path%' },
                            itemVariable: 'optionProfile',
                            controls: [
                                { $: 'expandableSection', title: { $: 'studio.propertyArrayItemName' },
                                    style: { $: 'expandableSection.studioExpandableInArray' },
                                    controls: { $: 'studio.properties', topProfile: '{{$optionProfile}}' }
                                },
                                { $: 'button', text: ['Delete {{$param}}', { $: 'replace', find: 's$', replace: '' }],
                                    style: { $: 'customCssStyle', base: { $: 'button.imageOnly' }, cssClass: 'jb-studio-delete-array-item' },
                                    action: { $: 'studio.deleteArrayItem', profile: '{{$profile}}', param: '{{$param}}', item: '{{$optionProfile}}' }
                                }
                            ],
                            features: [
                                { $show: function (context) {
                                        return context.vars.control.items.length > 0;
                                    }
                                }
                            ]
                        },
                        { $: 'button',
                            text: ['Add {{$param}}', { $: 'replace', find: 's$', replace: '' }],
                            style: 'jb-studio-add-array-item',
                            action: {
                                $: 'studio.selectPT',
                                type: '{{$paramDef.type}}',
                                selectAction: [
                                    { $: 'studio.addToProfileArray', profile: '{{$profile}}', param: '{{$param}}' },
                                    function (context) {
                                        setTimeout(function () {
                                            // auto open the last added profile
                                            var $button = context.vars.$dialog.originalContext.vars.control.$el;
                                            var $lastPanel = $button.parent().find('.panel').last();
                                            $lastPanel.find('.panel-heading').first().click();
                                            $lastPanel.find('input,textarea').first().focus();
                                        }, 20);
                                    }
                                ]
                            }
                        }
                    ],
                    features: [
                        { $: 'hidePropertyTitle' }
                    ]
                }
            });
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
            jb_core_1.jb.component('studio.propertyField', {
                type: 'control',
                params: {
                    path: { as: 'string' },
                },
                impl: function (context, path) {
                    var fieldPT = 'studio.propertyField-Label';
                    var val = studio.model.val(path);
                    var valType = typeof val;
                    var paramDef = studio.model.paramDef(path);
                    if (valType == 'function')
                        fieldPT = 'studio.propertyField-Javascript';
                    else if (paramDef.as == 'number')
                        fieldPT = 'studio.propertyField-slider';
                    else if (paramDef.options)
                        fieldPT = 'studio.propertyField-enum';
                    else if (['data', 'boolean'].indexOf(paramDef.type || 'data') != -1 && ['number', 'string', 'undefined'].indexOf(valType) != -1) {
                        if (studio.model.compName(path))
                            fieldPT = 'studio.propertyField-JBEditor';
                        else
                            fieldPT = 'studio.propertyField-Primitive';
                    }
                    else
                        fieldPT = 'studio.propertyField-TgpType';
                    return context.run({ $: fieldPT, path: path });
                }
            });
            // ********************* styles **********************
            jb_core_1.jb.component('tabControl.studioPropertiesAccordion', {
                type: 'tabControl.style',
                impl: function () {
                    return {
                        jbTemplate: '<div><div class="panel"><div class="panel-heading"><div class="panel-title"><div class="panel-toggle"/><a href="javascript:()"/></div></div><div class="panel-collapse"><div class="panel-body"></div></div></div>',
                        cssClass: "jb-studio-accordion",
                        init: function (cmp) {
                            control.$('.panel-body').css('max-height', $(window).height() - 250);
                            jb_accordion(cmp);
                        }
                    };
                }
            });
            jb_core_1.jb.component('expandableSection.studioExpandableInArray', {
                type: 'expandableSection.style',
                impl: function () {
                    return {
                        jbTemplate: '<div class="panel"><div class="panel-heading"><div class="panel-title"><div class="panel-toggle"/><a href="javascript:()"/></div></div><div class="panel-collapse"><div class="panel-body"></div></div>',
                        cssClass: "jb-studio-array-expandable",
                        init: function (cmp) {
                            jb_expandableSection(cmp);
                        }
                    };
                } });
            jb_core_1.jb.component('property-sheet.studio-properties', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div>\n      <div *ngFor=\"var ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\">{{ctrl.title}}</label>\n        <jb_comp [comp]=\"ctrl.comp\" class=\"property-ctrl\"></jb_comp>\n      </div>\n      </div>\n    ",
                    css: ".property { margin-bottom: 5px; display: flex }\n      .property:last-child { margin-bottom:0px }\n      .property>.property-title {\n        min-width: 90px;\n        width: 90px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n        margin-right: 10px;\n      },\n      .property>*:last-child { margin-right:0 }"
                }
            });
            jb_core_1.jb.component('button.studio-properties-toolbar', {
                type: 'button.style',
                params: {
                    icon: { as: 'string', default: 'code' },
                },
                impl: { $: 'customStyle',
                    template: "<span><button md-icon-button md-button aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\">\n                <i class=\"material-icons\">%$icon%</i>\n              </button></span>",
                    css: "button { width: 24px; height: 24px; padding: 0; margin-top: -3px;}\n     \t.material-icons { font-size:12px;  }\n      "
                }
            });
            jb_core_1.jb.component('button.studio-edit-js', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<span><button (click)="clicked()" [title]="title">{}</button></span>',
                    css: "{ margin-top: -2px; margin-left: -3px; margin-right: -5px;}\n  \t\t button { cursor: pointer; \n            font: 12px sans-serif; \n            border: none; \n            background: transparent; \n            color: #91B193; \n            text-shadow: 0 1px 0 #fff; \n            font-weight: 700; \n            opacity: .8;\n        }\n        button:hover { opacity: 1 }"
                }
            });
            jb_core_1.jb.component('button.studio-delete', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<span><button (click)="clicked()" [title]="title">&#215;</button></span>',
                    css: "{ margin-left: -4px; margin-top: -1px }\n      button {\n            cursor: pointer; \n            font: 16px sans-serif; \n            border: none; \n            background: transparent; \n            color: #000; \n            text-shadow: 0 1px 0 #fff; \n            font-weight: 700; \n            opacity: .2;\n        }\n        button:hover { opacity: .5 }"
                }
            });
            jb_core_1.jb.component('button.popup-menu', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<span><button (click)="clicked()" [title]="title"></button></span>',
                    css: "\n\t\tbutton { border: none; cursor: pointer;  width: 0px;  height: 0px;  \n\t\t\tmargin: 8px 0 0 6px;  border-top: 5px solid #91B193;  border-bottom: 3px solid transparent;  border-right: 4px solid transparent;  border-left: 4px solid transparent;\n\t\t  display: inline-block;  vertical-align: top; padding: 0; background: transparent;}\n\t\tbutton:hover { border-top: 5px solid #6A886C; }\n\t\tbutton:focus { outline: none; }\n\t\t"
                }
            });
            jb_core_1.jb.component('studio.tgp-path-options', {
                type: 'picklist.options',
                params: {
                    path: { as: 'string' },
                },
                impl: function (context, path) { return studio.model.PTsOfPath(path).map(function (op) { return { code: op, text: op }; }); }
            });
            jb_core_1.jb.component('studio.tgp-type-options', {
                type: 'picklist.oopions',
                params: {
                    type: { as: 'string' }
                },
                impl: function (context, type) { return studio.model.PTsOfType(type).map(function (op) { return { code: op, text: op }; }); }
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
