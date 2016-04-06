import { jb } from 'jb-core/jb';;
import {Observable,Subject} from 'rxjs/Rx';

export function closestNode (el,cls) {
	do {
		if (el.classList && el.classList.contains(cls))
			return el;
		} while (el = el.parentNode);
	return null;
}

export function setWindowEvent(eventName, callback) {
	jb.path(jbart, ['windowOrigEvents', eventName], window['on' + eventName]);
	window['on' + eventName] = callback;
}

export function restoreWindowEvent(events) {
	events = jb.toarray(events);
	for (var i = 0; i < events.length; i++) {
		window['on' + events[i]] = jb.path(jbart, ['windowOrigEvents', events[i]]);
		jb.path(jbart, ['windowOrigEvents', events[i]], null);
	}
}

export function disableSelection(elem) {
	if (!jbart.disableSelectionCssAppended) {
		jbart.disableSelectionCssAppended = true;
		var style = $('<style/>').html('.jb_unselected { webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}');
		style.appendTo('head');
	}
	$(elem).addClass('jb_unselected');
}

export function undisableSelection(elem) {
	$(elem).removeClass('jb_unselected');
}

export function findControlElement(baseElem, controlID) {
	// find the closest control element
	baseElem = baseElem || document.body;
	var cls = 'id-' + fixid(controlID);
	var found = searchChildren(baseElem);
	if (found) return found;

	// now go up and look parents/cousins
	var prevIter = baseElem;
	for (var iter = baseElem.parentNode; iter; iter = iter.parentNode) {
		if (isSearchedElement(iter)) return iter;
		var found = searchSiblings(prevIter);
		if (found) return found;

		prevIter = iter;
	}

	function isSearchedElement(elem) {
		return $(elem).hasClass(cls) && elem.jbControl.id == controlID;
	}

	function searchChildren(elem) {
		if (isSearchedElement(elem)) return elem;
		var controls = $(elem).find('.' + cls);
		if (controls[0]) return controls[0];
	}

	function searchSiblings(elem) {
		var parent = elem.parentNode;
		for (var iter = parent.firstChild; iter; iter = iter.nextSibling) {
			if (iter != elem) {
				var found = searchChildren(iter);
				if (found) return found;
			}
		}
	}
}

export function urlParam(param) {
	var _wnd = window.parent ? window.parent : window;
	var out = (RegExp(param + '=' + '(.+?)(&|$)').exec(_wnd.location.search) || [, null])[1];
	return (out && decodeURIComponent(out)) || '';
}
window.jb_urlParam = urlParam;

export function urlHashParam(param, value) {
	var _wnd = window.parent ? window.parent : window;

	listenToUrlChange();

	var regex = RegExp(param + '=' + '(.+?)(&|$)');


	if (typeof value == 'undefined') {
		var out = (regex.exec(_wnd.location.hash.replace(/([^[#]*)\?/, '?$path=$1&')) || [, null])[1]; // convert path to $path parameter. E.g., #doc1?a=b becomes #?$path=doc1&a=b
		return (out && decodeURIComponent(out)) || '';
	}

	if (param === '$path') {
		_wnd.location.hash = _wnd.location.hash.replace(/([^[#]*)\?/, value + '?');
		return;
	}

	var h = _wnd.location.hash;
	if (value) {
		if (!h.match(regex)) { // new param - add it to the end
			var sep = (h.indexOf('?') != -1) ? '&' : '?';
			_wnd.location.hash = h + sep + param + '=' + value;
		}
		else     // replace existing param
			_wnd.location.hash = h.replace(regex, function(x) { return param + '=' + value + (x.indexOf('&') != -1 ? '&' : '') });
	} else  // remove param
		_wnd.location.hash = h.replace(RegExp('[&]?' + param + '=' + '(.+?)(&|$)'), '');
}

function compareUrls(newUrl, oldUrl) {
	var res = [];
	var params = {};
	oldUrl.split('?').pop().split('&').forEach(function(param) {
		var parts = param.split('=');
		params[parts[0]] = parts[1];
	})
	newUrl.split('?').pop().split('&').forEach(function(param) {
		var parts = param.split('=');
		if (!params[parts[0]] || params[parts[0]] != parts[1])
			res.push(jb.run({ profile: { $urlHashParam: parts[0] } }));
	});
	if ((/([^[#]*)\?/.exec(newUrl) || [, null])[1] != (/([^[#]*)\?/.exec(oldUrl) || [, null])[1]) // compare paths
		res.push(jb.run({ profile: { $urlHashParam: '$path' } }));
	return res;
}

export function listenToUrlChange() {
	if (jbart.listeningToUrlChange) return;
	jbart.listeningToUrlChange = true;

	var _wnd = window.parent ? window.parent : window;
	$(_wnd).bind('hashchange', function(e) {
		e = e.originalEvent;
		compareUrls(e.oldURL.split('#').pop(), e.newURL.split('#').pop()).forEach(function(param) {
			jb.fireObjectChanged(param);
		});
		jb.trigger(jbart, 'afterhashchange', { url: e.newURL.split('#').pop() });
		jb.digest();
	});
}

export function fixid(id) {
	return id.replace(/\s+/g, '-');
}

if (typeof $ != 'undefined' && $.fn)
    $.fn.findIncludeSelf = function(selector) { return this.find(selector).addBack(selector); }  
