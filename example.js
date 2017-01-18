const http = require('http')

const compose = require('./')

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
