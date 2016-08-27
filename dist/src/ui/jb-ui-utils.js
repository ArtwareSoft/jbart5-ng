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
        $(elem).addClass('noselect');
    }
    exports_1("disableSelection", disableSelection);
    function undisableSelection(elem) {
        $(elem).removeClass('noselect');
    }
    exports_1("undisableSelection", undisableSelection);
    function urlParam(param) {
        var _wnd = window.parent ? window.parent : window;
        var out = (RegExp(param + '=' + '(.+?)(&|$)').exec(_wnd.location.search) || [, null])[1];
        return (out && decodeURIComponent(out)) || '';
    }
    exports_1("urlParam", urlParam);
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
