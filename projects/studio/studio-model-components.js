jbLoadModules(['studio/studio-tgp-model','studio/studio-utils']).then(loadedModules => { 
	var model = loadedModules['studio/studio-tgp-model'].model;
	var TgpModel = loadedModules['studio/studio-tgp-model'].TgpModel;
	var utils = loadedModules['studio/studio-utils'];

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

jb.component('studio.param-type', {
  params: [ 
  	{ id: 'path', as: 'string', essential: true },
  ],
  impl: (context,path) => 
      model.paramType(path)
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
      		(comps[pt].category||'').split(',').map(x=>x.split(':')[0]).indexOf(category) != -1)
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
	impl: (context,path) => ({
			$jb_val: function(value) {
				if (typeof value == 'undefined') 
					return model.compName(path);
				else
					model.modify(model.setComp, path, { comp: value },context)
			}
	})
})

jb.component('studio.insert-control',{
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string', defaultValue :{$: 'studio.currentProfilePath' }  },
		{ id: 'comp', as: 'string' },
		{ id: 'type', as: 'string' },
	],
	impl: (context,path,comp,type) => 
		model.modify(model.insertControl, path, { comp: comp, type: type },context)
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

jb.component('studio.wrap-with-array',{
	type: 'action',
	params: [ 
		{id: 'path', as: 'string' },
	],
	impl: (context,path,toAdd) => 
		model.modify(model.wrapWithArray, path, {},context,true)
})

jb.component('studio.can-wrap-with-array', {
  params: [ {id: 'path', as: 'string' } ],
  impl: (context,path) => 
      (model.paramDef(path).type || '').indexOf('[') != -1 && !Array.isArray(model.val(path))
})


jb.component('studio.set-comp',{
	type: 'action',
	params: [ 
		{id: 'path', as: 'string' },
		{id: 'comp', as: 'single' }
	],
	impl: (context,path,comp) => 
		model.modify(model.setComp, path, { comp: comp },context,true)
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

jb.component('studio.components-cross-ref',{
	type: 'data',
	impl: ctx => {
	  var _jbart = utils.jbart_base();
	  utils.modifyOperationsEm.subscribe(_=>_jbart.statistics = null);
	  if (_jbart.statistics) return _jbart.statistics;

	  var refs = {}, comps = _jbart.comps;

      Object.getOwnPropertyNames(comps).forEach(k=>
      	refs[k] = { 
      		refs: calcRefs(comps[k].impl).filter((x,index,self)=>self.indexOf(x) === index) , 
      		by: [] 
      });
      Object.getOwnPropertyNames(comps).forEach(k=>
      	refs[k].refs.forEach(cross=>
      		refs[cross] && refs[cross].by.push(k))
      );

      return _jbart.statistics = jb_entries(comps).map(e=>({
          	id: e[0],
          	refs: refs[e[0]].refs,
          	referredBy: refs[e[0]].by,
          	type: e[1].type || 'data',
          	implType: typeof e[1].impl,
          	refCount: refs[e[0]].by.length
          	//text: jb_prettyPrintComp(comps[k]),
          	//size: jb_prettyPrintComp(e[0],e[1]).length
          }));


      function calcRefs(profile) {
      	if (typeof profile != 'object') return [];
      	return Object.getOwnPropertyNames(profile).reduce((res,prop)=>
      		res.concat(calcRefs(profile[prop])),[jb.compName(profile)])
      }
	}
})

jb.component('studio.references',{
	type: 'data',
	params: [ {id: 'path', as: 'string' } ],
	impl: (ctx,path) => {
	  if (path.indexOf('~') != -1) return [];

      return jb_entries(utils.jbart_base().comps)
      	.filter(e=>
      		isRef(e[1].impl))
      	.map(e=>e[0]).slice(0,10);

      function isRef(profile) {
      	if (profile && typeof profile == 'object')
	      	return profile.$ == path || Object.getOwnPropertyNames(profile).reduce((res,prop)=>
	      		res || isRef(profile[prop]),false)
      }
	}
})

jb.component('studio.jb-editor.nodes', {
	type: 'tree.nodeModel',
	params: [ {id: 'path', as: 'string' } ],
	impl: (ctx,path) =>
		  new TgpModel(path,'jb-editor')
})

jb.component('studio.profile-value-as-text', {
  type: 'data',
  params: [
    { id: 'path', as: 'string' }
  ],
  impl: (context,path) => ({
      $jb_val: function(value) {
        if (typeof value == 'undefined') {
          var val = model.val(path);
          if (val == null)
            return '';
          if (typeof val == 'string')
            return val;
          if (model.compName(path))
            return '=' + model.compName(path);
        }
        else if (value.indexOf('=') != 0)
          model.modify(model.writeValue, path, { value: value },context);
      }
    })
})

jb.component('studio.icon-of-type',{
	type: 'data',
	params: [ {id: 'type', as: 'string' } ],
	impl: (ctx,type) => {
		if (type.match(/.style$/))
			type = 'style';
		return ({
			action: 'play_arrow',
			data: 'data_usage',
			aggregator: 'data_usage',
			control: 'airplay',
			style: 'format_paint',
			feature: 'brush'
		}[type] || 'extension')
	}

})


})