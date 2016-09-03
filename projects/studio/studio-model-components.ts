import {jb} from 'jb-core';
import {model} from './studio-tgp-model';

jb.component('studio.short-title',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.shortTitle(path)
})

jb.component('studio.val',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.val(path)
})

jb.component('studio.is-primitive-value', {
  params: [ {id: 'path', as: 'string' } ],
  impl: (context,path) => 
      typeof model.val(path) == 'string'
})

jb.component('studio.is-of-type', {
  params: [ 
  	{ id: 'path', as: 'string', essential: true },
  	{ id: 'type', as: 'string', essential: true },
  ],
  impl: (context,path,_type) => 
      model.isOfType(path,_type)
})

jb.component('studio.PTs-of-type', {
  params: [ 
  	{ id: 'type', as: 'string', essential: true },
  ],
  impl: (context,_type) => 
      model.PTsOfType(_type)
})

jb.component('studio.short-title', {
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.shortTitle(path)
})

jb.component('studio.has-param', {
	params: [ 
		{ id: 'path', as: 'string' }, 
		{ id: 'param', as: 'string' }, 
	],
	impl: (context,path,param) => 
		model.paramDef(path+'~'+param)
})

jb.component('studio.non-control-children',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.children(path,'non-controls')
})

jb.component('studio.array-children',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.children(path,'array')
})

jb.component('studio.compName',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.compName(path) || ''
})

jb.component('studio.paramDef',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.paramDef(path)
})

jb.component('studio.enum-options',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		((model.paramDef(path) || {}).options ||'').split(',').map(x=>{return {code:x,text:x}})
})

jb.component('studio.prop-name',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.propName(path)
})

jb.component('studio.more-params',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
        model.jbEditorMoreParams(path)
})


jb.component('studio.compName-ref',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => { return {
			$jb_val: function(value) {
				if (typeof value == 'undefined') 
					return model.compName(path);
				else
					model.modify(model.setComp, path, { comp: value },context)
			}
		}	
	}
})

jb.component('studio.insertComp',{
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string' },
		{ id: 'comp', as: 'string' },
	],
	impl: (context,path,comp) => 
		model.modify(model.insertComp, path, { comp: comp },context)
})

jb.component('studio.wrap', {
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string' }, 
		{ id: 'compName', as: 'string' } 
	],
	impl: (context,path,compName) => 
		model.modify(model.wrap, path, {compName: compName},context)
})

jb.component('studio.wrapWithGroup', {
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.modify(model.wrapWithGroup, path, {},context)
})

jb.component('studio.addProperty', {
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.modify(model.addProperty, path, {},context)
})

jb.component('studio.wrapWithPipeline', {
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.modify(model.wrapWithPipeline, path, {},context)
})

jb.component('studio.duplicate',{
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string' },
	],
	impl: (context,path) => 
		model.modify(model.duplicate, path, {},context)
})

jb.component('studio.moveInArray',{
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string' },
		{ id: 'moveUp', type: 'boolean', as: 'boolean'} 
	],
	impl: (context,path,moveUp) => 
		model.modify(model.moveInArray, 
					path, { moveUp: moveUp },context)
})

jb.component('studio.newArrayItem',{
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.modify(model.addArrayItem, path, {},context)
})


jb.component('studio.delete',{
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.modify(model._delete,path,{},context)
})

jb.component('studio.make-local',{
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.modify(model.makeLocal,path,{ctx: context},context)
})





