jb_tests('ng-ui-tests', {
    label: { $: 'ng2-ui-test',
        control: { $: 'label', title: 'Hello World2' },
        expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
    },
    button: { $: 'ng2-ui-test',
        control: { $: 'button', title: 'ccc' },
        expectedHtmlResult: { $: 'contains', text: 'cc' }
    },
    'button.md-icon': { $: 'ng2-ui-test',
        control: { $: 'button',
            title: 'ccc',
            style: { $: 'button.md-icon', icon: 'save' },
        },
        expectedHtmlResult: { $: 'contains', text: 'cc' }
    },
    group: { $: 'ng2-ui-test',
        control: { $: 'group', controls: [
                { $: 'button', title: 'button1' },
                { $: 'label', title: 'label1' },
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['button1', 'label1'] }
    },
    'md-expandable-group': { $: 'ng2-ui-test',
        control: { $: 'group', title: 'test1',
            style: { $: 'group.md-expandable' },
            controls: [
                { $: 'button', title: 'button1' },
                { $: 'label', title: 'label1' },
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['test1', 'button1', 'label1'] }
    },
    buttonClick: { $: 'ng2-ui-test',
        control: { $: 'button',
            //style :{$: 'button.x'}, 
            title: 'Click Me',
            action: function () { return alert(1); }
        },
        expectedHtmlResult: true
    },
    'button.x': { $: 'ng2-ui-test',
        control: { $: 'button',
            style: { $: 'button.x' },
            title: 'Click Me',
            action: function () { return alert(1); }
        },
        expectedHtmlResult: true
    },
    resource: { $: 'ng2-ui-test',
        control: { $: 'button', title: '%$person.name%' },
        expectedHtmlResult: { $: 'contains', text: ['Homer'] },
    },
    styles: { $: 'ng2-ui-test',
        control: { $: 'label',
            title: 'Hello World2',
            features: { $css: '{color: cyan; font-weight: bold}' },
        },
        expectedHtmlResult: { $: 'contains', text: ['cyan'] }
    },
    waitFor: { $: 'ng2-ui-test',
        waitFor: '%$wait2sec%',
        control: { $: 'group',
            controls: { $: 'label', title: 'after %$wait2sec% second delay' },
            features: { $: 'wait', for: '%$wait2sec%' }
        },
        expectedHtmlResult: { $: 'contains', text: ['after 2'] },
    },
    waitForErrorPromise: { $: 'ng2-ui-test',
        waitFor: '%$err2sec%',
        control: { $: 'group',
            controls: { $: 'label', title: 'after %$err2sec% second delay' },
            features: { $: 'wait', for: '%$err2sec%' }
        },
        expectedHtmlResult: { $: 'contains', text: ['simulate error'] },
    },
    itemlist: { $: 'ng2-ui-test',
        control: { $: 'itemlist', items: '%$people%',
            controls: { $: 'label', title: '%$item.name% - %name%' },
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer Simpson - Homer Simpson', 'Bart Simpson - Bart Simpson'] },
    },
    'itemlist-DD': { $: 'ng2-ui-test', control: { $: 'group', controls: [
                { $: 'itemlist', items: '%$people%',
                    controls: { $: 'label', title: '%name%' },
                    features: [
                        { $: 'itemlist.selection', databind: '%$globals/selectedPerson%', autoSelectFirst: true },
                        { $: 'itemlist.keyboard-selection', autoFocus: true },
                        { $: 'itemlist.drag-and-drop' },
                    ],
                },
                { $: 'itemlist', items: '%$people%',
                    controls: { $: 'label', title: '%name%' }
                },
            ] },
        expectedHtmlResult: { $: 'contains', text: ['Homer Simpson - Homer Simpson', 'Bart Simpson - Bart Simpson'] },
    },
    tree: { $: 'ng2-ui-test',
        control: { $: 'json-editable-tree',
            nodeModel: { $: 'tree.json',
                object: '%$personWithAddress%', rootPath: 'personWithAddress'
            },
        },
        expectedHtmlResult: { $: 'contains', text: [''] },
    },
    'tree-DD': { $: 'ng2-ui-test',
        control: { $: 'tree', cssClass: 'jb-control-tree',
            nodeModel: { $: 'tree.json',
                object: '%$personWithChildren%', rootPath: 'Homer'
            },
            features: [
                { $: 'tree.selection' },
                { $: 'tree.drag-and-drop' },
                { $: 'tree.keyboard-selection' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: [''] },
    },
    itemlistWithAddButton: { $: 'ng2-ui-test',
        control: { $: 'group', controls: [
                { $: 'itemlist',
                    items: '%$people%',
                    controls: { $: 'label', title: '%$item.name% - %name%' },
                },
                { $: 'button', title: 'add',
                    action: function (ctx) { return ctx.exp('%$people%').push({ name: "Magi" }); }
                }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer Simpson - Homer Simpson', 'Bart Simpson - Bart Simpson'] },
    },
    itemlistSelection: { $: 'ng2-ui-test',
        control: { $: 'itemlist', items: '%$people%',
            controls: { $: 'label', title: '%$item.name%' },
            features: [
                { $: 'itemlist.selection', databind: '%$globals/selectedPerson%', autoSelectFirst: true },
            ],
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer Simpson'] },
    },
    itemlistWithMD: { $: 'ng2-ui-test', waitForPromise: { $delay: 50 },
        control: { $: 'group',
            controls: [
                { $: 'itemlist', items: '%$people%',
                    controls: { $: 'label', title: '%$item.name%' },
                    features: [
                        { $: 'itemlist.selection', databind: '%$globals/selectedPerson%', autoSelectFirst: true },
                        { $: 'itemlist.keyboard-selection', autoFocus: true },
                    ],
                },
                { $: 'group',
                    features: { $: 'group.data', data: '%$globals/selectedPerson%' },
                    controls: [
                        { $: 'label', title: '%name% selected' },
                    ]
                }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer Simpson', 'Homer Simpson selected'] },
    },
    'ngShow-label': { $: 'ng2-ui-test',
        control: { $: 'label',
            title: 'Dan',
            features: { $ngAtts: { '[hidden]': '12==12' } }
        },
        expectedHtmlResult: { $contains: ['hidden', 'Dan'] }
    },
    'ngShow-list': { $: 'ng2-ui-test',
        control: { $: 'itemlist',
            items: '%$people%',
            controls: { $: 'label',
                title: '%$item.name% - %age%',
                features: { $ngAtts: { '[hidden]': '%age%==12' } }
            },
        },
        expectedHtmlResult: { $contains: ['Homer', 'Marge', 'hidden', 'Bart'] }
    },
    // not working - no ngIf on host !!!!
    ngIf: { $: 'ng2-ui-test',
        control: { $: 'itemlist',
            items: '%$people%',
            controls: { $: 'label',
                title: '%$item.name% - %age%',
                atts: { 'ngIf': '%age%>12' }
            },
        },
        expectedHtmlResult: { $and: [
                { $contains: ['Homer', 'Marge'] },
            ]
        }
    },
    'layout.horizontal': { $: 'ng2-ui-test',
        control: { $: 'group',
            style: { $: 'layout.horizontal' },
            controls: [
                { $: 'editable-text', title: 'name', databind: '%$person/name%' },
                { $: 'editable-text', title: 'address', databind: '%$person/address%' },
            ],
        },
        expectedHtmlResult: { $: 'contains', text: ['input'] },
    },
    'editable-text': { $: 'ng2-ui-test',
        control: { $: 'editable-text',
            title: 'name',
            databind: '%$person/name%'
        },
        expectedHtmlResult: { $: 'contains', text: ['input'] },
    },
    'editable-text-in-group': { $: 'ng2-ui-test',
        control: { $: 'group',
            controls: [
                { $: 'editable-text', title: 'name', databind: '%$person/name%' },
                { $: 'editable-text', title: 'name', databind: '%$person/name%' },
                { $: 'label', title: '%$person/name%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer'] },
    },
    'editable-text-with-jb-val': { $: 'ng2-ui-test',
        control: { $: 'group',
            $vars: {
                a1: function (ctx) {
                    return {
                        $jb_val: function (value) {
                            if (value == undefined)
                                return jbart.__test_jb_val || 'Marge';
                            else
                                jbart.__test_jb_val = value;
                        }
                    };
                }
            },
            controls: [
                { $: 'editable-text', title: 'name', databind: '%$a1%' },
                { $: 'editable-text', title: 'name', databind: '%$a1%' },
                { $: 'picklist', title: 'name', databind: '%$a1%',
                    options: { $: 'picklist.optionsByComma',
                        options: 'Homer,Marge'
                    }
                },
                { $: 'label', title: '%$a1%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer'] },
    },
    'editable-text-in-md-property-sheet': { $: 'ng2-ui-test',
        control: { $: 'group',
            controls: [
                { $: 'group',
                    controls: [
                        { $: 'editable-text', title: 'name', databind: '%$person/name%', style: { $: 'editable-text.md-input' } },
                        { $: 'editable-text', title: 'name', databind: '%$person/name%', style: { $: 'editable-text.md-input' } },
                    ]
                },
                { $: 'label', title: '%$person/name%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer'] },
    },
    'property-sheet.titles-above': { $: 'ng2-ui-test',
        control: { $: 'group',
            controls: [
                { $: 'group',
                    style: { $: 'property-sheet.titles-above-float-left' },
                    controls: [
                        { $: 'editable-text', title: 'name', databind: '%$person/name%' },
                        { $: 'editable-text', title: 'address', databind: '%$person/address%' },
                    ]
                },
                { $: 'label', title: '%$person/name%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer'] },
    },
    'property-sheet.titles-left': { $: 'ng2-ui-test',
        control: { $: 'group',
            controls: [
                { $: 'group',
                    style: { $: 'property-sheet.titles-left' },
                    controls: [
                        { $: 'editable-text', title: 'name', databind: '%$person/name%' },
                        { $: 'editable-text', title: 'address', databind: '%$person/address%' },
                    ]
                },
                { $: 'label', title: '%$person/name%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Homer'] },
    },
    'editable-number': { $: 'ng2-ui-test',
        control: { $: 'group', controls: [
                { $: 'editable-number', title: 'age',
                    databind: '%$person/age%',
                    style: { $: 'editable-number.slider' },
                },
                { $: 'editable-number', title: 'age',
                    databind: '%$person/age%',
                },
                { $: 'label', title: '%$person/age%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['42'] },
    },
    'editable-boolean': { $: 'ng2-ui-test',
        control: { $: 'group', controls: [
                { $: 'editable-boolean',
                    title: 'male',
                    databind: '%$person/male%',
                    style: { $: 'editable-boolean.md-switch' },
                },
                { $: 'label', title: '%$person/male%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['switch'] },
    },
    'editable-boolean-settings': { $: 'ng2-ui-test',
        control: { $: 'group', controls: [
                { $: 'editable-boolean',
                    title: 'male',
                    databind: '%$person/isMale%',
                    style: { $: 'editable-boolean.md-switch' },
                    yesNoSettings: { $: 'editable-boolean.yes-no-settings',
                        textForTrue: 'male',
                        textForFalse: 'female',
                        codeForTrue: 'yes',
                        codeForFalse: 'no',
                    }
                },
                { $: 'label', title: '%$person/isMale%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['male', 'yes'] },
    },
    'editable-boolean.expand-collapse': { $: 'ng2-ui-test',
        control: { $: 'group',
            $vars: {
                MyWidget: { $: 'object', expanded: true }
            },
            controls: [
                { $: 'editable-boolean',
                    style: { $: 'editable-boolean.expand-collapse' },
                    databind: '%$MyWidget/expanded%',
                },
                { $: 'label', title: 'inner text',
                    features: { $: 'hidden', showCondition: '%$MyWidget.expanded%' }
                }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['frame'] },
    },
    'code-mirror': { $: 'ng2-ui-test',
        control: { $: 'group',
            $vars: { code: { $: 'object', text: 'function f1() { return 15 }' } },
            controls: [
                { $: 'editable-text',
                    databind: '%$code/text%',
                    style: { $: 'editable-text.codemirror', mode: 'javascript' }
                },
                { $: 'label', title: '%$code/text%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['function'] },
    },
    'prettyPrintComp': { $: 'ng2-ui-test', waitForPromise: { $delay: 50 },
        control: { $: 'group', controls: [
                { $: 'text',
                    text: function (ctx) { return jb_prettyPrintComp('inner-label1-tst', jbart.comps['inner-label1-tst']); },
                    style: { $: 'text.multi-line' }
                },
                { $: 'text',
                    text: function (ctx) { return jb_prettyPrintComp('editable-text.codemirror', jbart.comps['editable-text.codemirror']); },
                    style: { $: 'text.codemirror' }
                },
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ["as: 'ref'"] },
    },
    picklist: { $: 'ng2-ui-test',
        control: { $: 'group', controls: [
                { $: 'group',
                    style: { $: 'property-sheet.titles-left' },
                    controls: { $: 'picklist',
                        title: 'city',
                        databind: '%$personWithAddress/address/city%',
                        options: { $: 'picklist.optionsByComma',
                            options: 'Springfield,New York,Tel Aviv,London'
                        }
                    }
                },
                { $: 'label', title: '%$personWithAddress/address/city%' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Springfield', 'New York'] },
    },
    dialog: { $: 'ng2-ui-test', waitForPromise: { $delay: 5 },
        control: { $: 'button', title: 'Open Dialog', $click: true,
            action: { $: 'openDialog',
                title: 'Hello',
                content: { $: 'label', title: 'Hello Dialog' },
                features: { $: 'dialogFeature.dragTitle', id: "dialog-test" },
            }
        },
        expectedHtmlResult: { $: 'contains', text: ['Hello Dialog'], lookin: 'popups' },
    },
    'dialog-md-alert': { $: 'ng2-ui-test', waitForPromise: { $delay: 5 },
        control: { $: 'button', title: 'Open Dialog', $click: true,
            action: { $: 'openDialog',
                style: { $: 'dialog.md-dialog-with-close' },
                title: 'Hello',
                content: { $: 'label', title: 'Hello Dialog' },
            }
        },
        expectedHtmlResult: { $: 'contains', text: ['Hello Dialog'], lookin: 'popups' },
    },
    'md-dialog-modal': { $: 'ng2-ui-test', waitForPromise: { $delay: 5 },
        control: { $: 'button', title: 'Open Dialog', $click: true,
            action: { $: 'openDialog',
                modal: true,
                style: { $: 'dialog.md-dialog-ok-cancel' },
                title: 'Hello',
                content: { $: 'label', title: 'Hello Dialog' },
            }
        },
        expectedHtmlResult: { $: 'contains', text: ['Hello Dialog', 'OK'], lookin: 'popups' },
    },
    'popup-menu': { $: 'ng2-ui-test',
        control: { $: 'pulldown.topMenuItem', title: 'File', open: true,
            controls: [
                { $: 'pulldown.menu-item', title: 'Open ...' },
                { $: 'pulldown.menu-item', title: 'Save', spritePosition: '4,0' }
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['Open'], lookin: 'popups' },
    },
    'dynamic-controls': { $: 'ng2-ui-test',
        control: { $: 'group',
            style: { $: 'property-sheet.titles-left' },
            controls: { $: 'dynamic-controls',
                controlItems: ['name', 'age'],
                genericControl: { $: 'editable-text', databind: '%$person/{%$controlItem%}%', title: '%$controlItem%' }
            }
        },
        expectedHtmlResult: { $: 'contains', text: ['name', 'age'] },
    },
    'tab-control': { $: 'ng2-ui-test',
        control: { $: 'tab-control',
            tabs: [
                { $: 'group', title: 'tab1', controls: { $: 'label', title: 'in tab1' } },
                { $: 'group', title: 'tab2', controls: { $: 'label', title: 'in tab2' } },
            ]
        },
        expectedHtmlResult: { $: 'contains', text: ['tab1', 'in tab1', 'tab2'] },
    },
    // 'tab-control.accordion' :{$: 'ng2-ui-test', 
    //   control :{$: 'tab-control',
    //       style :{$: 'tab-control.accordion'},
    //       tabs:[
    //         {$: 'group', title: 'tab1', controls :{$: 'label', title: 'in tab1' }},
    //         {$: 'group', title: 'tab2', controls :{$: 'label', title: 'in tab2' }},
    //     ]
    //   },
    //   expectedHtmlResult :{$: 'contains', text: ['tab1','in tab1','tab2'] },
    // },
    'inner-label': { $: 'ng2-ui-test',
        control: { $: 'inner-label3-tst', title: 'Hello World2' },
        expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
    },
});