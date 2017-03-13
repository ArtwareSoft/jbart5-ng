jb.resource('ui-tests','people',[
  { "name": "Homer Simpson" ,age: 42 , male: true},
  { "name": "Marge Simpson" ,age: 38 , male: false},
  { "name": "Bart Simpson"  ,age: 12 , male: true}
]);

jb.resource('ui-tests','person',{ 
  name: "Homer Simpson", 
  male: true,
  isMale: 'yes', 
  age: 42 
});

jb.resource('ui-tests','personWithAddress',{ 
  "name": "Homer Simpson",
  "address": {
    "city": "Springfield",
    "street": "742 Evergreen Terrace"
  }
})

jb.resource('ui-tests','personWithChildren',{ 
  name: "Homer Simpson", 
  children: [{ name: 'Bart' }, { name: 'Lisa' }, { name: 'Maggie' } ],
  friends: [{ name: 'Barnie' } ],
})

jb.resource('ui-tests','wait5sec', new Promise(res => setTimeout(()=>{res(5)}, 5000)));
jb.resource('ui-tests','wait2sec', new Promise(res => setTimeout(()=>{res(2)}, 2000)));
//jb.resource('ui-tests','err2sec', new Promise((res,err) => setTimeout(()=>err('simulate error'), 2000)));

jb.component('inner-label1-tst', {
  params: [
     { id: 'title', essential: true, dynamic: true },
  ],
  impl :{$: 'label', cssClass: 'inner-label1-tst', title: {$call: 'title' }}
})

jb.component('inner-label2-tst', {
  params: [
     { id: 'title', essential: true, dynamic: true },
  ],
  impl :{$: 'inner-label1-tst', cssClass: 'inner-label2-tst', title: {$call: 'title' }}
})

jb.component('inner-label3-tst', {
  params: [
     { id: 'title', essential: true, dynamic: true },
  ],
  impl :{$: 'inner-label2-tst', cssClass: 'inner-label3-tst', title: {$call: 'title' }}
})

jb.component('ui-test.label', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'label', title: 'Hello World2',
    features :{$: 'css.margin', top: '30', left: '24' }
   },
  expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
  },
})

jb.component('ui-test.expandable-group', {
  impl :{$: 'ng2-ui-test',  
    control :{$: 'group', title: 'test1',
      style :{$: 'group.expandable'}, 
      controls: 
        [ 
          { $: 'button', title: 'button1' } ,
          { $: 'label' , title: 'label1' } ,
        ]
    },
    expectedHtmlResult: { $: 'contains', text: ['test1','button1','label1'] }
  },
})

jb.component('ui-test.button', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'button', title: 'ccc' },
  expectedHtmlResult: { $: 'contains', text: 'cc' }
},
})

jb.component('ui-test.group', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', controls: 
    [ 
      { $: 'button', title: 'button1' } ,
      { $: 'label' , title: 'label1' } ,
    ]
  },
  expectedHtmlResult: { $: 'contains', text: ['button1','label1'] }
},
})

jb.component('ui-test.group-horizontal', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', 
    style: {$: 'layout.horizontal' },
    controls: 
      [ 
        { $: 'button', title: 'button1' } ,
        { $: 'label' , title: 'label1' } ,
      ]
  },
  expectedHtmlResult: { $: 'contains', text: ['button1','label1'] }
},
})

jb.component('ui-test.group-flex', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', 
    style: {$: 'layout.flex', direction: 'row' },
    controls: 
      [ 
        { $: 'button', title: 'button1' } ,
        { $: 'label' , title: 'label1' } ,
      ]
  },
  expectedHtmlResult: { $: 'contains', text: ['button1','label1'] }
},
})

jb.component('ui-test.button-click', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'button', 
    //style :{$: 'button.x'}, 
    title: 'Click Me', 
    action: () => alert(1) 
  },
  expectedHtmlResult: true
},
})

jb.component('ui-test.button-x', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'button', 
    style :{$: 'button.x'}, 
    title: 'Click Me', 
    action: () => alert(1) 
  },
  expectedHtmlResult: true
},
})

jb.component('ui-test.resource', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'button', title: '%$person.name%' } ,
  expectedHtmlResult: { $: 'contains', text: ['Homer'] },
},
})

jb.component('ui-test.features-css', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'label', 
    title: 'Hello World2', 
    features :{ $css: '{color: cyan; font-weight: bold}' },
  },
  expectedHtmlResult: { $: 'contains', text: ['Hello'] }
},
})

