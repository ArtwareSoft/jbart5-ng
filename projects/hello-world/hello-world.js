jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.component('hello-world.main', {
  type: 'control', 
  impl :{$: 'label', title: 'hello world' }
})

jb.resource('hello-world','person',{
  "company": "google",
  "firstName": 'Dave',
  "lastName": 'Smith',
  "address": "1600 Amphitheatre Pkway",
  "address2": '',
  "city": 'mountain view',
  "state": 'CA',
  "postalCode": "94043",
})




})