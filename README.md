
# InterText SplitLines

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [What It Does](#what-it-does)
- [How to Use It](#how-to-use-it)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What It Does

InterText SplitLines facilitates splitting and assembling buffers into neat, decoded lines of text.

## How to Use It

* import module as `SL = require 'intertext-splitlines'`
* create context object as `ctx = SL.new_context settings`
* where `settings` is an optional object with settings, see below
* whenever you receive a buffer from a stream or other source (such as a NodeJS stream's `data` event),
  call `lines = SL.send ctx, buffer` with that data
* you receive a (possibly empty) list of lines as return value; use them as seen fit
* when the stream has ended, there may still be buffered data with any number of lines, so don't forget to
  call `lines = SL.end ctx` to receive those pending zero or more lines.


