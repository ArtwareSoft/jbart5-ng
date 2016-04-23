System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    function absLeft(elem, ignoreScroll) {
        if (elem == null)
            return 0;
        var orig = elem, left = 0, curr = elem;
        // This intentionally excludes body which has a null offsetParent.
        if (!ignoreScroll) {
            while (curr && curr.tagName && curr.tagName.toLowerCase() != 'body') {
                left -= curr.scrollLeft;
                curr = curr.parentNode; // scroll can not be calculated using offsetParent!
            }
        }
        while (elem) {
            left += elem.offsetLeft;
            elem = elem.offsetParent;
        }
        return left;
    }
    exports_1("absLeft", absLeft);
    function absTop(elem, ignoreScroll) {
        var top = 0, orig = elem, curr = elem;
        if (typeof ignoreScroll === "undefined")
            ignoreScroll = false;
        if (!ignoreScroll) {
            while (curr && curr.tagName && curr.tagName.toLowerCase() != 'body') {
                top -= curr.scrollTop;
                curr = curr.parentNode;
            }
        }
        while (elem) {
            top += elem.offsetTop;
            elem = elem.offsetParent;
        }
        return top;
    }
    exports_1("absTop", absTop);
    function relTop(elem, parent) {
        var top = 0, orig = elem, curr = elem;
        if (typeof ignoreScroll === "undefined")
            ignoreScroll = false;
        if (!ignoreScroll) {
            while (curr && curr.tagName && curr != parent) {
                top -= curr.scrollTop;
                curr = curr.parentNode;
            }
        }
        while (elem && elem != parent) {
            top += elem.offsetTop;
            elem = elem.offsetParent;
        }
        return top;
    }
    exports_1("relTop", relTop);
    function mousePos(e, removeWindowScroll) {
        var out = {};
        if (e.pageX || e.pageY) {
            out = { x: e.pageX, y: e.pageY };
        }
        else if (e.clientX || e.clientY) {
            var posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            var posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            out = { x: posx, y: posy };
        }
        if (removeWindowScroll && out.y)
            out.y -= (win.pageYOffset || 0);
        if (removeWindowScroll && out.x)
            out.x -= (win.pageXOffset || 0);
        return out;
    }
    exports_1("mousePos", mousePos);
    function stop_prop(e) {
        if (!e)
            return;
        if (e.stopPropagation)
            e.stopPropagation();
        if (e.preventDefault)
            e.preventDefault();
        e.cancelBubble = true;
        return false;
    }
    exports_1("stop_prop", stop_prop);
    function closestNode(el, cls) {
        do {
            if (el.classList && el.classList.contains(cls))
                return el;
        } while (el = el.parentNode);
        return null;
    }
    exports_1("closestNode", closestNode);
    function setWindowEvent(eventName, callback) {
        jb_core_1.jb.path(jbart, ['windowOrigEvents', eventName], window['on' + eventName]);
        window['on' + eventName] = callback;
    }
    exports_1("setWindowEvent", setWindowEvent);
    function restoreWindowEvent(events) {
        events = jb_core_1.jb.toarray(events);
        for (var i = 0; i < events.length; i++) {
            window['on' + events[i]] = jb_core_1.jb.path(jbart, ['windowOrigEvents', events[i]]);
            jb_core_1.jb.path(jbart, ['windowOrigEvents', events[i]], null);
        }
    }
    exports_1("restoreWindowEvent", restoreWindowEvent);
    function disableSelection(elem) {
        if (!jbart.disableSelectionCssAppended) {
            jbart.disableSelectionCssAppended = true;
            var style = $('<style/>').html('.jb_unselected { webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}');
            style.appendTo('head');
        }
        $(elem).addClass('jb_unselected');
    }
    exports_1("disableSelection", disableSelection);
    function undisableSelection(elem) {
        $(elem).removeClass('jb_unselected');
    }
    exports_1("undisableSelection", undisableSelection);
    function findControlElement(baseElem, controlID) {
        // find the closest control element
        baseElem = baseElem || document.body;
        var cls = 'id-' + fixid(controlID);
        var found = searchChildren(baseElem);
        if (found)
            return found;
        // now go up and look parents/cousins
        var prevIter = baseElem;
        for (var iter = baseElem.parentNode; iter; iter = iter.parentNode) {
            if (isSearchedElement(iter))
                return iter;
            var found = searchSiblings(prevIter);
            if (found)
                return found;
            prevIter = iter;
        }
        function isSearchedElement(elem) {
            return $(elem).hasClass(cls) && elem.jbControl.id == controlID;
        }
        function searchChildren(elem) {
            if (isSearchedElement(elem))
                return elem;
            var controls = $(elem).find('.' + cls);
            if (controls[0])
                return controls[0];
        }
        function searchSiblings(elem) {
            var parent = elem.parentNode;
            for (var iter = parent.firstChild; iter; iter = iter.nextSibling) {
                if (iter != elem) {
                    var found = searchChildren(iter);
                    if (found)
                        return found;
                }
            }
        }
    }
    exports_1("findControlElement", findControlElement);
    function urlParam(param) {
        var _wnd = window.parent ? window.parent : window;
        var out = (RegExp(param + '=' + '(.+?)(&|$)').exec(_wnd.location.search) || [, null])[1];
        return (out && decodeURIComponent(out)) || '';
    }
    exports_1("urlParam", urlParam);
    function urlHashParam(param, value) {
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
            if (!h.match(regex)) {
                var sep = (h.indexOf('?') != -1) ? '&' : '?';
                _wnd.location.hash = h + sep + param + '=' + value;
            }
            else
                _wnd.location.hash = h.replace(regex, function (x) { return param + '=' + value + (x.indexOf('&') != -1 ? '&' : ''); });
        }
        else
            _wnd.location.hash = h.replace(RegExp('[&]?' + param + '=' + '(.+?)(&|$)'), '');
    }
    exports_1("urlHashParam", urlHashParam);
    function compareUrls(newUrl, oldUrl) {
        var res = [];
        var params = {};
        oldUrl.split('?').pop().split('&').forEach(function (param) {
            var parts = param.split('=');
            params[parts[0]] = parts[1];
        });
        newUrl.split('?').pop().split('&').forEach(function (param) {
            var parts = param.split('=');
            if (!params[parts[0]] || params[parts[0]] != parts[1])
                res.push(jb_core_1.jb.run({ profile: { $urlHashParam: parts[0] } }));
        });
        if ((/([^[#]*)\?/.exec(newUrl) || [, null])[1] != (/([^[#]*)\?/.exec(oldUrl) || [, null])[1])
            res.push(jb_core_1.jb.run({ profile: { $urlHashParam: '$path' } }));
        return res;
    }
    function listenToUrlChange() {
        if (jbart.listeningToUrlChange)
            return;
        jbart.listeningToUrlChange = true;
        var _wnd = window.parent ? window.parent : window;
        $(_wnd).bind('hashchange', function (e) {
            e = e.originalEvent;
            compareUrls(e.oldURL.split('#').pop(), e.newURL.split('#').pop()).forEach(function (param) {
                jb_core_1.jb.fireObjectChanged(param);
            });
            jb_core_1.jb.trigger(jbart, 'afterhashchange', { url: e.newURL.split('#').pop() });
            jb_core_1.jb.digest();
        });
    }
    exports_1("listenToUrlChange", listenToUrlChange);
    function fixid(id) {
        return id.replace(/\s+/g, '-');
    }
    exports_1("fixid", fixid);
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            if (typeof $ != 'undefined' && $.fn)
                $.fn.findIncludeSelf = function (selector) { return this.find(selector).addBack(selector); };
            window.jb_urlParam = urlParam;
        }
    }
});