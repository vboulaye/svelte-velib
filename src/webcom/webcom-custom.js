const Webcom = require('webcom/webcom.js')

Webcom.prototype.auth = function (secret) {
  const self = this
  switch (secret.method) {
    case 'authWithToken':
      return Webcom.prototype[secret.method].apply(self, secret.arguments)

    default:
      throw new Error('auth ' + secret.method + ' is not supported')
  }
}

// redefine child to handle sub path
const oldWebcomChild = Webcom.prototype.child
Webcom.prototype.child = function (path) {
  const self = this
  const pathElements = path.split('.')
  let ref = self
  pathElements.forEach(pathElement => {
    ref = oldWebcomChild.apply(ref, [pathElement])
  })
  return ref
}
// redefine once to be async
Webcom.prototype.onceAsync = function (type, context) {
  const self = this
  return new Promise(function (resolve, reject) {
    return self.once(type, function (node) {
      resolve(node.val())
    }, reject, context)
  })
}

// implement a get method
Webcom.prototype.get = function (path) {
  const self = this
  return self.child(path)
    .onceAsync('value')
}

const oldWebcomUpdateFunction = Webcom.prototype.update
Webcom.prototype.update = function (data) {
  const self = this
  return new Promise(function (resolve, reject) {
    oldWebcomUpdateFunction.apply(self, [data, function (error) {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    }])
  })
}

const oldWebcomLogoutFunction = Webcom.prototype.logout
Webcom.prototype.logout = function () {
  const self = this
  return new Promise(function (resolve, reject) {
    oldWebcomLogoutFunction.apply(self, [function (error) {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    }])
  })
}

module.exports = Webcom
