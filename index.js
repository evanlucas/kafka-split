'use strict'

const Transform = require('stream').Transform
const inherits = require('util').inherits

module.exports = Split

function Split() {
  if (!(this instanceof Split))
    return new Split()

  Transform.call(this)
  this._current = null
}
inherits(Split, Transform)

Split.prototype._transform = function _transform(chunk, enc, cb) {
  while (true) {
    if (this._current) {
      chunk = Buffer.concat([this._current, chunk])
    }

    if (chunk.length < 4) {
      this._current = chunk
      return cb()
    }

    const size = chunk.readInt32BE(0)

    if (chunk.length < size + 4) {
      this._current = chunk
      return cb()
    } else {
      const msg = chunk.slice(0, size + 4)
      this.push(msg)
      this._current = null
      chunk = chunk.slice(size + 4)
    }
  }
}
