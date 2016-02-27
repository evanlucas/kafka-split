'use strict'

const test = require('tap').test
const Split = require('./')
const Readable = require('stream').Readable

test('Split', (t) => {
  t.plan(7)

  let count = 0
  let buf

  function read() {
    count++

    switch (count) {
      case 1:
        buf = Buffer(30)
        buf.writeInt32BE(6, 0)
        buf.write('tester', 4, 6, 'utf8')

        buf.writeInt32BE(6, 10)
        buf.write('bester', 14, 6, 'utf8')

        buf.writeInt32BE(6, 20)
        buf.write('lester', 24, 6, 'utf8')

        // only send the first 24 bytes
        this.push(buf.slice(0, 24))
        break
      case 2:
        // send the last 6
        this.push(buf.slice(24, 30))
        break
      default:
        this.push(Buffer(2))
        this.push(null)
        break
    }
  }

  const stream = new Readable({
    read: read
  })

  const strs = ['tester', 'bester', 'lester']
  stream
    .pipe(Split())
    .on('data', (chunk) => {
      if (!strs.length) {
        return t.fail('received more than 3 data events')
      }
      const size = chunk.readInt32BE(0)
      t.equal(size, 6, 'size is correct')
      t.equal(chunk.toString('utf8', 4, 10), strs.shift(), 'data is correct')
    })
    .on('end', () => {
      t.pass('got end event')
    })
})
