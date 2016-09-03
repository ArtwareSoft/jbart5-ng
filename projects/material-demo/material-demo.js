jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

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
      {$: 'tabs', 
        tabs: [
          {$: 'group', 
            title: 'input', 
            style :{$: 'group.section' }, 
            controls: [
              {$: 'editable-text', 
                databind: '%company%', 
                title: 'Company (disabled)'
              }, 
              {$: 'group', 
                title: 'Name', 
                style :{$: 'layout.horizontal', spacing: '' }, 
                controls: [
                  {$: 'editable-text', 
                    databind: '%firstName% %', 
                    title: 'First Name'
                  }, 
                  {$: 'editable-text', 
                    databind: '%lastName%', 
                    title: 'Long Last Name That Will Be Truncated'
                  }
                ]
              }, 
              {$: 'group', 
                title: 'address', 
                style :{$: 'layout.vertical' }, 
                controls: [
                  {$: 'editable-text', databind: '%address%', title: 'Address' }, 
                  {$: 'editable-text', 
                    databind: '%address2%', 
                    title: 'Address2'
                  }
                ]
              }, 
              {$: 'group', 
                title: 'City State', 
                style :{$: 'layout.horizontal' }, 
                controls: [
                  {$: 'editable-text', 
                    databind: '%city%', 
                    title: 'City', 
                    style :{$: 'editable-text.md-input', width: '122' }
                  }, 
                  {$: 'editable-text', databind: '%state%', title: 'State' }, 
                  {$: 'editable-text', 
                    databind: '%postalCode%', 
                    title: 'Postal Code'
                  }
                ]
              }
            ]
          }, 
          {$: 'custom-control', 
            html: `<div class="demo-button">
  <section>
    <button md-button>flat</button>
    <button md-raised-button>raised</button>
    <button md-fab>
      <md-icon class="md-24">check</md-icon>
    </button>
    <button md-mini-fab>
      <md-icon class="md-24">check</md-icon>
    </button>
  </section>

  <section>
    <a href="http://www.google.com" md-button color="primary">SEARCH</a>
    <a href="http://www.google.com" md-raised-button>SEARCH</a>
    <a href="http://www.google.com" md-fab>
      <md-icon class="md-24">check</md-icon>
    </a>
    <a href="http://www.google.com" md-mini-fab>
      <md-icon class="md-24">check</md-icon>
    </a>
  </section>

  <section>
    <button md-button color="primary">primary</button>
    <button md-button color="accent">accent</button>
    <button md-button color="warn">warn</button>
  </section>

  <section>
    <button md-raised-button color="primary">primary</button>
    <button md-raised-button color="accent">accent</button>
    <button md-raised-button color="warn">warn</button>
  </section>

  <section>
    <button md-fab color="primary">
      <md-icon class="md-24">home</md-icon>
    </button>
    <button md-fab color="accent">
      <md-icon class="md-24">favorite</md-icon>
    </button>
    <button md-fab color="warn">
      <md-icon class="md-24">feedback</md-icon>
    </button>
  </section>

  <section>
    <button md-icon-button color="primary">
      <md-icon class="md-24">menu</md-icon>
    </button>

    <button md-icon-button color="accent">
      <md-icon class="md-24">favorite</md-icon>
    </button>

    <button md-icon-button>
      <md-icon class="md-24">more_vert</md-icon>
    </button>
  </section>

  <section>
    <div>
      <p>isDisabled: {{isDisabled}}, clickCounter: <span>{{clickCounter}}</span></p>
      <button md-raised-button (click)="isDisabled=!isDisabled">
        Disable buttons
      </button>
      <button md-raised-button (click)="button1.focus()">Focus 1</button>
      <button md-raised-button (click)="button2.focus()">Focus 2</button>
      <button md-raised-button (click)="button3.focus()">Focus 3</button>
    </div>
    <button md-button #button1 [disabled]="isDisabled" (click)="clickCounter=clickCounter+1">off</button>
    <button md-button color="primary" [disabled]="isDisabled">off</button>
    <button md-raised-button #button3 color="primary" [disabled]="isDisabled">off</button>
    <button md-mini-fab [disabled]="isDisabled">
      <md-icon class="md-24">check</md-icon>
    </button>

    <button md-icon-button color="accent" [disabled]="isDisabled">
      <md-icon class="md-24">favorite</md-icon>
    </button>
  </section>
  <section>
    <a href="http://www.google.com" md-button color="primary">SEARCH</a>
    <button md-button>DANCE</button>
  </section>
  <section>
    <a href="http://www.google.com" md-raised-button color="primary">SEARCH</a>
    <button md-raised-button>DANCE</button>
  </section>
</div>`, 
            css: `.demo-button .button {     margin: 8px;     text-transform: uppercase;   }    
.demo-button section {     display: flex;     align-items: center;     
  background-color: #f7f7f7;     margin: 8px;   }    
.demo-button p {     padding:5px 15px;   }`, 
            title: 'buttons'
          }, 
          {$: 'custom-control', 
            html: `<h1>Exclusive Selection</h1>

<section class="demo-section">
  <md-button-toggle-group name="alignment">
    <md-button-toggle value="left"><md-icon>format_align_left</md-icon></md-button-toggle>
    <md-button-toggle value="center"><md-icon>format_align_center</md-icon></md-button-toggle>
    <md-button-toggle value="right"><md-icon>format_align_right</md-icon></md-button-toggle>
    <md-button-toggle value="justify" disabled><md-icon>format_align_justify</md-icon></md-button-toggle>
  </md-button-toggle-group>
</section>

<h1>Disabled Group</h1>

<section class="demo-section">
  <md-button-toggle-group name="checkbox" disabled>
    <md-button-toggle value="bold">
      <md-icon class="md-24">format_bold</md-icon>
    </md-button-toggle>
    <md-button-toggle value="italic">
      <md-icon class="md-24">format_italic</md-icon>
    </md-button-toggle>
    <md-button-toggle value="underline">
      <md-icon class="md-24">format_underline</md-icon>
    </md-button-toggle>
  </md-button-toggle-group>
</section>

<h1>Multiple Selection</h1>
<section class="demo-section">
  <md-button-toggle-group multiple>
    <md-button-toggle>Flour</md-button-toggle>
    <md-button-toggle>Eggs</md-button-toggle>
    <md-button-toggle>Sugar</md-button-toggle>
    <md-button-toggle disabled>Milk (disabled)</md-button-toggle>
  </md-button-toggle-group>
</section>

<h1>Single Toggle</h1>
<md-button-toggle>Yes</md-button-toggle>
`, 
            css: `.demo-basic {
  padding: 0;
}
.demo-basic md-card-content {
  padding: 16px;
}
.demo-full-width {
  width: 100%;
}

.demo-icons {
  font-size: 100%;
  height: inherit;
  vertical-align: top;
  width: inherit;
}

.demo-transform {
  transition: color $swift-ease-out-duration $swift-ease-out-timing-function;
}
.demo-primary {
  color: md-color($md-primary);
}

.demo-card {
  margin: 16px;
}
`, 
            title: 'button-toggle'
          }, 
          {$: 'custom-control', 
            html: `<div class="demo-card-container">
  <md-card>
    <md-card-title-group>
        <md-card-title>Card with title</md-card-title>
        <md-card-subtitle>Subtitle</md-card-subtitle>
        <img md-card-md-image>
    </md-card-title-group>
  </md-card>

  <md-card>
    <md-card-subtitle>Subtitle</md-card-subtitle>
    <md-card-title>Card with title</md-card-title>
    <md-card-content>
      <p>This is supporting text.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </md-card-content>
    <md-card-actions>
      <button md-button>LIKE</button>
      <button md-button>SHARE</button>
    </md-card-actions>
  </md-card>

  <md-card>
    <img md-card-image src="https://material.angularjs.org/latest/img/washedout.png">
    <md-card-title>Content Title</md-card-title>
    <md-card-content>
      <p>Here is some content</p>
    </md-card-content>
    <md-card-actions align="end">
      <button md-button>LIKE</button>
      <button md-button>SHARE</button>
    </md-card-actions>
  </md-card>

  <md-card>
    <md-card-header>
      <img md-card-avatar>
      <md-card-title>Header title</md-card-title>
      <md-card-subtitle>Header subtitle</md-card-subtitle>
    </md-card-header>
    <img md-card-image src="https://material.angularjs.org/latest/img/washedout.png">
    <md-card-content>
      <p>Here is some content</p>
    </md-card-content>
  </md-card>

  <md-card class="demo-card-blue md-card-flat">
    <md-card-title>Easily customizable</md-card-title>
    <md-card-actions>
      <button md-button>First</button>
      <button md-button>Second</button>
    </md-card-actions>
  </md-card>
</div>`, 
            css: `.demo-card-container {
  display: flex;
  flex-flow: column nowrap;
}
.demo-card-container md-card {
    margin: 0 16px 16px 0;
    width: 350px;
  }

.demo-card-container  img {
    background-color: gray;
  }


.demo-card-blue {
  background-color: #b0becc;
}
.demo-card-blue md-card-actions {
    display: flex;
    flex-direction: column;
  }
`, 
            title: 'card'
          }, 
          {$: 'custom-control', 
            html: `<h1>md-checkbox: Basic Example</h1>
<form>
<md-checkbox [(ngModel)]="isChecked"
              name="cb"
             (change)="isIndeterminate = false"
             [indeterminate]="isIndeterminate"
             [disabled]="isDisabled"
             [align]="alignment">
  Do you want to <em>foobar</em> the <em>bazquux</em>?

</md-checkbox> - <strong>{{printResult()}}</strong>
</form>
<div class="demo-checkboxes">
<input id="indeterminate-toggle"
       type="checkbox"
       [(ngModel)]="isIndeterminate"
       [disabled]="isDisabled">
<label for="indeterminate-toggle">Toggle Indeterminate</label>
<input id="disabled-toggle" type="checkbox" [(ngModel)]="isDisabled">
<label for="disabled-toggle">Toggle Disabled</label>
</div>
<div>
  <p>Alignment:</p>
  <div>
    <input #start type="radio"
                  value="start"
                  id="align-start"
                  name="alignment"
                  (click)="alignment = start.value"
                  checked>
    <label for="align-start">Start</label>
  </div>
  <div>
    <input #end type="radio"
                  value="end"
                  id="align-end"
                  name="alignment"
                  (click)="alignment = end.value">
    <label for="align-end">End</label>
  </div>
</div>
`, 
            css: `.demo-card-container {
  display: flex;
  flex-flow: column nowrap;
}
.demo-card-container md-card {
    margin: 0 16px 16px 0;
    width: 350px;
  }

.demo-card-container  img {
    background-color: gray;
  }


.demo-card-blue {
  background-color: #b0becc;
}
.demo-card-blue md-card-actions {
    display: flex;
    flex-direction: column;
  }
`, 
            title: 'checkbox', 
            features :{$: 'feature.ng-attach-object', 
              data :{
                $asIs: {
                  isIndeterminate: false, 
                  isChecked: false, 
                  isDisabled: false, 
                  alignment: 'start', 
                  printResult: function () {
                                                    if (this.isIndeterminate) {
                                                        return 'Maybe!';
                                                    }
                                                    return this.isChecked ? 'Yes!' : 'No!';
                                                }
                }
              }
            }
          }, 
          {$: 'custom-control', 
            html: `<div class="demo-grid-list">
  <md-card>
    <md-card-title>Basic grid list</md-card-title>
    <md-card-content class="demo-basic-list">
      <md-grid-list cols="4" [rowHeight]="basicRowHeight">
        <md-grid-tile> One </md-grid-tile>
        <md-grid-tile> Two </md-grid-tile>
        <md-grid-tile> Three </md-grid-tile>
        <md-grid-tile> Four </md-grid-tile>
      </md-grid-list>
    </md-card-content>
  </md-card>

  <md-card>
    <md-card-title>Fixed-height grid list</md-card-title>
    <md-card-content>
      <md-grid-list [cols]="fixedCols" [rowHeight]="fixedRowHeight">
        <md-grid-tile *ngFor="let tile of tiles" [colspan]="tile.cols" [rowspan]="tile.rows"
                      [style.background]="tile.color">
          {{tile.text}}
        </md-grid-tile>
      </md-grid-list>
    </md-card-content>
    <md-card-actions>
      <p>Change list cols: <input type="number" [(ngModel)]="fixedCols"></p>
      <p>Change row height: <input type="number" [(ngModel)]="fixedRowHeight"></p>
      <button md-button (click)="addTileCols()" color="primary">ADD COLSPAN (THREE)</button>
    </md-card-actions>
  </md-card>

  <md-card>
    <md-card-title>Ratio-height grid list</md-card-title>
    <md-card-content class="demo-ratio-list">
      <md-grid-list cols="2" [rowHeight]="ratio" gutterSize="4px">
        <md-grid-tile *ngFor="let tile of tiles" [style.background]="'lightblue'">
          {{tile.text}}
        </md-grid-tile>
      </md-grid-list>
    </md-card-content>
    <md-card-actions>
      <p>Change ratio: <input [(ngModel)]="ratio"></p>
    </md-card-actions>
  </md-card>

  <md-card>
    <md-card-title>Fit-height grid list</md-card-title>
    <md-card-content class="demo-fit-list">
      <md-grid-list cols="2" rowHeight="fit" [gutterSize]="ratioGutter"
                    [style.height]="fitListHeight">
        <md-grid-tile *ngFor="let tile of tiles" [style.background]="'#F1EBBA'">
          {{tile.text}}
        </md-grid-tile>
      </md-grid-list>
    </md-card-content>
    <md-card-actions>
      <p>Change list height: <input [(ngModel)]="fitListHeight"></p>
      <p>Change gutter: <input type="number" [(ngModel)]="ratioGutter"></p>
    </md-card-actions>
  </md-card>

  <md-card>
    <md-card-title>Grid list with header</md-card-title>
    <md-card-content>
      <md-grid-list cols="3" rowHeight="200px">
        <md-grid-tile *ngFor="let dog of dogs" style="background:gray">
          <md-grid-tile-header>
            <md-icon md-grid-avatar>info_outline</md-icon>
            {{dog.name}}
          </md-grid-tile-header>
        </md-grid-tile>
      </md-grid-list>
    </md-card-content>
  </md-card>

  <md-card>
    <md-card-title>Grid list with footer</md-card-title>
    <md-card-content>
      <md-grid-list cols="3" rowHeight="200px">
        <md-grid-tile *ngFor="let dog of dogs">
          <img [alt]="dog.name" src="https://material.angularjs.org/material2_assets/ngconf/{{dog.name}}.png">
          <md-grid-tile-footer>
            <h3 md-line>{{dog.name}}</h3>
            <span md-line>Human: {{dog.human}}</span>
            <md-icon>star_border</md-icon>
          </md-grid-tile-footer>
        </md-grid-tile>
      </md-grid-list>
    </md-card-content>
  </md-card>
</div>
`, 
            css: `.demo-grid-list {
  width: 1100px;
}
.demo-grid-list   md-card {
    margin: 16px 0;
  }

  p {
    margin: 16px;
  }

  .demo-basic-list md-grid-tile {
    background: rgba(0, 0, 0, 0.32);
  }

  img {
    width: 350px;
  }`, 
            title: 'grid-list', 
            features :{$: 'feature.ng-attach-object', 
              data :{$: 'new-instance', 
                module: 'projects/material-demo/ng-material-demo-loader', 
                class: 'GridListDemo'
              }
            }
          }, 
          {$: 'custom-control', 
            html: `<md-card class="demo-card demo-basic">
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
        <td><md-input class="demo-full-width" placeholder="City" value="Mountain View"></md-input></td>
        <td><md-input class="demo-full-width" placeholder="State" maxLength="2" value="CA"></md-input></td>
        <td><md-input #postalCode class="demo-full-width" maxLength="5"
                      placeholder="Postal Code"
                      value="94043">
          <md-hint align="end"></md-hint>
        </md-input></td>
      </tr></table>
    </form>
  </md-card-content>
</md-card>

<md-card class="demo-card demo-basic">
  <md-toolbar color="primary">Prefix + Suffix</md-toolbar>
  <md-card-content>
    <md-input placeholder="amount" align="end">
      <span md-prefix>$&nbsp;</span>
      <span md-suffix>.00</span>
    </md-input>
  </md-card-content>
</md-card>

<md-card class="demo-card demo-basic">
  <md-toolbar color="primary">Divider Colors</md-toolbar>
  <md-card-content>
    <md-input dividerColor="primary" placeholder="Default Color" value="example"></md-input>
    <md-input dividerColor="accent" placeholder="Accent Color" value="example"></md-input>
    <md-input dividerColor="warn" placeholder="Warn Color" value="example"></md-input>
  </md-card-content>
</md-card>

<md-card class="demo-card demo-basic">
  <md-toolbar color="primary">Hints</md-toolbar>
  <md-card-content>
    <p>
      <md-input placeholder="Character count (100 max)" maxLength="100" class="demo-full-width"
                value="Hello world. How are you?"
                #characterCountHintExample>
        <md-hint align="end">hint</md-hint>
      </md-input>
    </p>
  </md-card-content>
</md-card>

<md-card class="demo-card">
  <md-card-title>
    Hello <md-input [(ngModel)]="name" type="text" placeholder="First name"></md-input>,
    how are you?
  </md-card-title>
  <md-card-content>
    <p>
      <md-input disabled placeholder="Disabled field" value="Value"></md-input>
      <md-input required placeholder="Required field"></md-input>
    </p>
    <p>
      <md-input placeholder="100% width placeholder" style="width: 100%"></md-input>
    </p>
    <p>
      <md-input placeholder="Character count (100 max)" maxLength="100" style="width: 100%"
                #input>
        <md-hint align="end">hint</md-hint>
      </md-input>
    </p>
    <p>
      <md-input placeholder="Show Hint Label" style="width: 100%"
                hintLabel="Hint label"></md-input>
    </p>

    <p>
      <md-input>
        <md-placeholder>
          I <md-icon class="demo-icons">favorite</md-icon> <b>bold</b> placeholder
        </md-placeholder>
        <md-hint>
          I also <md-icon class="demo-icons">home</md-icon> <i>italic</i> hint labels
        </md-hint>
      </md-input>
    </p>
    <p>
      <md-input placeholder="Show Hint Label With Character Count" style="width: 100%"
                hintLabel="Hint label" characterCounter></md-input>
    </p>
    <p>
      <md-checkbox [(ngModel)]="dividerColor">Check to change the divider color:</md-checkbox>
      <md-input [dividerColor]="dividerColor ? 'primary' : 'accent'"
                [placeholder]="dividerColor ? 'Primary color' : 'Accent color'"></md-input>
    </p>
    <p>
      <md-checkbox [(ngModel)]="requiredField"> Check to make required:</md-checkbox>
      <md-input [required]="requiredField"
                [placeholder]="requiredField ? 'Required field' : 'Not required field'"></md-input>
    </p>
    <p>
      <md-checkbox [(ngModel)]="floatingLabel"> Check to make floating label:</md-checkbox>
      <md-input [floatingPlaceholder]="floatingLabel"
                [placeholder]="floatingLabel ? 'Floating label' : 'Not floating label'"></md-input>
    </p>

    <p>
      <md-input placeholder="Prefixed" value="example">
        <div md-prefix>Example:&nbsp;</div>
      </md-input>
      <md-input placeholder="Suffixed" value="123" align="end">
        <span md-suffix>.00 €</span>
      </md-input>
      <br/>
      Both:
      <md-input #email placeholder="Email Address" value="angular-core" align="end">
        <span md-prefix><md-icon [class.primary]="email.focused" class="demo-icons demo-transform">email</md-icon>&nbsp;</span>
        <span md-suffix class="demo-transform" [class.primary]="email.focused">&nbsp;@gmail.com</span>
      </md-input>
    </p>

    <p>
      Empty: <md-input></md-input>
      <label>Label: <md-input></md-input></label>
    </p>
  </md-card-content>
</md-card>

<md-card class="demo-card">
  <table width="100%">
    <thead>
      <td>Table</td>
      <td colspan="3">
        <button (click)="addABunch(5)">Add 5</button>
        <button (click)="addABunch(10)">Add 10</button>
        <button (click)="addABunch(100)">Add 100</button>
        <button (click)="addABunch(1000)">Add 1000</button>
      </td>
    </thead>
    <tr *ngFor="let item of items; let i = index">
      <td>{{i+1}}</td>
      <td>
        <md-input type="number" placeholder="value" aria-label="hello" [(ngModel)]="items[i].value"></md-input>
      </td>
      <td>
        <input type="number" [(ngModel)]="items[i].value">
      </td>
      <td>{{item.value}}</td>
    </tr>
  </table>
</md-card>`, 
            css: `.demo-basic {
  padding: 0;
}
.demo-basic md-card-content {
  padding: 16px;
}
.demo-full-width {
  width: 100%;
}

.demo-icons {
  font-size: 100%;
  height: inherit;
  vertical-align: top;
  width: inherit;
}

.demo-card {
  margin: 16px;
}`, 
            title: 'input', 
            features :{$: 'feature.ng-attach-object', 
              data :{$: 'new-instance', 
                module: 'projects/material-demo/ng-material-demo-loader', 
                class: 'InputDemo'
              }
            }
          }, 
          {$: 'custom-control', 
            html: `<h1>md-list demo</h1>

<button md-raised-button (click)="thirdLine=!thirdLine" class="demo-button">Show third line</button>

<div class="demo">
  <div>
    <h2>Normal lists</h2>

    <md-list>
      <h3 md-subheader>Items</h3>
      <md-list-item *ngFor="let item of items">
        {{item}}
      </md-list-item>
    </md-list>

    <md-list>
      <md-list-item *ngFor="let contact of contacts">
        <h3 md-line>{{contact.name}}</h3>
        <p md-line *ngIf="thirdLine">extra line</p>
        <p md-line class="demo-secondary-text">{{contact.headline}}</p>
      </md-list-item>
    </md-list>

    <md-list>
      <h3 md-subheader>Today</h3>
      <md-list-item *ngFor="let message of messages">
        <img md-list-avatar [src]="message.image" alt="Image of {{message.from}}">
        <h4 md-line>{{message.from}}</h4>
        <p md-line>
          <span>{{message.subject}} -- </span>
          <span class="demo-secondary-text">{{message.message}}</span>
        </p>
      </md-list-item>
      <md-divider></md-divider>
      <md-list-item *ngFor="let message of messages">
        <h4 md-line>{{message.from}}</h4>
        <p md-line> {{message.subject}} </p>
        <p md-line class="demo-secondary-text">{{message.message}} </p>
      </md-list-item>
    </md-list>
  </div>

  <div>
    <h2>Dense lists</h2>
    <md-list dense>
      <h3 md-subheader>Items</h3>
      <md-list-item *ngFor="let item of items">
        {{item}}
      </md-list-item>
    </md-list>

    <md-list dense>
      <md-list-item *ngFor="let contact of contacts">
        <h3 md-line>{{contact.name}}</h3>
        <p md-line class="demo-secondary-text">{{contact.headline}}</p>
      </md-list-item>
    </md-list>

    <md-list dense>
      <h3 md-subheader>Today</h3>
      <md-list-item *ngFor="let message of messages">
        <img md-list-avatar [src]="message.image" alt="Image of {{message.from}}">
        <h4 md-line>{{message.from}}</h4>
        <p md-line> {{message.subject}} </p>
        <p md-line class="demo-secondary-text">{{message.message}} </p>
      </md-list-item>
    </md-list>
  </div>
  <div>
    <h2>Nav lists</h2>
    <md-nav-list>
      <a md-list-item *ngFor="let link of links" href="http://www.google.com">
        {{ link.name }}
      </a>
    </md-nav-list>
    <div *ngIf="infoClicked">
      More info!
    </div>
    <md-nav-list>
      <md-list-item *ngFor="let link of links">
        <a md-line href="http://www.google.com">{{ link.name }}</a>
        <button md-icon-button (click)="infoClicked=!infoClicked">
          <md-icon>info</md-icon>
        </button>
      </md-list-item>
    </md-nav-list>
    <md-nav-list>
      <a md-list-item *ngFor="let link of links" href="http://www.google.com">
        <md-icon md-list-icon>folder</md-icon>
        <span md-line>{{ link.name }}</span>
        <span md-line class="demo-secondary-text"> Description </span>
      </a>
    </md-nav-list>
    <md-nav-list dense>
      <md-list-item *ngFor="let link of links">
        <a md-line href="http://www.google.com">{{ link.name }}</a>
        <button md-icon-button (click)="infoClicked=!infoClicked">
          <md-icon class="material-icons">info</md-icon>
        </button>
      </md-list-item>
    </md-nav-list>
  </div>
</div>`, 
            css: `.demo {
  display: flex;
  flex-flow: row wrap;
}
md-list, md-nav-list {
    border: 1px solid rgba(0, 0, 0, 0.12);
    width: 350px;
    margin: 20px 20px 0 0;

  }
  h2 {
    margin-top: 20px;
  }

  md-icon {
    color: rgba(0, 0, 0, 0.12);
  }

  [md-list-icon] {
    color: white;
    background: rgba(0, 0, 0, 0.3);
  }


.demo-secondary-text {
  color: rgba(0, 0, 0, 0.54);
}`, 
            title: 'list', 
            features :{$: 'feature.ng-attach-object', 
              data :{$: 'new-instance', 
                module: 'projects/material-demo/ng-material-demo-loader', 
                class: 'ListDemo'
              }
            }
          }, 
          {$: 'custom-control', 
            html: `<div class="demo-live-announcer">

  <button md-button (click)="announceText('Hey Google')">Announce Text</button>

</div>`, 
            css: '', 
            title: 'announcer', 
            features :{$: 'feature.ng-attach-object', 
              data :{$: 'injector-get', provider: 'LiveAnnouncerDemo' }
            }
          }, 
          {$: 'custom-control', 
            html: `<h1>Determinate</h1>
<div class="demo-progress-bar-container">
  <md-progress-bar mode="determinate"
                   [value]="determinateProgressValue"
                   color="primary"
                   class="demo-progress-bar-margins"></md-progress-bar>
</div>
<span>Value: {{determinateProgressValue}}</span>
<button md-raised-button (click)="stepDeterminateProgressVal(10)">Increase</button>
<button md-raised-button (click)="stepDeterminateProgressVal(-10)">Decrease</button>
<h1>Buffer</h1>
<div class="demo-progress-bar-container">
  <md-progress-bar [value]="bufferProgressValue"
                   [bufferValue]="bufferBufferValue"
                   mode="buffer"
                   color="warn"
                   class="demo-progress-bar-margins"></md-progress-bar>
</div>
<span>Value: {{bufferProgressValue}}</span>
<button md-raised-button (click)="stepBufferProgressVal(10)">Increase</button>
<button md-raised-button (click)="stepBufferProgressVal(-10)">Decrease</button>
<span class="demo-progress-bar-spacer"></span>
<span>Buffer Value: {{bufferBufferValue}}</span>
<button md-raised-button (click)="stepBufferBufferVal(10)">Increase</button>
<button md-raised-button (click)="stepBufferBufferVal(-10)">Decrease</button>

<h1>Indeterminate</h1>
<div class="demo-progress-bar-container">
  <md-progress-bar mode="indeterminate"
                   class="demo-progress-bar-margins"></md-progress-bar>
</div>

<h1>Query</h1>
<div class="demo-progress-bar-container">
  <md-progress-bar mode="query"
                   class="demo-progress-bar-margins"></md-progress-bar>
</div>`, 
            css: `.demo-progress-bar-container {
  width: 100%;
}

.demo-progress-bar-margins {
  margin: 20px 0;
}

.demo-progress-bar-spacer {
  display: inline-block;
  width: 50px;
}`, 
            title: 'progress bar', 
            features :{$: 'feature.ng-attach-object', 
              data :{$: 'new-instance', 
                module: 'projects/material-demo/ng-material-demo-loader', 
                class: 'ProgressBarDemo'
              }
            }
          }, 
          {$: 'custom-control', 
            html: `<h1>Default Slider</h1>
Label <md-slider #slidey></md-slider>
{{slidey.value}}

<h1>Slider with Min and Max</h1>
<md-slider min="5" max="7" #slider2></md-slider>
{{slider2.value}}

<h1>Disabled Slider</h1>
<md-slider disabled #slider3></md-slider>
{{slider3.value}}

<h1>Slider with set value</h1>
<md-slider value="43"></md-slider>

<h1>Slider with step defined</h1>
<md-slider min="1" max="100" step="20" #slider5></md-slider>
{{slider5.value}}

<h1>Slider with set tick interval</h1>
<md-slider tick-interval="auto"></md-slider>
<md-slider tick-interval="9"></md-slider>

<h1>Slider with Thumb Label</h1>
<md-slider thumb-label></md-slider>

<h1>Slider with two-way binding</h1>
<md-slider [(ngModel)]="demo" step="40"></md-slider>
<input [(ngModel)]="demo">`, 
            css: '', 
            title: 'slider', 
            features :{$: 'feature.ng-attach-object', 
              data :{$: 'new-instance', 
                module: 'projects/material-demo/ng-material-demo-loader', 
                class: 'ProgressBarDemo'
              }
            }
          }
        ], 
        style :{$: 'tabs.md-tabs' }, 
        
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
        ], 
        features :{$: 'hidden' }
      }, 
      {$: 'custom-control', 
        html: `<div>
<md-sidenav-layout class="demo-sidenav-layout">
  <md-sidenav #start (open)="myinput.focus()" mode="side">
    Start Side Drawer
    <br>
    <button md-button (click)="start.close()">Close</button>
    <br>
    <button md-button (click)="end.open()">Open End Side</button>
    <br>
    <button md-button
            (click)="start.mode = (start.mode == 'push' ? 'over' : (start.mode == 'over' ? 'side' : 'push'))">Toggle Mode</button>
    <div>Mode: {{start.mode}}</div>
    <br>
    <input #myinput>
  </md-sidenav>

  <md-sidenav #end align="end">
    End Side Drawer
    <br>
    <button md-button (click)="end.close()">Close</button>
  </md-sidenav>

  <div class="demo-sidenav-content">
    <h1>My Content</h1>

    <div>
      <header>Sidenav</header>
      <button md-button (click)="start.toggle()">Toggle Start Side Drawer</button>
      <button md-button (click)="end.toggle()">Toggle End Side Drawer</button>
    </div>

    <button md-button>HELLO</button>
    <button md-raised-button class="md-primary">HELLO</button>
    <button md-fab class="md-accent">HI</button>
  </div>
</md-sidenav-layout>
</div>`, 
        css: `.demo-sidenav-layout {
  border: 3px solid black;

  md-sidenav {
    padding: 10px;
  }
}

.demo-sidenav-content {
  padding: 15px;
}`, 
        
      }
    ], 
    
  }
})

