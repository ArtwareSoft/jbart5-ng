jb.component('label', {
    type: 'control', category: 'control:100',
    params: [
        { id: 'title', essential: true, defaultValue: 'hello', dynamic: true },
        { id: 'style', type: 'label.style', defaultValue: { $: 'label.span' }, dynamic: true },
        { id: 'features', type: 'feature[]', dynamic: true },
    ],
    impl: ctx => {
        return jb_ui.ctrl(ctx.setVars({title: ctx.params.title() }))
    }
})

jb.type('label.style');

jb.component('label.bind-title', {
  type: 'feature',
  impl: ctx => ({
    doCheck: function(cmp) {
      cmp.title = ctx.vars.$model.title(cmp.ctx);
    }
  })
})

jb.component('label.span', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<span>{{title}}</span>',
        features :{$: 'label.bind-title' }
    }
})

jb.component('label.static-span', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<span>%$title%</span>'
    }
})

jb.component('label.p', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<p>{{title}}</p>',
        features :{$: 'label.bind-title' }
    }
})

jb.component('label.h1', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<h1>{{title}}</h1>',
        features :{$: 'label.bind-title' }
    }
})

jb.component('label.h2', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<h2>{{title}}</h2>',
        features :{$: 'label.bind-title' }
    }
});

jb.component('label.h3', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<h3>{{title}}</h3>',
        features :{$: 'label.bind-title' }
    }
});

jb.component('label.h4', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<h4>{{title}}</h4>',
        features :{$: 'label.bind-title' }
    }
});
