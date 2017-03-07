jbLoadModules(['studio/studio-tgp-model']).then(loadedModules => { 
	var model = loadedModules['studio/studio-tgp-model'].model;

jb.component('studio.short-title', {
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.shortTitle(path)
})

jb.component('studio.val', {
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

jb.component('studio.categories-of-type', {
  params: [ 
  	{ id: 'type', as: 'string', essential: true },
  ],
  impl: (context,_type,marks,allCategory) => {
  	var comps = (jbart.previewjbart || jbart).comps;
  	var pts = model.PTsOfType(_type);
  	var categories = [].concat.apply([],pts.map(pt=>
  		(comps[pt].category||'').split(',').map(c=>c.split(':')[0])
  			.concat(pt.indexOf('.') != -1 ? pt.split('.')[0] : [])
  			.filter(x=>x)))
  			.filter(jb_unique(x=>x))
  			.map(c=>({
  				name: c,
  				pts: ptsOfCategory(c)
  			}));
  	return categories.concat({name: 'all', pts: pts });

  	function ptsOfCategory(category) {
      var pts_with_marks = pts.filter(pt=>
      		pt.split('.')[0] == category || 
      		(comps[pt].category||'').split(',').map(x=>x.split(':')[0]).indexOf(category) == 0)
      	.map(pt=>({
	      	pt: pt,
	      	mark: (comps[pt].category||'').split(',')
	      		.filter(c=>c.indexOf(category) == 0)
	      		.map(c=>Number(c.split(':')[1] || 50))[0]
	      }))
      	.map(x=> {
      		if (x.mark == null)
      			x.mark = 50;
      		return x;
      	})
      	.filter(x=>x.mark != 0);
	  pts_with_marks.sort((c1,c2)=>c2.mark-c1.mark);
	  return pts_with_marks.map(pt=>pt.pt)
  	}
  }
})

jb.component('studio.short-title', {
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.shortTitle(path)
})

jb.component('studio.summary', {
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.summary(path)
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

jb.component('studio.comp-name',{
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.compName(path) || ''
})

jb.component('studio.param-def',{
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


jb.component('studio.comp-name-ref', {
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

jb.component('studio.insert-comp',{
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string', defaultValue :{$: 'studio.currentProfilePath' }  },
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

jb.component('studio.wrap-with-group', {
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.modify(model.wrapWithGroup, path, {},context)
})

jb.component('studio.add-property', {
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.modify(model.addProperty, path, {},context)
})

jb.component('studio.duplicate',{
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string' },
	],
	impl: (context,path) => 
		model.modify(model.duplicate, path, {},context)
})

jb.component('studio.move-in-array',{
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string' },
		{ id: 'moveUp', type: 'boolean', as: 'boolean'} 
	],
	impl: (context,path,moveUp) => 
		model.modify(model.moveInArray, 
					path, { moveUp: moveUp },context,true)
})

jb.component('studio.new-array-item',{
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => 
		model.modify(model.addArrayItem, path, {},context,true)
})

jb.component('studio.add-array-item',{
	type: 'action',
	params: [ 
		{id: 'path', as: 'string' },
		{id: 'toAdd', as: 'single' }
	],
	impl: (context,path,toAdd) => 
		model.modify(model.addArrayItem, path, { toAdd: toAdd },context,true)
})

jb.component('studio.delete',{
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.modify(model._delete,path,{},context,true)
})

jb.component('studio.make-local',{
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.modify(model.makeLocal,path,{ctx: context},context,true)
})

jb.component('studio.make-local',{
	type: 'action',
	params: [ {id: 'path', as: 'string' } ],
	impl: (context,path) => model.modify(model.makeLocal,path,{ctx: context},context,true)
})

jb.component('studio.components-statistics',{
	type: 'data',
	impl: ctx => {
	  var refs = {};
      Object.getOwnPropertyNames(jbart.comps).forEach(k=>
      	refs[k] = { refs: calcRefs(jbart.comps[k].impl), by: [] }
      );
      Object.getOwnPropertyNames(jbart.comps).forEach(k=>
      	refs[k].refs.forEach(cross=>
      		refs[cross] && refs[cross].by.push(k))
      );

      var cmps = Object.getOwnPropertyNames(jbart.comps)
          .map(k=>jbart.comps[k])
          .map(comp=>({
          	id: k,
          	refs: refs[k].refs,
          	referredBy: refs[k].by,
          	type: jbart.comps[k].type,
          	implType: typeof jbart.comps[k].impl,
          	text: jb_prettyPrintComp(jbart.comps[k]),
          	size: jb_prettyPrintComp(jbart.comps[k]).length
          }))

      function calcRefs(profile) {
      	return Object.getOwnPropertyNames(profile).reduce((res,prop)=>
      		res.concat(calcRefs,profile[prop]),[jb.compName(profile)])
      }
	}
})



})