jb.component('ui-test.itemlist', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'itemlist', items: '%$people%', 
      controls :{ $: 'label', title: '%$item.name% - %name%' }, 
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson - Homer Simpson', 'Bart Simpson - Bart Simpson'] },
},
})

jb.component('ui-test.itemlist-with-select', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'itemlist', items: '%$people%', 
      controls :{ $: 'label', title: '%$item.name% - %name%' }, 
      features :{ $: 'itemlist.selection' }, 
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson - Homer Simpson', 'Bart Simpson - Bart Simpson'] },
},
})

jb.component('ui-test.itemlist-DD', {
  impl :{$: 'ng2-ui-test', control :{$: 'group', controls: 
  [
    { $: 'itemlist', items: '%$people%', 
        controls :{$: 'label', title: '%name%' }, 
        features: [
            { $: 'itemlist.selection', databind: '%$globals/selectedPerson%', autoSelectFirst: true }, 
            { $: 'itemlist.keyboard-selection', autoFocus: true },
            { $: 'itemlist.drag-and-drop' },
        ],
    },
    { $: 'itemlist', items: '%$people%',
      dynamicItems: true,
      controls :{$: 'label', title: '%name%' } 
    },
  ]},
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson', 'Bart Simpson'] },
},
})

jb.component('ui-test.itemlist-basic', {
  impl :{$: 'ng2-ui-test', control :
    { $: 'itemlist', items: '%$people%',
      controls :{$: 'label', title: '%name%' } 
    },
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson', 'Bart Simpson'] },
},
})

jb.component('ui-test.itemlist-heading', {
  impl :{$: 'ng2-ui-test', control :{$: 'group', controls: 
  [
    { $: 'itemlist-with-groups', items: '%$people%', 
        controls :{$: 'label', title: '%name%' }, 
        groupBy :{$: 'itemlist-heading.group-by', 
          itemToGroupID :{$if: '%male%', then: 'male', else: 'female'}
        },
//        headingCtrl :{$: 'label', title: '%title%' }, 
        features: [
            { $: 'itemlist.selection', databind: '%$globals/selectedPerson%', autoSelectFirst: true }, 
            { $: 'itemlist.keyboard-selection', autoFocus: true },
            {$: 'css', css: '.jb-item:not(.heading) { margin-left: 30px }' }
        ],
    },
  ]},
  expectedHtmlResult: { $: 'contains', text: ['female', 'Marge', 'male', 'Homer Simpson', 'Bart Simpson'] },
}
})

jb.component('ui-test.tree', {
  impl :{$: 'ng2-ui-test',  
  control: {$: 'tree',
        nodeModel :{$: 'tree.json-read-only', 
          object: '%$personWithAddress%', rootPath: 'personWithAddress' 
        },
    features: [
        { $: 'tree.selection' },
        { $: 'tree.keyboard-selection'} 
    ] 
  },
  expectedHtmlResult :{$: 'contains', text: ['address'] } ,
},
})

jb.component('ui-test.tree-DD', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'tree',
    nodeModel :{$: 'tree.json', 
      object: '%$personWithChildren%', rootPath: 'Homer' 
    },
    features: [
        { $: 'tree.selection' },
        { $: 'tree.drag-and-drop'},
        { $: 'tree.keyboard-selection'} 
    ] 
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer'] } ,
},
})

jb.component('ui-test.tree-right-click', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'tree',
    nodeModel :{$: 'tree.json-read-only', 
      object: '%$personWithChildren%', rootPath: 'Homer' 
    },
    features: [
        { $: 'tree.keyboard-selection' },
        { $: 'tree.drag-and-drop'},
        { $: 'tree.selection', 
          onDoubleClick :{$: 'openDialog', title: 'double %%',
            features :{$: 'dialog-feature.nearLauncherLocation' }
          },
        },
        { $: 'tree.onMouseRight', 
          action :{$: 'openDialog', title: 'right %%',
            features :{$: 'dialog-feature.nearLauncherLocation' }
          }
        }
    ] 
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer'] } ,
},
})

jb.component('ui-test.itemlist-add-button', {
  impl :{$: 'ng2-ui-test',  
  control: { $: 'group', controls: 
    [
      { $: 'itemlist', 
        items: '%$people%', 
        controls :{$: 'label', title: '%$item.name% - %name%' }, 
      }, 
      { $: 'button', title: 'add', 
        action: (ctx) => ctx.exp('%$people%').push({ name: "Magi"})
      }
    ]
  } ,
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson - Homer Simpson', 'Bart Simpson - Bart Simpson'] },
},
})

