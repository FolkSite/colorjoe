(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    define(['./elemutils'], factory);
  else root.colorjoeextras = factory(root.elemutils);
}(this, function(utils) {
function currentColor(p) {
  var e = utils.div('currentColor', p);

  return {
    change: function(col) {
      utils.BG(e, col.cssa());
    }
  };
}

function fields(p, joe, o) {
  var cs = o.space;
  var fac = o.limit || 255;
  var fix = o.fix >= 0? o.fix: 0;
  var methods = {
    R: 'red',
    G: 'green',
    B: 'blue',
    H: 'hue',
    S: 'saturation',
    V: 'value',
    L: 'lightness',
    C: 'cyan',
    M: 'magenta',
    Y: 'yellow',
    K: 'black'
  };
  var inputLen = ('' + fac).length + fix;
  inputLen = fix? inputLen + 1: inputLen;

  var initials = cs.split('').map(function(n) {return n.toUpperCase();});

  if(['RGB', 'HSL', 'HSV', 'CMYK'].indexOf(cs) < 0)
    return console.warn('Invalid field names', cs);

  var c = utils.div('colorFields', p);
  var elems = initials.map(function(n, i) {
    var e = utils.labelInput('color ' + methods[n], n, c, inputLen);
    e.input.onkeyup = update;

    return {name: n, e: e};
  });

  function update() {
    var col = [cs];

    elems.forEach(function(o) {col.push(o.e.input.value / fac);});
    col.push(1); // alpha

    joe.set(col);
  }

  return {
    change: function(col) {
      elems.forEach(function(o) {
        o.e.input.value = (col[methods[o.name]]() * fac).toFixed(fix);
      });
    }
  };
}

function hex(p, joe, o) {
  var e = utils.labelInput('hex', o.label || '', p, 7);
  e.input.value = '#';

  e.input.onkeyup = function(elem) {
    var val = elem.target.value;
    val = val[0] == '#'? val: '#' + val;
    val = pad(val, 7, '0');

    joe.set(val);
  };

  return {
    change: function(col) {
      e.input.value = e.input.value[0] == '#'? '#': '';
      e.input.value += col.hex().slice(1);
    }
  };
}

function pad(a, n, c) {
  var ret = a;

  for(var i = a.length, len = n; i < n; i++) ret += c;

  return ret;
}

return {
  currentColor: currentColor,
  fields: fields,
  hex: hex
};
}));
