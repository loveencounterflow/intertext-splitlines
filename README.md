
# InterText SplitLines

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [What It Does](#what-it-does)
- [How to Use It](#how-to-use-it)
- [Revisions](#revisions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What It Does

InterText SplitLines facilitates splitting and assembling buffers into neat, decoded lines of text.

## How to Use It

* import module as `SL = require 'intertext-splitlines'`
* create context object as `ctx = SL.new_context settings`
* where `settings` is an optional object with settings, see below
* whenever you receive a buffer from a stream or other source (such as a NodeJS stream's `data` event),
  call `SL.walk_lines ctx, buffer` with that data; this returns an iterator over the decoded complete lines
  in the buffer, if any
* when the stream has ended, there may still be buffered data with any number of lines, so don't forget to
  call `SL.flush ctx` to receive another iterator over the last line, if any

In JavaScript:

```js
// for each buffer received, do:
for ( line of SL.walk_lines( ctx, buffer ) )
  { do_something_with( line ) };
// after the last buffer has been received, do:
for ( line of SL.flush( ctx ) )
  { do_something_with( line ) };
```

In CoffeeScript:

```coffee
# for each buffer received, do:
for line from SL.walk_lines ctx, buffer
  do_something_with line
# after the last buffer has been received, do:
for line from SL.flush ctx
  do_something_with line
```

## Revisions

* [X] throw out `find_first_match()`, replace by `buffer.indexOf()`
* [X] do not return lists but iterators
* [X] publish v1.0.0