jb.component('ui-test.itemlist-selection', {
  impl :{$: 'ng2-ui-test',
  control :{$: 'itemlist', items: '%$people%', 
        controls :{$: 'label', title: '%$item.name%' }, 
        features: [
            { $: 'itemlist.selection', databind: '%$globals/selectedPerson%', autoSelectFirst: true }, 
        ],
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson'] },
},
})

jb.component('ui-test.itemlist-MD', {
  impl :{$: 'ng2-ui-test',
control :{$: 'group', 
  controls: 
    [
      { $: 'itemlist', items: '%$people%', 
        controls :{$: 'label', title: '%$item.name%' }, 
        features: [
            { $: 'itemlist.selection', databind: '%$globals/selectedPerson%', autoSelectFirst: true }, 
            { $: 'itemlist.keyboard-selection', autoFocus: true },
        ],
      },
      { $: 'group', 
        features :{$: 'group.data', data: '%$globals/selectedPerson%', watch1: true} , 
         controls: [
            {$: 'label' , title: '%name% selected' },
          ]
        }
    ]
  } ,
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson', 'Homer Simpson selected'] },
},
})

// jb.component('ui-test.ngShow-label', {
// //   impl :{$: 'ng2-ui-test',  
//   control :{$: 'label', 
//         title: 'Dan',
//         features :{$ngAtts: {'[hidden]': '12==12'} }
//    }, 
//     expectedHtmlResult: { $contains: ['hidden' , 'Dan'] }
// },
// })

// jb.component('ui-test.ngShow-list', {
// //   impl :{$: 'ng2-ui-test',  
//   control :{$: 'itemlist', 
//       items: '%$people%', 
//       controls :{$: 'label', 
//         title: '%$item.name% - %age%',
//         features :{ $ngAtts: {'[hidden]': '%age%==12'} }
//       }, 
//     },
//     expectedHtmlResult: { $contains: ['Homer','Marge', 'hidden' , 'Bart'] }
// },
// })

// jb.component('ui-test.ngIf', {
// type: 'test',
//   impl :{$: 'ng2-ui-test', 
//   control :{$: 'itemlist', 
//       items: '%$people%', 
//       controls :{$: 'label', 
//         title: '%$item.name% - %age%', 
//         atts: {'*ngIf': '%age%>12'}
//       }, 
//     },
//     expectedHtmlResult :{$and: 
//       [
//         { $contains: ['Homer','Marge'] },
// //        { $not: { $contains: 'Bart'}}
//       ]
//     }
// },
// })

jb.component('ui-test.layout-horizontal', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group',
      style :{$: 'layout.horizontal' },
      controls: [
        { $: 'editable-text', title: 'name', databind: '%$person/name%' },
        { $: 'editable-text', title: 'address', databind: '%$person/address%' },
      ],
  },
  expectedHtmlResult: { $: 'contains', text: ['input'] },
},
})

jb.component('ui-test.editable-text', {
  impl :{$: 'ng2-ui-test',  
    control :{$: 'editable-text', 
      title: 'name', 
      databind: '%$person/name%' 
    },
    expectedHtmlResult: { $: 'contains', text: ['input'] },
},
})

jb.component('ui-test.editable-text-in-group', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group',
        controls: [
          { $: 'editable-text', title: 'name', databind: '%$person/name%' },
          { $: 'editable-text', title: 'name', databind: '%$person/name%' },
          { $: 'label', title: '%$person/name%' }
        ]
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer'] },
},
})

jb.component('ui-test.editable-text-with-jb-val', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group',
      $vars: {
        a1 : ctx => { return {
          $jb_val: value => {
            if (value == undefined)
              return jbart.__test_jb_val || 'Marge';
            else
              jbart.__test_jb_val = value;
          }
        }}
      },
      controls: [
          { $: 'editable-text', title: 'name', databind: '%$a1%' },
          { $: 'editable-text', title: 'name', databind: '%$a1%' },
          { $: 'picklist', title: 'name', databind: '%$a1%', 
            options :{$: 'picklist.optionsByComma', 
              options: 'Homer,Marge' 
            } 
          },
          { $: 'label', title: '%$a1%' }
        ]
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer'] },
},
})

