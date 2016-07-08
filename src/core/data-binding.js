function jb_equals(x,y) {
  return x == y || jb_val(x) == jb_val(y)
}

function jb_writeValue(to,val) {
  if (!to) return;
  if (to.$jb_val) 
    return to.$jb_val(jb_val(val));
  if (to.$jb_parent)
    to.$jb_parent[to.$jb_property] = jb_val(val);
}

function jb_writeToResource(resource,val,ctx) {
  if (resource)
    ctx.resources[resource] = val;
}

function jb_objectProperty(object,property,jstype,lastInExpression) {
  if (!object) return null;
  if (typeof object[property] == 'undefined') 
    object[property] = lastInExpression ? null : {};
  if (jstype == 'string' || jstype == 'boolean' || jstype == 'number')
    return jbart.jstypes[jstype](object[property]); // no need for valueByRef

  if (jstype == 'ref' && lastInExpression)
    return { $jb_parent: object, $jb_property: property };
  return object[property];
}

function jb_val(val) {
  if (val == null) return val;
  if (val.$jb_val) return val.$jb_val();
  return (val.$jb_parent) ? val.$jb_parent[val.$jb_property] : val;
}

function jb_handledObject(object) {
  return object
}
