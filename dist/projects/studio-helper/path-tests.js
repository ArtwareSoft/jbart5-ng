System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('path-single-control', {
                type: 'test',
                impl: { $: 'jb-path-test',
                    $vars: { tst: 10 },
                    controlWithMark: { $: 'group',
                        controls: { $: 'label', title: 'hello', $mark: true }
                    },
                    expectedStaticPath: 'controls',
                    expectedDynamicCounter: 1,
                    probeCheck: '%$tst% == 10'
                }
            });
        }
    }
});
// jb.component('path-pt-by-example', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'itemlist', 
// 				items :{$list: [1,2]},
// 				controls :{$: 'label', title: 'hello', $mark: true } 
// 			}
// 		},
// 		expectedStaticPath : 'controls~controls',
// 		expectedDynamicCounter: 2,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('path-using-global', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'test.inner-label', $mark: true } 
// 		},
// 		expectedStaticPath : 'controls',
// 		expectedDynamicCounter: 1,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('test.inner-label', {
// 	type: 'control',
// 	impl :{$: 'label', title: 'hello' }
// })
// jb.component('test.inner-label-template', {
// 	type: 'control',
// 	params: {
// 		ctrl :{ type: 'control', dynamic: true }
// 	},
// 	impl :{$: 'group', control :{ $call: 'ctrl'} }
// })
// jb.component('path-inner-in-template', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'test.inner-label-template',
// 				ctrl :{$: 'label', title: 'hello', $mark: true } 
// 			} 
// 		},
// 		expectedStaticPath : 'controls~ctrl',
// 		expectedDynamicCounter: 1,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('path-pipeline-sugar1', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'label', title: ['$mark:hello'] } 
// 		},
// 		expectedStaticPath : 'controls~title~0',
// 		expectedDynamicCounter: 0,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('path-pipeline-sugar2', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'label', title: {$pipeline: ['$mark:hello'] } } 
// 		},
// 		expectedStaticPath : 'controls~title~$pipeline~0',
// 		expectedDynamicCounter: 0,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('path-pipeline-no-sugar', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'label', title :{$: 'pipeline', items: ['$mark:hello'] } } 
// 		},
// 		expectedStaticPath : 'controls~title~$pipeline~items~0',
// 		expectedDynamicCounter: 0,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('path-pipeline-one-elem', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'label', title :{$: 'pipeline', items: '$mark:hello' } } 
// 		},
// 		expectedStaticPath : 'controls~title~$pipeline~items',
// 		expectedDynamicCounter: 0,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('path-filter-sugar', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'label', title : ['hello', {$filter: '$mark:%% == "hello"'}] } 
// 		},
// 		expectedStaticPath : 'controls~title~1~$filter',
// 		expectedDynamicCounter: 0,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('path-filter-no-sugar', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'label', title : ['hello', {$: 'filter', filter :'$mark:%% == "hello"'}] } 
// 		},
// 		expectedStaticPath : 'controls~title~1~filter',
// 		expectedDynamicCounter: 0,
// 		probeCheck : '%$tst% == 10'
// 	}
// })
// jb.component('path-asIs', {
// 	type: 'test',
// 	 impl :{$: 'jb-path-test', 
// 	 	$vars: { tst: 10 },
// 		controlWithMark: {$: 'group', 
// 			controls :{$: 'label', title :{ $asIs: '$mark:hello'} },
// 		},
// 		expectedStaticPath : 'controls~title~$asIs',
// 		expectedDynamicCounter: 0,
// 		probeCheck : '%$tst% == ""'
// 	}
// })
