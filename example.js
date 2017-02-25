const http = require('http')
const Send = require('http-sender')()

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

http.createServer((req, res) => {
  requestHandler(req, res, {}, Send(req, res))
}).listen(5000)
