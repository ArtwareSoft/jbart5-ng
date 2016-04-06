import {Component} from 'angular2/core';
import {MdButton, MdAnchor} from 'node_modules/@angular2-material/button';

@Component({
    selector: 'my-app',.
    template: `<h1>My First Angular 2 App</h1>
    	<button md-raised-button>raised</button>
<button md-fab>
    <i class="material-icons md-24">add</i>
</button>    	
    	`,
    directives: [MdButton, MdAnchor]
})
export class AppComponent { }
