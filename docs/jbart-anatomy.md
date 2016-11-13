# jBart Implementation With Angular2 #
### With discussion about server side compilation ###

## jBart Abstractions ##
jBart suggests abstractions on top of angular components. 

jBart abstractions separates the essence of the UI component from its HTML implementation. E.g.
- button (button, md-button, a href, icon, ..)
- group (section, div, flex-layout, property-sheet, card, md-card, ..)
- editableText (input, textarea, md-input, codemirror, ...)
- editableNumber (input, slider, md-slider, ...)
- itemlist
- tabControl

and more..

We call the abstraction 'control', and the html implemtation is called 'style'.

Let's have a look at two examples:

"Hello World" with jBart:

    {$: 'label', title: 'hello world' }

Which actually means:

    {$: 'label', 
		title: 'hello world', 
		style :{$: 'label.span' } 
    }


"Simple Form" with jBart:

    {$: 'group',
          controls: [
            { $: 'editable-text', 
                title: 'name', 
                databind: '%$person/name%', 
                style :{$: 'editable-text.md-input'} 
            },
            { $: 'editable-text', 
            	title: 'address', 
                databind: '%$person/address%', 
              	style :{$: 'editable-text.md-input'} 
            },
          ]
    }


jBart engine convert these javascript objects to angular2 components, compile, and instantiate them.
    
## Implementation ##

### Primitive Elements ###

Let's explore the implementation of 'label' with some relevant components:


		// specfic label declaration
	    {$: 'label', 
	      title: 'hello world', 
	      style :{$: 'label.md-card-title' }, 
	      features :{$: 'css.width', width: '200', overflow: 'scroll' }
	    }

		// source of label component
	    jb.component('label', {
	        type: 'control',
	        params: [
	            { id: 'title', essential: true, defaultValue: 'hello', dynamic: true },
	            { id: 'style', type: 'label.style', defaultValue :{$: 'label.span' } },
	        ],
	        impl: ctx => jb_ui.ctrl(ctx)
	    })

		// source of specific label style
		jb.component('label.md-card-title', {
		    type: 'label.style',
		    impl :{$: 'customStyle', 
		        template: '<md-card-title>{{title}}</md-card-title>',
		        features :{$: 'label.bind-title' },
		        directives: 'MD_CARD_DIRECTIVES'
		    }
		})

		// source of bind-title feature - there are other ways to bind label titles with different dynamic level
	    jb.component('label.bind-title', {
	      type: 'feature',
	      impl: ctx => ({
	        doCheck: cmp =>
	          cmp.title = ctx.vars.$model.title(cmp.ctx)
	      })
	    })


In jbart5 components of type "control" create angular2 component (a javascript class with decorations).

jb_ui.ctrl is an important core utility in jBart. The 'label' component and many others control components use it to generate the ng2 class component. 
>impl: ctx => **jb_ui.ctrl**(ctx)

jb_ui.ctrl activates a dynamic pipeline to generate the ng component in the following manner: 
- store the control properties in a context object. In the label case, it is just the 'title'.
- call the bounded jbart 'style' component that generates the initial angular component (a javascript class with decorators). In the example, the style component is 'label.md-card-title'
- activates the features one by one on the component. Features can extends or mutate the angular class before compilation. In the example we extend the ngDoCheck method with title binding and extend the styles property with 'width: 200px ; overflow-x:scroll;' .
- compile the angular class using angular dynamic compiler (and use smart cache to avoid the compilation of 'same code' components). 

Static compilation will be discussed later.

### Composition with groups ###

Components are structured using the 'group' component.

    {$: 'group',
          controls: [
            { $: 'label', title: 'hello' }, 
            { $: 'label', title: 'world' } 
          ]
    }

Note that default are used for styles. In this case, the default style of group is 'group.section' and for label is 'label.span'. (default styles are also controlled by themes)

The inner components are dynamically inserted into the group view by using ViewContainerRef::createComponent.

