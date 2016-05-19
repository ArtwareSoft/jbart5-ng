import {jb} from 'jb-core/jb';;

jb.resource('material-demo','person',{
  "company": "google",
  "firstName": '',
  "lastName": '',
  "address": "1600 Amphitheatre Pkway",
  "address2": '',
  "city": '',
  "state": '',
  "postalCode": "94043",
})

jb.component('material-demo.main', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'editable-text', title: 'Company (disabled)', databind: '%company%' }, 
      {$: 'group', 
        title: 'Name', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'editable-text', title: 'First Name', databind: '%firstName%' }, 
          {$: 'editable-text', 
            title: 'Long Last Name That Will Be Truncated', 
            databind: '%lastName%'
          }
        ]
      }, 
      {$: 'group', 
        title: 'address', 
        style :{$: 'layout.vertical' }, 
        controls: [
          {$: 'editable-text', title: 'Address', databind: '%address%' }, 
          {$: 'editable-text', title: 'Address2', databind: '%address2%' }
        ]
      }, 
      {$: 'group', 
        title: 'City State', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'editable-text', title: 'City', databind: '%city%' }, 
          {$: 'editable-text', title: 'State', databind: '%state%' }, 
          {$: 'editable-text', title: 'Postal Code', databind: '%postalCode%' }
        ]
      }
    ], 
    features: [
      {$: 'group.data', data: '%$person%' }, 
      {$: 'group.theme', 
        theme :{$: 'theme.material-design' }
      }
    ]
  }
})

jb.component('material-demo.sidenav', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'sidenav', 
        style :{$: 'sidenav.md', align: 'start', mode: 'over', width: '200' }, 
        controls: [
          {$: 'group', 
            style :{$: 'group.section' }, 
            controls: [
              {$: 'image', 
                units: 'px', 
                style :{$: 'image.default' }, 
                url: 'https://material.angularjs.org/latest/img/icons/angular-logo.svg', 
                imageHeight: '150'
              }, 
              {$: 'custom-control', 
                template: '<h1 class="docs-logotype md-heading">Angular Material</h1>', 
                css: '{ color: white }'
              }, 
              {$: 'label', 
                title: 'label', 
                style :{$: 'label.span' }
              }, 
              {$: 'button', 
                title: 'Hello', 
                style :{$: 'button.md-flat' }
              }
            ], 
            features :{$: 'css', css: '{ background-color: #145FA9 }' }
          }
        ]
      }
    ]
  }
})


`

<button md-button>FLAT</button>
<button md-raised-button>RAISED</button>
<button md-icon-button>
    <i class="material-icons md-24">favorite</i>
</button>
<button md-fab>
    <i class="material-icons md-24">add</i>
</button>
<button md-mini-fab>
    <i class="material-icons md-24">add</i>
</button>

<button md-raised-button color="primary">PRIMARY</button>
<button md-raised-button color="accent">ACCENT</button>
<button md-raised-button color="warn">WARN</button>

<button md-button disabled>off</button>
<button md-raised-button [disabled]="isDisabled">off</button>
<button md-mini-fab [disabled]="isDisabled">check circle</button>


<md-card>
   Basic card.
</md-card>

preset actions
======
<md-card>
   <md-card-subtitle>Subtitle first</md-card-subtitle>
   <md-card-title>Card with title</md-card-title>   
   <md-card-content>
        <p>This is supporting text.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>
   </md-card-content>
   <md-card-actions>
        <button md-button>LIKE</button>
        <button md-button>SHARE</button>
   </md-card-actions>
</md-card>

preset layout
======
<md-card>
   <md-card-header>
      <img md-card-avatar src="path/to/img.png">
      <md-card-title>Header title</md-card-title>
      <md-card-subtitle>Header subtitle</md-card-subtitle>
   </md-card-header>
   <img md-card-image src="path/to/img.png">
   <md-card-content>
      <p>Here is some more content</p>
   </md-card-content>
</md-card>

title group
==============
<md-card>
   <md-card-title-group>
      <img md-card-sm-image src="path/to/img.png">
      <md-card-title>Card with title</md-card-title>
      <md-card-subtitle>Subtitle</md-card-subtitle>
   </md-card-title-group>
</md-card>

check box
==========
<ul>
  <li *ngFor="let todo of todos">
    <md-checkbox [checked]="todo.completed"
                 (change)="todo.completed = $event">
      {{todo.name}}
    </md-checkbox>
  </li>
</ul>

intermediate
=========
<md-checkbox [checked]="false"
             [indeterminate]="isIndeterminate"
             (change)="isIndeterminate = false">
  Click the Button Below to Make Me Indeterminate.
</md-checkbox>
<button type="button" (click)="isIndeterminate = true">
  Make Indeterminate
</button>

<md-checkbox [checked]="true" align="end">
  I come after my label.
</md-checkbox>
`