jb.component('material-demo.buttons', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'buttons', 
    style :{$: 'layout.vertical', spacing: 3 }, 
    controls: [
      {$: 'button', 
        title: 'Helloabcfdgfd', 
        style :{$: 'button.md-flat' }
      }, 
      {$: 'custom-control', 
        title: 'buttons', 
        html: `<div class="demo-button">
  <section>
    <button md-button>flat</button>
    <button md-raised-button>raised</button>
    <button md-fab>
      <md-icon class="md-24">check</md-icon>
    </button>
    <button md-mini-fab>
      <md-icon class="md-24">check</md-icon>
    </button>
  </section>

  <section>
    <a href="http://www.google.com" md-button color="primary">SEARCH</a>
    <a href="http://www.google.com" md-raised-button>SEARCH</a>
    <a href="http://www.google.com" md-fab>
      <md-icon class="md-24">check</md-icon>
    </a>
    <a href="http://www.google.com" md-mini-fab>
      <md-icon class="md-24">check</md-icon>
    </a>
  </section>

  <section>
    <button md-button color="primary">primary</button>
    <button md-button color="accent">accent</button>
    <button md-button color="warn">warn</button>
  </section>

  <section>
    <button md-raised-button color="primary">primary</button>
    <button md-raised-button color="accent">accent</button>
    <button md-raised-button color="warn">warn</button>
  </section>

  <section>
    <button md-fab color="primary">
      <md-icon class="md-24">home</md-icon>
    </button>
    <button md-fab color="accent">
      <md-icon class="md-24">favorite</md-icon>
    </button>
    <button md-fab color="warn">
      <md-icon class="md-24">feedback</md-icon>
    </button>
  </section>

  <section>
    <button md-icon-button color="primary">
      <md-icon class="md-24">menu</md-icon>
    </button>

    <button md-icon-button color="accent">
      <md-icon class="md-24">favorite</md-icon>
    </button>

    <button md-icon-button>
      <md-icon class="md-24">more_vert</md-icon>
    </button>
  </section>

  <section>
    <div>
      <p>isDisabled: {{isDisabled}}, clickCounter: <span>{{clickCounter}}</span></p>
      <button md-raised-button (click)="isDisabled=!isDisabled">
        Disable buttons
      </button>
      <button md-raised-button (click)="button1.focus()">Focus 1</button>
      <button md-raised-button (click)="button2.focus()">Focus 2</button>
      <button md-raised-button (click)="button3.focus()">Focus 3</button>
    </div>
    <button md-button #button1 [disabled]="isDisabled" (click)="clickCounter=clickCounter+1">off</button>
    <button md-button color="primary" [disabled]="isDisabled">off</button>
    <button md-raised-button #button3 color="primary" [disabled]="isDisabled">off</button>
    <button md-mini-fab [disabled]="isDisabled">
      <md-icon class="md-24">check</md-icon>
    </button>

    <button md-icon-button color="accent" [disabled]="isDisabled">
      <md-icon class="md-24">favorite</md-icon>
    </button>
  </section>
  <section>
    <a href="http://www.google.com" md-button color="primary">SEARCH</a>
    <button md-button>DANCE</button>
  </section>
  <section>
    <a href="http://www.google.com" md-raised-button color="primary">SEARCH</a>
    <button md-raised-button>DANCE</button>
  </section>
</div>`, 
        css: `.demo-button .button {     margin: 8px;     text-transform: uppercase;   }    
.demo-button section {     display: flex;     align-items: center;     
  background-color: #f7f7f7;     margin: 8px;   }    
.demo-button p {     padding:5px 15px;   }`
      }
    ]
  }
})

jb.component('material-demo.buttons2', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'buttons2', 
    style :{$: 'layout.horizontal', spacing: 3 }, 
    controls: [
      {$: 'label', title: '132' }, 
      {$: 'editable-text', 
        title: 'fhgfh', 
        databind: '%$sources/button%', 
        style :{$: 'editable-text.codemirror', 
          height: '600', 
          mode: 'htmlmixed', 
          debounceTime: '100'
        }
      }, 
      {$: 'group', 
        title: 'buttons2', 
        style :{$: 'group.md-card' }, 
        controls: [], 
        features: [
          {$: 'group.data', data: '%$sources/button%', watch: true }, 
          {$: 'css.width', width: '400' }
        ]
      }
    ]
  }
})

jb.component('material-demo.btns', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'btns', 
    controls: [
      {$: 'button', 
        title: 'Hello ewrewre', 
        style :{$: 'button.md-raised' }, 
        
      }, 
      {$: 'itemlist', 
        items: ['a'], 
        controls: [
          {$: 'button', 
            title: 'Hello sfsd', 
            style :{$: 'button.md-raised' }, 
            
          }
        ], 
        style :{$: 'itemlist.ul-li' }, 
        dynamicItems: true
      }
    ]
  }
})


})