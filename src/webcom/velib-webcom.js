/* eslint-disable comma-dangle */
const Webcom = require('./webcom-custom.js')
const WebComSecret = require('./webcom-secret.js')

function VelibWebcom () {
  return {
    // login and return the ref to the base ref
    auth: () => {
      try {
        const ref = new Webcom('https://io.datasync.orange.com/base/my-velib')
        return ref
          .auth(WebComSecret)
          .then(() => ref)
      } catch (e) {
        console.warn('unable to connect to webcom, working without webcom: ' + e)
        return Promise.resolve(null)
      }
    }
  }
} // end constructor

module.exports = VelibWebcom
