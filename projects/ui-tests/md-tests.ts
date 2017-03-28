import {jb} from 'jb-core';

jb.component('md-test.md-button', {
  type: 'test',
  impl : {$: 'ng2-ui-test',  
    control :{$: 'button', title: 'ccc', 
        style :{$: 'button.md-raised' }
    },
    expectedHtmlResult: { $: 'contains', text: 'cc' }
  }
})

jb.component('md-test.md-card-title', {
  type: 'test',
  impl :{$: 'ng2-ui-test',  
    control :{$: 'label', title: 'ccc', 
        style :{$: 'label.md-card-title' }
    },
    expectedHtmlResult: { $: 'contains', text: 'cc' }
  },
})

jb.component('md-test.md-input', {
  type: 'test',
  impl :{$: 'ng2-ui-test',  disableChangeDetection: false,
    control :{ $: 'editable-text', 
      title: 'name', 
      databind: '%$person/name%', 
      style :{$: 'editable-text.md-input'} 
    },
    expectedHtmlResult: {$and: [{ $: 'contains', text: 'name' },{ $: 'contains', text: 'Homer' }] }
  },
})

jb.component('md-test.button-md-icon', {
  type: 'test',
  impl :{$: 'ng2-ui-test',  
    control :{$: 'button', 
      title: 'ccc',
      style :{$: 'button.mdl-icon', icon: 'save' }, 
    },
    expectedHtmlResult: { $: 'contains', text: 'cc' }
  },
})


jb.component('md-test.editable-text-in-md-property-sheet', {
  type: 'test',
  impl :{$: 'ng2-ui-test',  
    control :{$: 'group',
      controls : [
        {$: 'group',
              controls: [
                { $: 'editable-text', 
                    title: 'name (update on blur)', 
                    updateOnBlur: true,
                    databind: '%$person/name%', 
                    style :{$: 'editable-text.md-input'} 
                },
                { $: 'editable-text', title: 'name', databind: '%$person/name%', 
                  style :{$: 'editable-text.md-input'} 
                },
              ]
        },
        { $: 'label', title: '%$person/name%' }
      ]
    },
    expectedHtmlResult: { $: 'contains', text: ['Homer'] },
  }
})

//jb.component('md-test.dialog-md-alert', {
//type: 'test',
//  impl :{$: 'ng2-ui-test', waitForPromise: {$delay: 5},  
  //   control :{$: 'button', title: 'Open Dialog', $click: true,
  //       action :{$: 'openDialog', 
  //         style :{$: 'dialog.dialog-ok-cancel'},
  //         title: 'Hello' , 
  //         content :{$: 'label', title: 'Hello Dialog' },      
  //       } 
  //   },
  //   expectedHtmlResult: { $: 'contains', text: ['Hello Dialog'], lookin: 'popups' },
  // },
//})

// jb.component('md-test.md-dialog-modal', {
//type: 'test',
//   impl :{$: 'ng2-ui-test', waitForPromise: {$delay: 5},  
  //   control :{$: 'button', title: 'Open Dialog', $click: true,
  //       action :{$: 'openDialog', 
  //         modal: true,
  //         style :{$: 'dialog.dialog-ok-cancel' },
  //         title: 'Hello' , 
  //         content :{$: 'label', title: 'Hello Dialog' },      
  //       } 
  //   },
  //   expectedHtmlResult: { $: 'contains', text: ['Hello Dialog', 'OK'], lookin: 'popups' },
  // },
//})

// jb.component('md-test.md-tabs', {
//   type: 'test',
//   impl :{$: 'ng2-ui-test', 
//   control :{$: 'tabs',
//       style :{$: 'tabs.md-tabs' },
//       tabs:[
//         {$: 'group', title: 'tab1', controls :{$: 'label', title: 'in tab1' }},
//         {$: 'group', title: 'tab2', controls :{$: 'label', title: 'in tab2' }},
//     ]
//   },
//   expectedHtmlResult :{$and: 
//       [ 
//         { $: 'contains', text: ['tab1','in tab1'] },
//         { $: 'contains', text: ['tab2'] },
//         { $not: { $: 'contains', text: ['in tab2'] } }
//        ]
//     },
//   }
// })

