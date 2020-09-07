(function() {
  'use strict';
  var CND, badge, debug, decode, defaults, find_first_match, isa, type_of, urge, validate, validate_optional, warn;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'INTERTEXT/SPLITLINES';

  debug = CND.get_logger('debug', badge);

  urge = CND.get_logger('urge', badge);

  warn = CND.get_logger('warn', badge);

  this.types = new (require('intertype')).Intertype();

  ({isa, validate, validate_optional, type_of} = this.types.export());

  //-----------------------------------------------------------------------------------------------------------
  this.types.declare('sl_settings', {
    tests: {
      'x is an object': function(x) {
        return this.isa.object(x);
      },
      'x.?splitter is a nonempty_text or a nonempty buffer': function(x) {
        if (x.splitter == null) {
          return true;
        }
        return (this.isa.nonempty_text(x.splitter)) || ((this.isa.buffer(x.splitter)) && x.length > 0);
      },
      /* TAINT use `encoding` for better flexibility */
      'x.?decode is a boolean': function(x) {
        return this.isa_optional.boolean(x.decode);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults = {
    splitter: '\n',
    decode: true
  };

  //-----------------------------------------------------------------------------------------------------------
  this.new_context = function(settings) {
    validate_optional.sl_settings(settings);
    settings = {...defaults, ...settings};
    settings.offset = 0;
    settings.lastMatch = 0;
    if (isa.text(settings.splitter)) {
      settings.splitter = Buffer.from(settings.splitter);
    }
    return {
      collector: null,
      ...settings
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  decode = function(me, data) {
    if (!me.decode) {
      return data;
    }
    return data.toString('utf-8');
  };

  //-----------------------------------------------------------------------------------------------------------
  find_first_match = function(buffer, splitter, offset) {
    var fullMatch, i, j, k, l, ref, ref1;
    if (offset >= buffer.length) {
      return -1;
    }
    for (i = l = ref = offset, ref1 = buffer.length; l < ref1; i = l += +1) {
      if (buffer[i] === splitter[0]) {
        if (splitter.length > 1) {
          fullMatch = true;
          j = i;
          k = 0;
          while (j < i + splitter.length) {
            if (buffer[j] !== splitter[k]) {
              fullMatch = false;
              break;
            }
            j++;
            k++;
          }
          if (fullMatch) {
            return j - splitter.length;
          }
        } else {
          break;
        }
      }
    }
    return i + splitter.length - 1;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.send = function(me, d) {
    var R, idx;
    /* thx to https://github.com/maxogden/binary-split/blob/master/index.js */
    validate.buffer(d);
    R = [];
    me.collector = null;
    me.offset = 0;
    me.lastMatch = 0;
    if (me.collector != null) {
      d = Buffer.concat([me.collector, d]);
      me.offset = me.collector.length;
      me.collector = null;
    }
    while (true) {
      idx = find_first_match(d, me.splitter, me.offset - me.splitter.length + 1);
      if (idx >= 0 && idx < d.length) {
        R.push(decode(me, d.slice(me.lastMatch, idx)));
        me.offset = idx + me.splitter.length;
        me.lastMatch = me.offset;
      } else {
        me.collector = d.slice(me.lastMatch);
        break;
      }
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.end = function(me) {
    var R;
    if (me.collector != null) {
      R = decode(me, me.collector);
      me.collector = null;
      return [R];
    }
    return [];
  };

}).call(this);

//# sourceMappingURL=main.js.map