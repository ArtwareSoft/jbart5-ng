jb.resource('material-demo','person', {
  "company": "google",
  "firstName": 'Dave',
  "lastName": 'Smith',
  "address": "1600 Amphitheatre Pkway",
  "address2": '',
  "city": 'mountain view',
  "state": 'CA',
  "postalCode": "94043",
  "male": true,
})

jb.component('material-demo.main', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'input', 
    style :{$: 'layout.vertical', spacing: '33' }, 
    controls: [
      {$: 'editable-text', 
        title: 'Company (disabled)', 
        databind: '%$person/company%'
      }, 
      {$: 'group', 
        title: 'Name group', 
        controls: [
          {$: 'group', 
            title: 'Name', 
            style :{$: 'layout.horizontal', spacing: '25' }, 
            controls: [
              {$: 'editable-text', 
                title: 'Long Last Name That Will Be Truncated', 
                databind: '%$person/lastName%'
              }, 
              {$: 'editable-text', 
                title: 'First Name', 
                databind: '%$person/firstName%', 
                style :{$: 'editable-text.mdl-input' }
              }
            ]
          }
        ]
      }, 
      {$: 'group', 
        title: 'address', 
        style :{$: 'layout.horizontal', spacing: 3 }, 
        controls: [
          {$: 'editable-text', title: 'Address', databind: '%$person/address%' }, 
          {$: 'editable-text', 
            title: 'Address2', 
            databind: '%$person/address2%'
          }
        ]
      }, 
      {$: 'group', 
        title: 'City State', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'editable-text', 
            title: 'City', 
            databind: '%$person/city%', 
            style :{$: 'editable-text.mdl-input', width: '122' }
          }, 
          {$: 'editable-text', title: 'State', databind: '%$person/state%' }, 
          {$: 'editable-text', 
            title: 'Postal Code', 
            databind: '%$person/postalCode%'
          }
        ]
      }, 
      {$: 'editable-boolean', 
        databind: '%$person/male%', 
        style :{$: 'editable-boolean.mdl-slide-toggle' }, 
        title: 'gender', 
        textForTrue: 'male', 
        textForFalse: 'female'
      }
    ], 
    features: [
      {$: 'group.theme', 
        theme :{$: 'theme.material-design' }
      }, 
      {$: 'css.box-shadow', 
        blurRadius: '10', 
        spreadRadius: '', 
        shadowColor: '#cdcdcd', 
        opacity: '1', 
        horizontal: '', 
        vertical: ''
      }, 
      {$: 'css.padding', top: '10', left: '10' }, 
      {$: 'css.width', width: '790' }, 
      {$: 'css.margin', top: '10', left: '10' }
    ]
  }
})
