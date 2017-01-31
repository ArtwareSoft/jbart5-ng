jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.component('level-test.get', {
	 impl :{$: 'data-test', 
		calculate :{$:'level-up.get', 
			db :{$: 'level-up.file-db',	rootDirectory: '/projects/data-tests/samples' },
			key: 'people.json'
		},
		expectedResult :{$: 'contains', 
			text: 'Simpson' 
		}
	},
})

jb.component('level-test.entries', {
	 impl :{$: 'data-test', 
		calculate :{$:'level-up.entries', 
			db :{$: 'level-up.file-db',	rootDirectory: '/projects/data-tests/samples' }
		},
		expectedResult :{$: 'contains', 
			text: 'people.json' 
		}
	},
})

jb.component('level-test.asynch-in-pipe', {
	 impl :{$: 'data-test', 
		calculate : {$pipe: [ {$:'level-up.get', 
			db :{$: 'level-up.file-db',	rootDirectory: '/projects/data-tests/samples' },
			key: 'people.json'
		}]},
		expectedResult :{$: 'contains', 
			text: 'Simpson' 
		}
	},
})


})