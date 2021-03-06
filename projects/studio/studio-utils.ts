import {jb} from 'jb-core';
import * as jb_path from 'jb-path';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

export var modifyOperationsEm = new jb_rx.Subject();
//export var studioActivityEm = new jb_rx.Subject();
export var pathChangesEm = new jb_rx.Subject();


export function notifyModification(path,before,ctx,ngPath) {
	var comp = path.split('~')[0];
	modifyOperationsEm.next({ comp: comp, before: before, after: compAsStr(comp), path: path, ctx: ctx, jbart: findjBartToLook(path), ngPath: ngPath });
}

export function message(message,error) {
	$('.studio-message').text(message); // add animation
	$('.studio-message').css('background', error ? 'red' : '#327DC8');
	$('.studio-message').css('animation','');
	jb.delay(1).then(()=>
		$('.studio-message').css('animation','slide_from_top 5s ease')
	)
}

export function jbart_base() {
	return jbart.previewjbart || jbart;
}

export function findjBartToLook(path) {
	var id = path.split('~')[0];
	if (jbart_base().comps[id])
		return jbart_base();
	if (jbart.comps[id])
		return jbart;
}

export function getComp(id) {
	return jbart_base().comps[id] || jbart.comps[id];
}

export function compAsStr(id) {
	return jb_prettyPrintComp(id,getComp(id))
}

export function compAsStrFromPath(path) {
	return compAsStr(path.split('~')[0])
}

export function evalProfile(prof_str) {
	try {
		return eval('('+prof_str+')')
	} catch (e) {
		jb.logException(e,'eval profile:'+prof_str);
	}
}

// ********* Components ************

jb.component('studio.message', {
	type: 'action',
	params: [ { id: 'message', as: 'string' } ],
	impl: (ctx,message) => 
		message(message)
})

jb.component('studio.redraw-studio', {
	type: 'action',
	impl: () => 
    	jbart.redrawStudio && jbart.redrawStudio()
})

jb.component('studio.goto-path', {
	type: 'action',
	params: [ 
		{ id: 'path', as: 'string' },
	],
	impl :{$runActions: [ 
		{$: 'closeContainingPopup' },
		{$: 'writeValue', to: '%$globals/profile_path%', value: '%$path%' }, 
		{$if :{$: 'studio.is-of-type', type: 'control', path: '%$path%'},
			then: {$runActions: [ 
				{$: 'studio.open-properties'},
				{$: 'studio.open-control-tree'} 
			]},
			else :{$: 'studio.open-jb-editor', path: '%$path%' }
		}
	]}
})

jb.component('studio.project-source',{
	params: [ 
		{ id: 'project', as: 'string', defaultValue: '%$globals/project%' } 
	],
	impl: (context,project) => {
		if (!project) return;
		var comps = jb.entries(jbart_base().comps).map(x=>x[0]).filter(x=>x.indexOf(project) == 0);
		return comps.map(comp=>compAsStr(comp)).join('\n\n')
	}
})

jb.component('studio.comp-source',{
	params: [ 
		{ id: 'comp', as: 'string', defaultValue: { $: 'studio.currentProfilePath' } } 
	],
	impl: (context,comp) => 
		compAsStr(comp.split('~')[0])
})

jb.component('studio.onNextModifiedPath', {
	type: 'action',
	params: [
		{ id: 'action', type: 'action', dynamic: true, essential: true }
	],
	impl: (ctx,action) =>  
		modifyOperationsEm.take(1).delay(1)
            .subscribe(e =>
            	action(ctx.setVars({ modifiedPath: e.args.modifiedPath }))
            )
})

jb.component('studio.bindto-modifyOperations', {
  type: 'feature',
  params: [
    { id: 'path', essential: true, as: 'string' },
    { id: 'data', as: 'ref' }
  ],
  impl: (context, path,data_ref) => ({
      init: cmp =>  
        modifyOperationsEm
          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') )
          .filter(e=>
            e.path == path)
          .subscribe(e=>
              jb.writeValue(data_ref,true)
          ),
      jbEmitter: true,
    })
})

jb.component('studio.dynamic-options-watch-new-comp', {
  type: 'feature',
  impl :{$: 'picklist.dynamic-options', 
        recalcEm: () => 
          modifyOperationsEm.filter(e => 
            e.newComp)
  }
})



