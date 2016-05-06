import {jb} from 'jb-core';
import * as studio from './studio-model';

var modified = {};

studio.modifyOperationsEm.subscribe(e=>{
	var comp = e.comp;
	if (!modified[comp])
		modified[comp] = { original : e.before || '' }
})

jb.component('studio.saveComponents', {
	params: {
		force: {as: 'boolean', type: 'boolean' }
	},
	impl :{$rxLog : [
			ctx => jb.entries(modified).map(x=>
				({key:x[0],val:x[1]})),
			ctx => {
				var comp = ctx.data.key;
				return $.ajax({ 
					url: `/?op=saveComp&comp=${comp}&project=${ctx.exp('%$globals/project%')}&force=${ctx.exp('%$force%')}`, 
					type: 'POST', 
					data: JSON.stringify({ original: ctx.data.val && ctx.data.val.original, toSave: studio.compAsStr(comp) }),
					headers: { 'Content-Type': 'text/plain' } 
				}).then(
					()=>modified[comp] = null,
					(e)=>
						jb.logException(e,'error while saving ' + comp)
				)
			}
		], 
		$vars: {
			force: '%$force%'
		}
	}
});
