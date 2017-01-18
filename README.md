# http-compose

minimal http handler composition

```shell
npm install --save http-compose
```

## example

```js
const http = require('http')
const compose = require('compose-http')

const requestHandler = compose([
  (req, res, context, next) => {
    if (req.url === '/first') next(null, 'first')
    else next()
  },
  (req, res, context, next) => {
    context.yes = true
    next()
  },
  (req, res, context, next) => {
    if (req.url === '/error') next(new Error('Bad request'))
    else next()
  },
  (req, res, context, next) => {
    if (req.url !== '/404') next(null, context.yes)
    else next()
  },
])

const finalHandler = (req, res) => (err, value) => {
  if (err) {
    console.error(err.stack)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end(err.stack + "\n")
  } else if (value) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(value, null, 2) + "\n")
  } else {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end('Not Found\n')
  }
}

http.createServer((req, res) => {
  requestHandler(req, res, {}, finalHandler(req, res))
}).listen(5000)
```

## usage

### `compose = require('http-compose')`

### `handler = compose(handlers)`

where a handler function is of shape:

```js
function handler (req, res, context, next) {
  next(err, value)
}
```

composes an `Array` of handler functions into a single handler function.

if any handler function passes either an `err` or `value` to `next()`, `compose` will skip any subsequent handlers and forward this to the final `next()` callback.

## license

The Apache License

Copyright &copy; 2017 Michael Williams

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.