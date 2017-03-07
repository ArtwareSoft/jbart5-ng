jb.component('hello-world.main', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'label', title: 'hello world' }, 
      {$: 'button', 
        title: 'click me', 
        style :{$: 'button.mdl-icon', size: 20, icon: 'build' }
      }, 
      {$: 'editable-boolean', 
        databind: '%$globals/a%', 
        style :{$: 'editable-boolean.checkbox' }, 
        textForTrue: 'yes', 
        textForFalse: 'no'
      }
    ]
  }
})

jb.resource('hello-world','person',{
  "company": "google",
  "firstName": 'Dave',
  "lastName": 'Smith',
  "address": "1600 Amphitheatre Pkway",
  "address2": '',
  "city": 'mountain view',
  "state": 'CA',
  "postalCode": "94043",
})
