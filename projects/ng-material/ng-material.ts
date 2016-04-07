import {jb} from 'jb-core/jb';;

jb.component('ng-material.toolbar', {
	type: 'control',
	impl: { $: 'group', controls: [] }
})

jb.component('ng-material.main', {
  type: 'control', 
  impl :{$: 'label', title: 'hello main' }
})
