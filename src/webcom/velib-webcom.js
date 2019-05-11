
/* eslint-disable comma-dangle */
const Webcom = require('./webcom-custom.js')
const WebComSecret = require('./webcom-secret.js')

function VelibWebcom () {
  const ref = new Webcom('https://io.datasync.orange.com/base/my-velib')
  return {
    // login and return the ref to the base ref
    auth: () => ref.auth(WebComSecret).then(() => ref),

  } // end returned object
} // end constructor

module.exports = VelibWebcom