jb.component('ui-test.property-sheet.growing', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group',
          style :{$: 'property-sheet.growing'},
          controls: [
              { $: 'editable-text', 
                title: 'name', 
                databind: '%$person/name%',
                features :{$: 'field.toolbar', 
                  toolbar :{$: 'button',
                      title: 'more',
                      style :{$: 'button.mdl-icon-12', icon: 'more_vert' }, 
                    }
                }
              },
              { $: 'editable-text', title: 'age', databind: '%$person/age%' },
          ]
  },
  expectedHtmlResult: { $: 'contains', text: ['name'] },
},
})

jb.component('ui-test.property-sheet.style-on-focus', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group',
          style :{$: 'property-sheet.style-on-focus'},
          controls: [
              { $: 'editable-text', 
                title: 'name', 
                databind: '%$person/name%',
                features : [
                  {$: 'field.toolbar', 
                    toolbar :{$: 'button',
                        title: 'more',
                        style :{$: 'button.mdl-icon-12', icon: 'more_vert' }, 
                      }
                  },
                  {$: 'field.style-on-focus', 
                    style :{$: 'editable-text.codemirror', mode: 'javascript', css: '{margin-left: 30px; z-index: 200; position: relative; width: 300px; height: 200px }'}
                  },
                ]
              },
              { $: 'editable-text', title: 'age', databind: '%$person/age%' },
          ]
  },
  expectedHtmlResult: { $: 'contains', text: ['name'] },
},

})

jb.component('ui-test.property-sheet.titles-above', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group',
    controls : [
      {$: 'group',
            style :{$: 'property-sheet.titles-above-float-left' },
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
})

jb.component('ui-test.property-sheet.titles-left', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group',
    controls : [
      {$: 'group',
            style :{$: 'property-sheet.titles-left' },
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
})

jb.component('ui-test.editable-number', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', controls: 
    [
      {$: 'editable-number', title: 'age',
          databind: '%$person/age%',
          style :{$: 'editable-number.slider'},
      },
      {$: 'editable-number', title: 'age',
          databind: '%$person/age%',
      },
      { $: 'label', title: '%$person/age%' }
    ]
  },
  expectedHtmlResult: { $: 'contains', text: ['42'] },
},

})

jb.component('ui-test.editable-boolean.all-styles', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', controls: 
    [
      {$: 'editable-boolean',
          title: 'male',
          databind: '%$person/male%',
          style :{$: 'editable-boolean.checkbox'},
      },
      {$: 'editable-boolean',
          title: 'gender',
          databind: '%$person/male%',
          textForTrue: 'male',
          textForFalse: 'female',
          style :{$: 'editable-boolean.checkbox-with-title'},
      },
      {$: 'editable-boolean',
          title: 'male',
          databind: '%$person/male%',
          style :{$: 'editable-boolean.md-slide-toggle'},
      },
      { $: 'label', title: '%$person/male%' }
    ]
  },
  expectedHtmlResult: { $: 'contains', text: ['male'] },
},
})

jb.component('ui-test.editable-boolean-settings', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', controls: 
    [
      {$: 'editable-boolean',
          title: 'male',
          style :{$: 'editable-boolean.checkbox-with-title'},
          databind: '%$person/male%',
          textForTrue: 'male',
          textForFalse: 'female',
      },
      { $: 'label', title: '%$person/isMale%' }
    ]
  },
  expectedHtmlResult: { $: 'contains', text: ['male','yes'] },
},
})

jb.component('ui-test.editable-boolean.expand-collapse', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', 
  $vars: {
      MyWidget :{$:'object', expanded: true}
  },
  controls: 
    [
      {$: 'editable-boolean',
          style :{$: 'editable-boolean.expand-collapse'},
          databind: '%$MyWidget/expanded%',
      },
      { $: 'label', title: 'inner text', 
        features :{ $: 'hidden', showCondition: '%$MyWidget.expanded%' }
      }
    ]
  },
  expectedHtmlResult: { $: 'contains', text: ['inner text'] },
},
})

jb.component('ui-test.code-mirror', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', 
    $vars: {
      js: { $: 'object', text: 'function f1() { return 15 }'},
      css: { $: 'object', text: '{ width: 15px; }' },
      html: { $: 'object', text: '<div><span>hello</span></div>' },
    },
    controls: 
    [
      { $: 'editable-text', 
          databind: '%$js/text%',
          style :{$: 'editable-text.codemirror', mode: 'javascript'}
      },
      { $: 'editable-text', 
          databind: '%$css/text%',
          style :{$: 'editable-text.codemirror', mode: 'css'}
      },
      { $: 'editable-text', 
          databind: '%$html/text%',
          style :{$: 'editable-text.codemirror', mode: 'htmlmixed'}
      },
      { $: 'label',  title: '%$js/text%' }
    ]
 },
  expectedHtmlResult: { $: 'contains', text: ['function'] },
},
})

