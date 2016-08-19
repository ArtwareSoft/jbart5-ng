
// jb_component('data-test',{
// 	params: {
// 		calculate: { dynamic: true },
// 		runBefore: { type: 'action', dynamic: true },
// 		resultVariable: { as: 'string', defaultValue:'result' },
// 		action: { type: 'action', dynamic: true },
// 		expectedResult: { type: 'boolean', dynamic: true, as: 'boolean' }
// 	},
// 	impl: function(context,calculate,runBefore,resultVariable,action,expectedResult) {
// 		runBefore();
// 		var value = calculate();
// 		return result(value);

// 		function result(value) {
// 			if (context.vars.$testContext) 
// 				context.vars.$testContext.result = value;
// 			action(jb_ctx(context, { data: value, vars: jb_obj(resultVariable,value) }));
// 			return expectedResult(jb_ctx(context,{ data: value, vars: jb_obj(resultVariable,value) }));
// 		}
// 	}
// })

// jb_component('ng-ui-test',{
// 	params: {
// 		control: { type: 'control', dynamic: true },
// 		expectedTemplateResult: { type: 'boolean', dynamic: true, as: 'boolean' },
// 		expectedHtmlResult: { type: 'boolean', dynamic: true, as: 'boolean' },
// 		runBefore: { type: 'action', dynamic: true },
// 		cleanAfter: { type: 'action', dynamic: true },
// 	},
// 	impl: function(context,control,expectedTemplateResult,expectedHtmlResult,runBefore,cleanAfter) {
// 		var scope = context.vars.scope;
// 		return scope.$q(function(resolve, reject)	{
// 			runBefore();
// 			var ctrl = control();
// 			var res = true;
// 			if (expectedTemplateResult.profile)
// 				res = expectedTemplateResult(jb_ctx(context,{ data: ctrl}));
// 			if (expectedHtmlResult.profile) {
// 	           	var html = scope.$compile(ctrl)(scope);
// 	           	scope.$timeout(function() {
// 					res = res && expectedHtmlResult((jb_ctx(context,{ data: html.html() || '' })));
// 					cleanAfter();
// 					resolve(res);
// 	           	})
// 			} else {
// 				cleanAfter();resolve(res);
// 			}
// 		});
// 	}
// });

// jb_component('autoTest',{
// 	params: {
// 		page: { type: "control", dynamic: true },
// 		runBefore: { type: "action", dynamic: true },
// 		run: { type: "action", dynamic: true },
// 		wait: { type:"boolean", as:'boolean'},
// 		waitFor: { type:"action", as:'single', dynamic:true},
// 		expectedResult: { type: "expectedResult", dynamic: true, as: 'boolean' },
// 		cleanAfter: { type: "action", dynamic: true }
// 	},
// 	impl: function(context,page,runBefore,run,wait,waitFor,expectedResult,cleanAfter) {
// 		runBefore();
// 		var wrapper = context.vars.testWrapper;
// 		if (!wrapper) wrapper = $('<div/>').appendTo("body").hide()[0];
// 		var control = jb_appendControl(wrapper, context, page);
// 		run(jb_ctx(context,{vars: { control: control }}));
// 		var waitingFor = waitFor();
// 		if (!wait && !waitingFor) 
// 			return result();
// 		else if (waitingFor)
// 			return $.when(waitingFor).then(result);
// 		else {
// 			var deferred = $.Deferred();
// 			waitNext();
// 			return deferred.promise();
// 		}
// 		function waitNext() {
// 			var waitingElem = $(wrapper).find('.jb-waiting').andSelf('.jb-waiting')[0];
// 			if (!waitingElem) 	// done
// 				deferred.resolve( result() );
// 			else 
// 				jb_bind(waitingElem.jbControl,'prepareDone',waitNext);
// 		}

// 		function result() {
// 			var result = expectedResult(jb_ctx(context,{data: wrapper}));
// 			cleanAfter();
// 			if (!context.vars.testWrapper)
// 				jb_removeElement(wrapper);
// 			return result;			
// 		}
// 	}
// });

// jb_component('dialogsParent', {
// 	type: 'data',
// 	impl: function(context) {
// 		return jb_dialogsParent();
// 	}
// });

// jb_component('closeAllDialogs', {
// 	type: 'action',
// 	impl: function(context) {
// 		$('.jbart-dialog').each(function(i,dlg) {
// 			dlg.jbDialog && dlg.jbDialog.close();
// 		});
// 	}
// });

