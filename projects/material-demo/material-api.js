jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.resource('material-demo','api',{
	'[md-button],[md-raised-button],[md-mini-fab],[md-icon-button],[md-fab]': `
| Name | Type | Description |
| --- | --- | --- |
| \`color\` | \`"primary"|"accent"|"warn"\` | The color palette of the button
| \`disabled\` | boolean | Whether or not the button is disabled
| \`disableRipple\` | boolean | Whether the ripple effect when the button is clicked should be disabled
`
})


})