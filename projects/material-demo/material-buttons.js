jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.component('material-demo.buttons', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'buttons', 
    style :{$: 'layout.vertical', spacing: 3 }, 
    controls: [
      {$: 'group', 
        title: 'toolbar', 
        style :{$: 'layout.horizontal', spacing: 3 }, 
        controls: [
          {$: 'button', 
            title: 'pick & edit', 
            action :{$: 'material-demo.pick', 
              onHover :{$: 'writeValue', to: '%$globals/ngPath%', value: '%%' }
            }, 
            style :{$: 'button.md-icon', icon: 'call_made', size: '34', padding: '5' }, 
            features: [{$: 'css.transform-rotate', angle: '-90', selector: 'i' }, {  }]
          }, 
          {$: 'editable-text', 
            databind: '%$globals/ngPath%', 
            style :{$: 'editable-text.md-input', width: '400' }, 
            features: [
              {$: 'css.margin', top: '', left: '20' }, 
              {$: 'css.padding', left: '7', selector: '!.md-input-element' }
            ]
          }
        ]
      }, 
      {$: 'group', 
        title: 'preview+editor', 
        style :{$: 'layout.flex', direction: 'row' }, 
        controls: [
          {$: 'material-demo.buttons-src' }, 
          {$: 'editable-text', 
            title: 'template', 
            databind :{$: 'studio.ng-template-as-text', ngPath: '%$globals/ngPath%' }, 
            style :{$: 'editable-text.codemirror', 
              enableFullScreen: true, 
              debounceTime: 300
            }, 
            features: [
              {$: 'flex-layout-item.grow' }, 
              {$: 'css.margin', top: '7' }
            ]
          }
        ]
      }
    ]
  }
})


jb.component('material-demo.buttons-src', {
  type: 'control', 
  impl: {$: 'custom-control', 
        title: 'preview', 
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
})



})