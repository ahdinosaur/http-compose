module.exports = compose

function compose (handlers) {
  // don't bother composing singletons
  if (handlers.length == 1) { return handlers[0] }

  var stack = core
  
  handlers.reverse().forEach(function (layer) {
    var child = stack

    stack = function (req, res, context, next) {
      layer(req, res, context, function (err, value) {
        if (err) next(err)
        else if (value) next(null, value)
        else child(req, res, context, next)
      })
    }
  })

  return stack
}

function core (req, res, context, next) { next() }
