import {jb} from 'jb-core';

jb.component('hello-world.main', {
  type: 'control', 
  impl :{$: 'label', 
    title: 'hello test2', 
    features: {  }
  }
})

jb.component('hello-world.main1', {
  type: 'control', 
  impl :{$: 'label', title: '$log:hello main' }
})

jb.component('hello-world.form', {
  type: 'control', 
  impl :{$: 'group', 
    style :{$: 'group.div' }, 
    controls: [
      {$: 'editable-text', 
        title: 'first name', 
        databind: '%$globals/name%', 
        style :{$: 'editable-text.md-input' }
      }, 
      {$: 'editable-text', 
        title: 'last name', 
        databind: '%$globals/name%', 
        style :{$: 'editable-text.md-input' }
      }, 
      {$: 'editable-text', 
        title: 'name', 
        databind: '%$globals/name%', 
        style :{$: 'editable-text.md-input' }
      }
    ]
  }
})

jb.component('hello-world.group', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'main', 
    style :{$: 'layout.vertical', spacing: 30 }, 
    controls: [
      {$: 'group', 
        title: '2.0', 
        controls: [
          {$: 'label', title: '2.1' }, 
          {$: 'button', 
            title: '2.2', 
            features :{$: 'group.wait' }
          }
        ]
      }, 
      {$: 'label', title: '$log:1.0' }
    ]
  }
})