Let's have a look at the implementation of group.section & friends:

		jb.component('group.section', {
		  type: 'group.style',
		  impl :{$: 'customStyle',
		    template: '<section><jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp"></jb_comp></section>',
		    features :{$: 'group.initGroup'}
		  }
		})

		// simpified initGroup
		jb.component('group.initGroup', {
		  type: 'feature',
		  impl: ctx => ({
		    init: cmp => {
	          cmp.title = ctx.params.title();
	          cmp.ctrls = ctx.params.controls().map( comp =>
	                    ({ title: comp.jb_title() , comp: comp } ))

		    }
		  })
		})

The group component instance (we call instances 'cmp' and the classes 'comp') has a data member called 'ctrls' that consists of child angular components (comps) that need to be instantiated.
The children instantiation is done with a generic angular component called 'jb_comp'. jb_comp has a 'comp' property which is the angular component class.

		// simplified jb_comp
		@Component({
		    selector: 'jb_comp',
		    template: '<div #jb_comp></div>',
		})
		export class jbComp {
			  @Input() comp;
			  @ViewChild('child', {read: ViewContainerRef}) childView;
			  constructor(private compiler :Compiler) {}
			  ngOnInit() {
			  	if (comp && comp.compile)
			  		var componentFactory = comp.compile(this.compiler) // uses the factory cache
			  	else
			  		var componentFactory = this.compiler.compileComponentSync(comp);

			   	var cmp_ref = this.childView.createComponent(componentFactory);
			   	comp.registerMethods(cmp_ref,this);
			  }
		}

The jb_comp component allows easy definitions of styles for group. For example, md_card and layouts:

		jb.component('group.md-card', {
		  type: 'group.style',
		  impl :{$: 'customStyle',
		    template: `<md-card>
		        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp"></jb_comp>
		      </md-card>`,
		    features :{$: 'group.initGroup'},
		    directives: 'MD_CARD_DIRECTIVES'
		  }
		})

		jb.component('layout.horizontal', {
		  type: 'group.style',
		  params: [
		    { id: 'spacing', as: 'number', defaultValue: 3 }
		  ],
		  impl :{$: 'customStyle',
		    template: `<div class="jb-group">
		        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" class="group-item"></jb_comp>
		      </div>`,
		    css: `{display: flex}
		        .group-item { margin-right: %$spacing%px }
		        .group-item:last-child { margin-right:0 }`,
		    features :{$: 'group.initGroup'}
		  }
		})

		jb.component('layout.flex', {
		  type: 'group.style',
		  params: [
		      { id: 'align', as: 'string', options: ',flex-start,flex-end,center,space-between,space-around' },
		      { id: 'direction', as: 'string', options: ',row,row-reverse,column,column-reverse' },
		      { id: 'wrap', as: 'string', options:',wrap' },
		  ],
		  impl :{$: 'customStyle',
		    template: `<jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp"></jb_comp>`,
		    css: '{ display: flex; {?justify-content:%$align%;?} {?flex-direction:%$direction%;?} {?flex-wrap:%$wrap%;?} }',
		    features :{$: 'group.initGroup'}
		  }
		})



## Static Compilation ##
Angular2 can produce smaller and faster applications by compiling the templates at the server side. 

Can we use server side compilation with the dynamic nature of jBart5?

First lets explore a little more the jBart class instantiation mechanism.

jBart does not add the specific css styles and lifecycle behavior into the compiled angular class. Instead, it uses a generic lifecycle listener and inject the specific style & behavior to the component instance (componentRef). It means the compilation issue is limited to the template and host properties.

jBart uses a factory cache. The cache key is serialization of the annotations template & host properties and the value is angular compilation result called factory.

To allow server side compilation, jBart can generate typescript files for pre-compilation that contain:
- all ng components in the factory cache, serialized as typescript classes with annotations.
- angular module with bootstrap method that fills jBart factory cache with all compiled components

Using the factory cache, jBart RT will be able to seamlessly use the pre-compiled components and even mix pre-compiled components with dynamically compiled components if the compiler is available at RT.

If we want to completely avoid run-time compilation (e.g, for security reasons) we can also achieve that by providing jb_comp component with no dynamic compiler.