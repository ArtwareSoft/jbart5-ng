import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import { Http, HTTP_PROVIDERS } from '@angular/http';

jb_ui.registerProviders({ HTTP_PROVIDERS: HTTP_PROVIDERS });

jb.component('http.get', {
	params: [
		{ id: 'url', as: 'string' },
	],
	impl: (ctx,url) =>
		ctx.vars.injector.get(Http)
			.get(url)
			.map(x=>
				x.json())
})
