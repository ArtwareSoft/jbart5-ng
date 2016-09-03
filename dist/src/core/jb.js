System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb;
    return {
        setters:[],
        execute: function() {
            exports_1("jb", jb = {
                component: jb_component,
                resource: jb_resource,
                type: jb_type,
                Ctx: jbCtx,
                ctx: jb_ctx,
                comps: jbart.comps,
                compName: jb_compName,
                isProfOfType: jb_isProfOfType,
                logException: jb_logException,
                logError: jb_logError,
                logPerformance: jb_logPerformance,
                widgets: jbart_widgets,
                bind: jb_bind,
                trigger: jb_trigger,
                equals: jb_equals,
                val: jb_val,
                writeValue: jb_writeValue,
                prettyPrint: jb_prettyPrint,
                stringify: jb_prettyPrint,
                path: jb_path,
                toarray: jb_toarray,
                tostring: jb_tostring,
                delay: jb_delay,
                extend: jb_extend,
                map: jb_map,
                obj: jb_obj,
                //	ownPropertyNames: jb_ownPropertyNames, // keeps the order (unlike Object.getOwn..)
                range: jb_range,
                entries: jb_entries,
                flattenArray: jb_flattenArray,
                compareArrays: jb_compareArrays,
                writeToResource: jb_writeToResource,
            });
        }
    }
});
