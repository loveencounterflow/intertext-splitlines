

'use strict'


############################################################################################################
CND                       = require 'cnd'
badge                     = 'INTERTEXT/SPLITLINES'
debug                     = CND.get_logger 'debug',     badge
urge                      = CND.get_logger 'urge',      badge
warn                      = CND.get_logger 'warn',      badge
@types                    = new ( require 'intertype' ).Intertype()
{ isa
  validate
  validate_optional
  type_of }               = @types.export()

#-----------------------------------------------------------------------------------------------------------
@types.declare 'sl_settings', tests:
  'x is an object':                     ( x ) -> @isa.object x
  'x.?splitter is a nonempty_text or a nonempty buffer':  ( x ) ->
    return true unless x.splitter?
    return ( @isa.nonempty_text x.splitter ) or ( ( @isa.buffer x.splitter ) and x.length > 0 )
  ### TAINT use `encoding` for better flexibility ###
  'x.?decode is a boolean':             ( x ) -> @isa_optional.boolean x.decode

#-----------------------------------------------------------------------------------------------------------
defaults =
  splitter:     '\n'
  decode:       true

#-----------------------------------------------------------------------------------------------------------
@new_context = ( settings ) ->
  validate_optional.sl_settings settings
  settings            = { defaults..., settings..., }
  settings.offset     = 0
  settings.lastMatch  = 0
  settings.splitter   = ( Buffer.from settings.splitter ) if isa.text settings.splitter
  return { collector: null, settings..., }

#-----------------------------------------------------------------------------------------------------------
decode = ( me, data ) ->
  return data unless me.decode
  return data.toString 'utf-8'

#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( me, d ) ->
  ### thx to https://github.com/maxogden/binary-split/blob/master/index.js ###
  validate.buffer d
  me.offset     = 0
  me.lastMatch  = 0
  if me.collector?
    d             = Buffer.concat [ me.collector, d, ]
    me.offset     = me.collector.length
    me.collector  = null
  loop
    idx = d.indexOf me.splitter, me.offset - me.splitter.length + 1
    if idx >= 0 and idx < d.length
      yield decode me, d.slice me.lastMatch, idx
      me.offset    = idx + me.splitter.length
      me.lastMatch = me.offset
    else
      me.collector  = d.slice me.lastMatch
      break
  return null

#-----------------------------------------------------------------------------------------------------------
@flush = ( me ) ->
  if me.collector?
    yield decode me, me.collector
    me.collector = null
  return null

