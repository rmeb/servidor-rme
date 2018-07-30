const {success, fail, error} = require('../utils/Reply')
const {echo} = require('../lib/SignService')

function checkPassword(req, res) {
  let {run, password} = req.body
  console.log('[ESign.checkPassword]', run)

  if (!run || run.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }
  if (!password || password.length === 0) {
    return fail(res, 'Parameter missing or invalid')
  }

  echo(run, password).then(result => {
    if (result.code === 'OK') {
      success(res, 'success')
    } else {
      fail(res, result.message)
    }
  }).catch(e => {
    console.log('[ESign.checkPassword]', e)
    error(res, e.message)
  })
}

module.exports = {
  checkPassword
}
