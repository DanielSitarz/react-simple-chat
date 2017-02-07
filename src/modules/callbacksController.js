export default function callbacksController (callbacks) {
  function add (name, callback) {
    exists(name)
    callbacks[name].push(callback)
    return callbacks[name].length - 1
  }
  function remove (name, id) {
    exists(name)
    callbacks[name][id] = undefined
  }
  function callAll (name) {
    exists(name)
    var args = [...arguments]
    args.shift()
    if (args.length) {
      callbacks[name].forEach(function callFuncWithArgs (c) {
        c(...args)
      })
    } else {
      callbacks[name].forEach(function callFunc (c) {
        c()
      })
    }
  }
  function exists (name) {
    if (!callbacks[name]) {
      throw new Error(`Callback doesn't exist - ${name}`)
    }
  }
  return {
    add: add,
    remove: remove,
    callAll: callAll
  }
}
