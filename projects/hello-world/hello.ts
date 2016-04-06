import {jb} from 'jb-core/jb';;

jb.component('hello-world.test2', {
	type: 'control',
	impl: { $: 'label', title: 'hello test2' }
})

jb.component('hello-world.main', {
  type: 'control', 
  impl :{$: 'label', title: 'hello main' }
})
jb.component('hello-world.group1', {
	type: 'control',
	impl: {$: 'group', 
		title: 'main', 
		style :{$: 'layout.vertical' , spacing: 30},
		controls : [
		{$: 'group', title: '2.0', controls : 
		   [
			{ $: 'label', title: '2.1' },
			{ $: 'button', title: '2.2' },
		  ]
		},
		{$: 'label', title: '1.0' },
	]}
})
