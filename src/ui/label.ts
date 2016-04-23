import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('label', {
    type: "control",
    params: {
        title: { essential: true, defaultValue: 'label', as: 'ref' },
        style: { type: 'label.style', defaultValue: { $: 'label.span' }, dynamic: true },
        features: { type: 'feature[]', dynamic: true },
    },
    impl: ctx => 
        jb_ui.ctrl(ctx.setVars({title: jb.val(ctx.params.title)}))
})

jb.type('label.style');

jb.component('label.span', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<span>{{title}}</span>',
        features :{$: 'oneWayBind', to: '{{title}}', value: '%$$model/title%' }
    }
})

jb.component('label.static-span', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<span>%$title%</span>'
    }
})

jb.component('label.h1', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<h1>{{title}}</h1>',
        features :{$: 'oneWayBind', to: '{{title}}', value: '%$$model/title%' }
    }
})

jb.component('label.h2', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<h2>{{title}}</h2>',
        features :{$: 'oneWayBind', to: '{{title}}', value: '%$$model/title%' }
    }
});




