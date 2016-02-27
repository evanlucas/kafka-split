# kafka-split

[![Build Status](https://travis-ci.org/evanlucas/kafka-split.svg)](https://travis-ci.org/evanlucas/kafka-split)
[![Coverage Status](https://coveralls.io/repos/evanlucas/kafka-split/badge.svg?branch=master&service=github)](https://coveralls.io/github/evanlucas/kafka-split?branch=master)

Transform stream for splitting up kafka messages

## Install

```bash
$ npm install kafka-split
```

## Usage

```js
'use strict'

const Split = require('kafka-split')
const net = require('net')

const socket = net.connect()
socket.pipe(Split()).on('data', (chunk) => {
  // chunk will be a kafka buffer that represents a full kafka message
  // starting with the size
})
```

## Test

```bash
$ npm test
```

## Author

Evan Lucas

## License

MIT (See `LICENSE` for more info)
