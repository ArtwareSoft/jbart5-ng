import {jb} from 'jb-core';

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
  params: {
     title: { essential: true, dynamic: true },
  },
  impl :{$: 'label', cssClass: 'inner-label1-tst', title: {$call: 'title' }}
})

jb.component('inner-label2-tst', {
  params: {
     title: { essential: true, dynamic: true },
  },
  impl :{$: 'inner-label1-tst', cssClass: 'inner-label2-tst', title: {$call: 'title' }}
})

jb.component('inner-label3-tst', {
  params: {
     title: { essential: true, dynamic: true },
  },
  impl :{$: 'inner-label2-tst', cssClass: 'inner-label3-tst', title: {$call: 'title' }}
})

jb.component('ui-test.label', {
  type: 'test',
  impl :{$: 'ng2-ui-test',  
  control :{$: 'label', title: 'Hello World2' },
  expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
  },
})

jb.component('ui-test.expandable-group', {
  type: 'test',
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
  type: 'test',
  impl :{$: 'ng2-ui-test',  
  control :{$: 'button', title: 'ccc' },
  expectedHtmlResult: { $: 'contains', text: 'cc' }
},
})

jb.component('ui-test.group', {
  type: 'test',
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

jb.component('ui-test.button-click', {
  type: 'test',
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
  type: 'test',
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
  type: 'test',
  impl :{$: 'ng2-ui-test',  
  control :{$: 'button', title: '%$person.name%' } ,
  expectedHtmlResult: { $: 'contains', text: ['Homer'] },
},
})

jb.component('ui-test.features-css', {
  type: 'test',
  impl :{$: 'ng2-ui-test',  
  control :{$: 'label', 
    title: 'Hello World2', 
    features :{ $css: '{color: cyan; font-weight: bold}' },
  },
  expectedHtmlResult: { $: 'contains', text: ['cyan'] }
},
})

jb.component('ui-test.itemlist', {
  type: 'test',
  impl :{$: 'ng2-ui-test',  
  control :{$: 'itemlist', items: '%$people%', 
      controls :{ $: 'label', title: '%$item.name% - %name%' }, 
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson - Homer Simpson', 'Bart Simpson - Bart Simpson'] },
},
})

jb.component('ui-test.itemlist-with-select', {
  type: 'test',
  impl :{$: 'ng2-ui-test',  
  control :{$: 'itemlist', items: '%$people%', 
      controls :{ $: 'label', title: '%$item.name% - %name%' }, 
      features :{ $: 'itemlist.selection' }, 
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson - Homer Simpson', 'Bart Simpson - Bart Simpson'] },
},
})

jb.component('ui-test.http-get', {
  type: 'test',
  impl:{$: 'ng2-ui-test',  
  control :{$: 'group', 
    controls :{$: 'itemlist', 
        items: '%$peopleFromUrl%',
        controls :{$:'group',
          controls: [ 
            { $: 'label', title: '%name%' }, 
            { $: 'label', title: '%age%' }, 
          ]
        }
    },
    features :{$: 'group.wait', 
      for :{$: 'http.get', url: '/projects/ui-tests/people.json'},
      resource: 'peopleFromUrl', 
      mapToResource: '%people%'        
    }
  },
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson', '42'] },
},
})

jb.component('ui-test.itemlist-DD', {
  type: 'test',
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
  type: 'test',
  impl :{$: 'ng2-ui-test', control :
    { $: 'itemlist', items: '%$people%',
      controls :{$: 'label', title: '%name%' } 
    },
  expectedHtmlResult: { $: 'contains', text: ['Homer Simpson', 'Bart Simpson'] },
},
})

jb.component('ui-test.itemlist-heading', {
  type: 'test',
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
  type: 'test',
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
  type: 'test',
  impl :{$: 'ng2-ui-test',  
  control :{$: 'tree',
    nodeModel :{$: 'tree.json-read-only', 
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

jb.component('ui-test.itemlist-add-button', {
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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
        features :{$: 'group.data', data: '%$globals/selectedPerson%'} , 
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
//   type: 'test',
//   impl :{$: 'ng2-ui-test',  
//   control :{$: 'label', 
//         title: 'Dan',
//         features :{$ngAtts: {'[hidden]': '12==12'} }
//    }, 
//     expectedHtmlResult: { $contains: ['hidden' , 'Dan'] }
// },
// })

// jb.component('ui-test.ngShow-list', {
//   type: 'test',
//   impl :{$: 'ng2-ui-test',  
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
  type: 'test',
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
  type: 'test',
  impl :{$: 'ng2-ui-test',  
    control :{$: 'editable-text', 
      title: 'name', 
      databind: '%$person/name%' 
    },
    expectedHtmlResult: { $: 'contains', text: ['input'] },
},
})

jb.component('ui-test.editable-text-in-group', {
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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
                      style :{$: 'button.md-icon-12', icon: 'more_vert' }, 
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
  type: 'test',
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
                        style :{$: 'button.md-icon-12', icon: 'more_vert' }, 
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
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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
  type: 'test',
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

jb.component('ui-test.picklist-groups', {
  type: 'test',
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
//   type: 'test',
//   impl :{$: 'ng2-ui-test', waitForPromise: {$delay: 5},  
//   control :{$: 'button', title: 'Open Dialog', $click: true,
//       action :{$: 'openDialog', 
//         title: 'Hello' , 
//         content :{$: 'label', title: 'Hello Dialog' },      
//         features :{$: 'dialogFeature.dragTitle', id: "dialog-test"}, 
//       } 
//   },
//   expectedHtmlResult: { $: 'contains', text: ['Hello Dialog'], lookin: 'popups' },
// },
// })

// jb.component('popup-menu', {
//   type: 'test',
//   impl :{$: 'ng2-ui-test', 
//   control :{$: 'pulldown.topMenuItem', title: 'File', open: true,
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
  type: 'test',
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
  type: 'test',
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
  type: 'test',
  impl :{$: 'ng2-ui-test', 
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
  type: 'test',
  impl :{$: 'ng2-ui-test',  
    control :{$: 'inner-label3-tst', title: 'Hello World2' },
    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
},

})
