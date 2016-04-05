jb_function('count',function(context,expression) {
	var content = jb_expression('{{' + expression + '}}',context);
	if (!content) return 0;
	if (jb_isArray(content)) return content.length;
	return 1;
});

jb_function('name',function(context,expression) {
	var content = jb_expression('{{' + expression + '}}',context);
	return content && content.$jb_property;
});