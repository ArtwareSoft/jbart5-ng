System.register(['js/jb', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, studio;
    var modified;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            modified = {};
            studio.modifyOperationsEm.subscribe(function (e) {
                var comp = e.comp;
                if (!modified[comp])
                    modified[comp] = { original: e.before };
            });
            jb_1.jb.component('studio.saveComponents', {
                impl: { $rxLog: [
                        function (ctx) { return jb_1.jb.entries(modified).map(function (x) { return { key: x[0], val: x[1] }; }); },
                        function (ctx) {
                            var comp = ctx.data.key;
                            return $.ajax({
                                url: "/jbart/?op=saveComp&comp=" + comp + "&project=" + ctx.exp('%$globals/project%'),
                                type: 'POST',
                                data: JSON.stringify({ original: ctx.data.val.original, toSave: studio.comp_asStr(comp) }),
                                headers: { 'Content-Type': 'text/plain' }
                            }).then(function () { return modified[comp] = null; }, function (e) { return jb_1.jb.logException('error while saving ' + comp, e); });
                        }
                    ] }
            });
        }
    }
});
// function saveComponentsInFile(fileName) {
// 	var deferred = $.Deferred();
// 	debugger;
// 	$.ajax({ url: fileName }).then(function(fileContents) {
// 		var comps = jb_path(jbart, ['studio', 'modifiedFiles', fileName, 'component']);
// 		for (var compName in comps || {})
// 			fileContents = replaceComponentInFile(fileContents, compName);
// 		var request = JSON.stringify({ Contents: fileContents, Path: fileName });
// 		$.ajax({ url: '/jbart/?op=saveFile', type: 'POST', data: request, headers: { 'Content-Type': 'text/plain' } }).then(function(result) {
// 			if (!result.success) deferred.reject();
// 			jb.path(jbart, ['studio', 'modifiedFiles', fileName], null);
// 			deferred.resolve();
// 		}, deferred.reject);
// 	}, deferred.reject);
// 	return deferred.promise();
// }
// function replaceComponentInFile(fileContents, compName) {
// 	var newCode = "jb_component('" + compName + "'," + jb.prettyPrint(jbart.previewjbart.comps[compName]) + ")";
// 	var startIndex = fileContents.indexOf("jb_component('" + compName + "'");
// 	if (startIndex == -1) startIndex = fileContents.indexOf("jb_component(\"" + compName + "\"");
// 	if (startIndex == -1)
// 		return fileContents + '\n' + newCode;
// 	var endIndex = findEndParenthesis(startIndex);
// 	return fileContents.substr(0, startIndex) + newCode + fileContents.substr(endIndex + 1);
// 	function findEndParenthesis(startIndex) {
// 		var open = 0;
// 		var iter = 0;
// 		for (var i = startIndex; i < fileContents.length; i++) {
// 			if (nextTwoChars(i) == '//') {
// 				i = fileContents.indexOf('\n', i) - 1;
// 			} else if (nextTwoChars(i) == '/*') {
// 				i = fileContents.indexOf('/*', i) - 1;
// 			} else if (fileContents.charAt(i) == '(') {
// 				open++;
// 			} else if (fileContents.charAt(i) == ')') {
// 				open--;
// 				if (open == 0)
// 					return i;
// 			}
// 		}
// 		return -1;
// 	}
// 	function nextTwoChars(i) {
// 		return fileContents.charAt(i) + ((i + 1 < fileContents.length) ? fileContents.charAt(i + 1) : '');
// 	}
// }
//# sourceMappingURL=studio-save.js.map