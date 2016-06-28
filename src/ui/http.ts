import {jb} from 'jb-core';
import * as jb_rx from 'jb-ui/jb-rx';
//import {Http, RequestOptions, Request, RequestMethods} from '@angular/http';
import { Http, Response, XHRBackend, BrowserXhr, RequestOptions, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';

jb.component('http.get', {
	params: {
		url: { as: 'string' },
		resource: { as: 'string' },
		mapToResource: { dynamic: true, defaultValue: '%%' },
	},
	impl: (ctx,url,resource) => 
		new Http(new XHRBackend(new BrowserXhr(), null, new CookieXSRFStrategy()), new RequestOptions())
//		new Http(new Request(new RequestOptions({url: url})))
			.get(url)
			.do(x => {
				if (resource)
					ctx.resources[resource] = ctx.params.mapToResource(ctx.setData(x.json()))
			})
})
