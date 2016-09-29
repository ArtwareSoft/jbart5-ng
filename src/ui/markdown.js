jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.component('markdown', {
    type: 'control',
    params: [
        { id: 'markdown', as: 'string', essential: true, dynamic: true },
        { id: 'style', type: 'markdown.style', defaultValue: { $: 'markdown.showdown' }, dynamic: true },
        { id: 'title', as: 'string', defaultValue: 'markdown' },
        { id: 'features', type: 'feature[]', dynamic: true },
    ],
    impl: (ctx,text) => 
        jb_ui.ctrl(ctx.setVars({markdown: ctx.params.markdown()}))
})

jb.type('markdown.style');

jb.component('markdown.showdown', {
    type: 'markdown.style',
    impl: ctx => ({
        template: '<div></div>',
        init: function(cmp) {
            cmp.elementRef.nativeElement.innerHTML = 
                new showdown.Converter({tables:true})
                    .makeHtml(ctx.vars.markdown);
        }
    })
})


})