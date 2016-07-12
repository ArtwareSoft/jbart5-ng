import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

jb.type('theme');

jb.component('group.theme', {
  type: 'feature',
  params: {
    theme: { type: 'theme' },
  },
  impl: (context,theme) => ({
    extendCtx: (ctx,cmp) => 
      ctx.setVars(theme)
  })
})

jb.component('theme.material-design', {
  type: 'theme',
  impl: () => ({
  	'$editable-text.default-style-profile': 'editable-text.md-input'
  })
})