jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.type('text.style');

jb.component('text', {
    type: 'control',
    params: {
        text: { essential: true, dynamic: true },
        style: { type: 'text.style', defaultValue: { $: 'text.multi-line' }, dynamic: true },
        title: { as: 'string', defaultValue: 'text' },
        features: { type: 'feature[]', dynamic: true },
    },
    impl: (ctx,text) => 
        jb_ui.ctrl(ctx.setVars({text: ctx.params.text()}))
})

jb.component('text.bind-text', {
  type: 'feature',
  impl: ctx => ({
    doCheck: function(cmp) {
      cmp.text = ctx.vars.$model.text(cmp.ctx);
    }
  })
})


jb.component('text.multi-line', {
    type: 'text.style',
    params: {
        rows: {as: 'number', defaultValue: '8'},
        cols: {as: 'number', defaultValue: '80'},
    },
    impl :{$: 'customStyle', 
        template: '<div><textarea readonly cols="%$cols%" rows="%$rows%">{{text}}</textarea></div>',
        features :{$: 'text.bind-text'}
    }
})

jb.component('text.paragraph', {
    type: 'text.style',
    impl :{$: 'customStyle', 
        template: '<p>{{text}}</p>',
        features :{$: 'text.bind-text' }
    }
})

jb.component('rich-text', {
    type: 'control',
    params: {
        text: { essential: true, as: 'string', dynamic: true },
        title: { as: 'string', defaultValue: 'rich-text', dynamic: true },
        style: { type: 'rich-text.style', defaultValue: { $: 'rich-text.html' }, dynamic: true },
        features: { type: 'feature[]', dynamic: true },
    },
    impl: (ctx,text,title) => 
        jb_ui.ctrl(ctx.setVars({text: text(), title: title() }))
})

jb.component('rich-text.html', {
    type: 'rich-text.style',
    impl :{$: 'customStyle', 
        template: '%$text%',
    }
})

jb.component('rich-text.html-in-section', {
    type: 'rich-text.style',
    impl :{$: 'customStyle', 
        template: `<section>
                    <div class="title">%$title%</div>
                    %$text%
                </section>`,
    }
})

})