jb.component('ui-test.prettyPrintComp', {
  impl :{$: 'ng2-ui-test',  waitForPromise: {$delay: 50},
  control :{$: 'group', controls: [
      {$: 'text', 
          text: ctx => jb_prettyPrintComp('inner-label1-tst',jbart.comps['inner-label1-tst']),
          style :{$: 'text.multi-line'}
      },
      {$: 'text', 
          text: ctx => jb_prettyPrintComp('editable-text.codemirror',jbart.comps['editable-text.codemirror']),
          style :{$: 'text.codemirror'}
      },
    ]
  },
  expectedHtmlResult: { $: 'contains', text: ["dynamic: true"] },
},
})

jb.component('ui-test.picklist', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', controls: 
      [
        { $: 'group', 
            style :{$: 'property-sheet.titles-left' },
            controls :{$: 'picklist', 
                    title: 'city', 
                    databind: '%$personWithAddress/address/city%', 
                    options :{$: 'picklist.optionsByComma', 
                      options: 'Springfield,New York,Tel Aviv,London' 
                    } 
            }
        },
        { $: 'label',  title: '%$personWithAddress/address/city%' }
      ]
  },
  expectedHtmlResult: { $: 'contains', text: ['Springfield', 'New York'] },
},
})

jb.component('ui-test.picklist-sort', {
   impl :{$: 'data-test', 
    calculate: {$pipeline: [ 
        { $: 'picklist.sorted-options' , 
          options: {$: 'picklist.optionsByComma', options: 'a,b,c,d' },
          marks: 'c:100,d:50,b:0,a:20'
        }, 
        '%text%', 
        {$: 'join'} 
      ]},
    expectedResult :{$: 'contains', text: 'c,d,a' }
  },
})

jb.component('ui-test.picklist-groups', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'group', controls: 
      [
        { $: 'group', 
            style :{$: 'property-sheet.titles-left' },
            controls :{$: 'picklist',
                    style :{$: 'picklist.groups'}, 
                    title: 'city', 
                    databind: '%$personWithAddress/address/city%', 
                    options :{$: 'picklist.optionsByComma', 
                      options: 'US.Springfield,US.New York,Israel.Tel Aviv,UK.London,mooncity' 
                    } 
            }
        },
        { $: 'label',  title: '%$personWithAddress/address/city%' }
      ]
  },
  expectedHtmlResult: { $: 'contains', text: ['Springfield', 'New York'] },
},
})

// jb.component('dialog', {
// //   impl :{$: 'ng2-ui-test', waitForPromise: {$delay: 5},  
//   control :{$: 'button', title: 'Open Dialog', $click: true,
//       action :{$: 'openDialog', 
//         title: 'Hello' , 
//         content :{$: 'label', title: 'Hello Dialog' },      
//         features :{$: 'dialog-feature.dragTitle', id: "dialog-test"}, 
//       } 
//   },
//   expectedHtmlResult: { $: 'contains', text: ['Hello Dialog'], lookin: 'popups' },
// },
// })

// jb.component('popup-menu', {
// //   impl :{$: 'ng2-ui-test', 
//   control :{$: 'pulldown.top-menu-item', title: 'File', open: true,
//       controls: 
//       [
//         { $: 'pulldown.menu-item', title: 'Open ...'} ,
//         { $: 'pulldown.menu-item', title: 'Save', spritePosition: '4,0'}
//       ]
//   },
//   expectedHtmlResult: { $: 'contains', text: ['Open'], lookin: 'popups' },
// },
// })

jb.component('ui-test.dynamic-controls', {
  impl :{$: 'ng2-ui-test', 
  control :{$: 'group',
      style :{$: 'property-sheet.titles-left' },
      controls :{$: 'dynamic-controls', 
          controlItems: {$list: ['name','age']},
          genericControl: { $: 'editable-text', databind: '%$person/{%$controlItem%}%', title: '%$controlItem%' }
      }
  },
  expectedHtmlResult :{$: 'contains', text: ['name','age'] },
},
})

