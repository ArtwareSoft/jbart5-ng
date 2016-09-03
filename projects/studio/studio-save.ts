import {jb} from 'jb-core';
import {model} from './studio-tgp-model';
import {compAsStr,modifyOperationsEm,message} from './studio-utils';

var modified = {};

modifyOperationsEm.subscribe(e=>{
	var comp = e.comp;
	if (!modified[comp]) {
		console.log('save-subs',e.before);
		modified[comp] = { original : e.before || '' }
	}
})

jb.component('studio.saveComponents', {
	params: [
		{ id: 'force',as: 'boolean', type: 'boolean' }
	],
	impl :{$rxLog : [
			ctx => jb.entries(modified).map(x=>
				({key:x[0],val:x[1]})),
			ctx => {
				var comp = ctx.data.key;
				message('saving ' + comp);
				if (ctx.exp('%$force%') && !ctx.data.val.original)
					ctx.data.val.original = `jb.component('${comp}', {`;

				return $.ajax({ 
					url: `/?op=saveComp&comp=${comp}&project=${ctx.exp('%$globals/project%')}&force=${ctx.exp('%$force%')}`, 
					type: 'POST', 
					data: JSON.stringify({ original: ctx.data.val && ctx.data.val.original, toSave: compAsStr(comp) }),
					headers: { 'Content-Type': 'text/plain' } 
				}).then(
					result => {
						message((result.type || '') + ': ' + (result.desc || '') + (result.message || ''), result.type != 'success');
						if (result.type == 'success')
							delete modified[comp];
					},
					e=> {
						message('error saving: ' + e);
						jb.logException(e,'error while saving ' + comp)
					}
				)
			}
		], 
		$vars: {
			force: '%$force%'
		}
	}
});
