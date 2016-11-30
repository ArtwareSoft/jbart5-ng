import {jb} from 'jb-core';

jb.component('hello-world.main', {
  type: 'control', 
  impl :{$: 'group', 
    style :{$: 'group.md-card' }, 
    controls: [
      {$: 'label', 
        title: 'hello test', 
        style :{$: 'label.md-card-title' }
      }, 
      {$: 'button', 
        title: 'Hello', 
        style :{$: 'button.md-icon-12', icon: 'build' }
      }, 
      {$: 'editable-boolean', 
        databind: '%$globals/aa%', 
        style :{$: 'editable-boolean.flipswitch' }, 
        textForTrue: 'yes', 
        textForFalse: 'no'
      }
    ]
  }
})


jb.component('hello-world.main1', {
  type: 'control', 
  impl :{$: 'label', title: '$log:hello main' }
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

jb.component('hello-world.form', {
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
        title: 'Name', 
        style :{$: 'layout.horizontal', spacing: 3 }, 
        controls: [
          {$: 'editable-text', 
            title: 'First Name', 
            databind :{$: 'pipeline', items: ['%$person/firstName%'] }, 
            style :{$: 'editable-text.md-input' }
          }, 
          {$: 'editable-text', 
            title: 'Long Last Name That Will Be Truncated', 
            databind: '%$person/lastName%'
          }
        ]
      }, 
      {$: 'group', 
        title: 'address', 
        style :{$: 'layout.vertical' }, 
        controls: [
          {$: 'editable-text', title: 'Address', databind: '%$person/address%' }, 
          {$: 'editable-text', title: 'Address2', databind: '%address2%' }
        ]
      }, 
      {$: 'group', 
        title: 'City State', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'editable-text', 
            title: 'City', 
            databind: '%$person/city%', 
            style :{$: 'editable-text.md-input', width: '122' }
          }, 
          {$: 'editable-text', title: 'State', databind: '%$person/state%' }, 
          {$: 'editable-text', 
            title: 'Postal Code', 
            databind: '%$person/postalCode%'
          }
        ]
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
      {$: 'css.width', width: '700' }, 
      {$: 'css.margin', top: '10', left: '10' }
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