jb.component('ui-test.tabs', {
  impl :{$: 'ng2-ui-test', 
  control :{$: 'tabs',
      tabs:[
        {$: 'group', title: 'tab1', controls :{$: 'label', title: 'in tab1' }},
        {$: 'group', title: 'tab2', controls :{$: 'label', title: 'in tab2' }},
    ]
  },
  expectedHtmlResult :{$and: [ 
    {$: 'contains', text: ['tab1','in tab1'] },
    {$: 'contains', text: 'tab2' },
    {$not: {$: 'contains', text: 'in tab2' } }
  ]},
},
})

jb.component('ui-test.group.accordion', {
  impl :{$: 'ng2-ui-test', disableChangeDetection: false,
  control :{$: 'group',
      style :{$: 'group.accordion'},
      controls:[
        {$: 'group', title: 'tab1', controls :{$: 'label', title: 'in tab1' }},
        {$: 'group', title: 'tab2', controls :{$: 'label', title: 'in tab2' }},
    ]
  },
  expectedHtmlResult :{$: 'contains', text: ['tab1','in tab1','tab2'] },
},
})

jb.component('ui-test.inner-label', {
  impl :{$: 'ng2-ui-test',  
    control :{$: 'inner-label3-tst', title: 'Hello World2' },
    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
},
})

jb.component('ui-test.markdown', {
  impl :{$: 'ng2-ui-test',  
    control :{$: 'markdown', markdown: `| Day     | Meal    | Price |
| --------|---------|-------|
| Monday  | pasta   | $6    |
| Tuesday | chicken | $8    |    ` },
    expectedHtmlResult: { $: 'contains', text: 'table' }
  },
})

jb.component('ui-test.style-by-control', {
  impl :{$: 'ng2-ui-test',  
    control :{$: 'label', 
        title: 'Hello World',
        style :{$: 'style-by-control', 
          modelVar: 'labelModel',
          control :{$: 'button', 
            title: '%$labelModel/title%2',
          }
        }
    },
    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
  },
})

jb.component('ui-test.picklist-as-itemlist', {
  impl :{$: 'ng2-ui-test',  
    control :{$: 'group', 
      controls: [
          {$: 'picklist', 
            style :{$: 'picklist.selection-list', width: '300' } ,
            databind: '%$personWithAddress/address/city%', 
            options :{$: 'picklist.optionsByComma', 
                   options: 'Springfield,New York,Tel Aviv,London' 
            },
          },
          { $: 'label',  title: '%$personWithAddress/address/city%' }
    ]},
    expectedHtmlResult: { $: 'contains', text: ['Springfield', 'New York'] },
  },
})

jb.component('menu-test.menu1', {
  impl :{$: 'menu.menu',
      title: 'main',
      options: [
        {$: 'menu.menu', title: 'File',
          options: [
            {$: 'menu.action', title: 'New' },
            {$: 'menu.action', title: 'Open' },
            {$: 'menu.menu', title: 'Bookmarks',
              options: [
                  {$: 'menu.action', title: 'Google' },
                  {$: 'menu.action', title: 'Facebook' }
              ]
            },
            {$: 'menu.menu', title: 'Friends',
              options: [
                  {$: 'menu.action', title: 'Dave' },
                  {$: 'menu.action', title: 'Dan' }
              ]
            }
          ]
        },
        {$: 'menu.menu', title: 'Edit',
          options: [
            {$: 'menu.action', title: 'Copy' },
            {$: 'menu.action', title: 'Paste' }
          ]
        },
      ]
   }
})

jb.component('menu-test.pulldown', {
  impl :{$: 'ng2-ui-test',  
    control :{$: 'menu.control',
      style :{$: 'menu-style.pulldown'},
      menu :{$: 'menu-test.menu1'},
    },
    expectedHtmlResult :{$: 'contains', text: ['File', 'Edit'] },
  },
})

jb.component('menu-test.context-menu', {
  impl :{$: 'ng2-ui-test',  
    control :{$: 'menu.menu',
      style :{$: 'menu.context-menu'},
      title: 'main', 
      options :{$: 'menu-test.main-menu-options'}
    },
    expectedHtmlResult :{$: 'contains', text: ['File', 'Edit'] },
  },
})

jb.component('menu-test.open-context-menu', {
  impl :{$: 'ng2-ui-test',  
  control :{$: 'button', 
    title: 'open', 
    action :{$: 'menu.open-context-menu', 
      menu :{$: 'menu-test.menu1'},
    }
  },
  expectedHtmlResult :{$: 'contains', text: 'open' },
  },
})
