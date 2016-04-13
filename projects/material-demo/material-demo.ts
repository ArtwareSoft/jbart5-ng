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

jb.component('material-demo.main1', {
  type: 'control', 
  impl2 :{ $: 'editable-text', title: 'First Name', databind: '%$person/firstName%', style :{$: 'editable-text.md-input'} },

  impl :{$:'label', 
      style: { $: 'customStyle', 
        template: `
<span>
      <md-input class="demo-full-width" placeholder="Company (disabled)" value="Google">
      </md-input>
</span>
        ` 
      }
  }
})

      // </md-input>
      //   <div>
      //             <button md-raised-button>raised</button>
      //             <button md-fab><i class="material-icons md-24">add</i></button>     
      //             </div>


jb.component('material-demo.main', {
  type: 'control', 
  impl :{$: 'group',
    $vars: {
      'editable-text.default-style-profile': 'editable-text.md-input'
    },
    features :{$: 'group.data', data: '%$person%'},
    controls: [
      { $: 'editable-text', 
        title: 'Company (disabled)',
        databind: '%company%',
        features: [ {$: 'disabled', showCondition: false }, {$: 'material-demo.input.full-width'} ], 
      },
      { $: 'group', 
        style :{$: 'layout.horizontal'},
        controls: [
            { $: 'editable-text', title: 'First Name', databind: '%firstName%' },
            { $: 'editable-text', title: 'Long Last Name That Will Be Truncated', databind: '%lastName%' },
        ]
      },
      { $: 'group', 
        style :{$: 'layout.vertical'},
        controls: [
            { $: 'editable-text', title: 'Address', databind: '%address%' },
            { $: 'editable-text', title: 'Address 2', databind: '%address2%' },
        ]
      },
      { $: 'group', 
        style :{$: 'layout.horizontal'},
        controls: [
            { $: 'editable-text', title: 'City', databind: '%city%' },
            { $: 'editable-text', title: 'State', databind: '%state%' },
            { $: 'editable-text', title: 'Postal Code', databind: '%postalCode%' },
        ]
      },
    ],
  }
})


`
from
<md-card class="demo-card demo-basic">
  <md-toolbar color="primary">Basic</md-toolbar>
  <md-card-content>
    <form>
      <md-input class="demo-full-width" placeholder="Company (disabled)" disabled value="Google">
      </md-input>

      <table style="width: 100%" cellspacing="0"><tr>
        <td><md-input placeholder="First name" style="width: 100%"></md-input></td>
        <td><md-input placeholder="Long Last Name That Will Be Truncated" style="width: 100%"></md-input></td>
      </tr></table>
      <p>
        <md-input class="demo-full-width" placeholder="Address" value="1600 Amphitheatre Pkway"></md-input>
        <md-input class="demo-full-width" placeholder="Address 2"></md-input>
      </p>
      <table style="width: 100%" cellspacing="0"><tr>
        <td><md-input class="demo-full-width" placeholder="City"></md-input></td>
        <td><md-input class="demo-full-width" placeholder="State"></md-input></td>
        <td><md-input #postalCode class="demo-full-width" maxLength="5"
                      placeholder="Postal Code"
                      value="94043">
          <md-hint align="end">{{postalCode.characterCount}} / 5</md-hint>
        </md-input></td>
      </tr></table>
    </form>
  </md-card-content>
</md-card>


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
  <li *ngFor="#todo of todos">
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