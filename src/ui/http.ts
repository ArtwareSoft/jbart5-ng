import {jb} from 'jb-core';
import * as jb_rx from 'jb-ui/jb-rx';
import { Http, Response, XHRBackend, BrowserXhr, RequestOptions } from '@angular/http';

jb.component('http.get', {
	params: {
		url: { as: 'string' },
		resource: { as: 'string' } 
		mapToResource: { dynamic: true, defaultValue: '%%' },
	},
	impl: (ctx,url,resource) => 
		new Http(new XHRBackend(new BrowserXhr()), new RequestOptions())
			.get(url)
			.do(x =>
				if (resource)
					ctx.resources[resource] = ctx.params.mapToResource(ctx.setData(x.json()))
			)
})
