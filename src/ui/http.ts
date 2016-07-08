import {jb} from 'jb-core';
import * as jb_rx from 'jb-ui/jb-rx';
//import {Http, RequestOptions, Request, RequestMethods} from '@angular/http';
import { Http, Response, XHRBackend, BrowserXhr, RequestOptions, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';

jb.component('http.get', {
	params: {
		url: { as: 'string' },
	},
	impl: (ctx,url,resource) => 
		new Http(new XHRBackend(new BrowserXhr(), null, new CookieXSRFStrategy()), new RequestOptions())
			.get(url)
			.map(x=>
				x.json())
//			.take(1)
			// .do(x => {
			// 	if (resource)
			// 		ctx.resources[resource] = ctx.params.mapToResource(ctx.setData(x.json()))
			// })
})
