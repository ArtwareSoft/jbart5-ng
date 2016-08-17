import {jb} from 'jb-core';

jb.component('path-test-single-control', {
	type: 'test',
	 impl :{$: 'jb-path-test', 
	 	$vars: { tst: 10 },
		controlWithMark: {$: 'group', 
			controls :{$: 'label', title: 'hello', $mark: true } 
		},
		expectedStaticPath : 'controls',
		expectedDynamicCounter: 1,
		probeCheck : '%$tst% == 10'
	}
})




