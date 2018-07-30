const fs = require('fs')
const fetch = require('node-fetch')
const parseString = require('xml2js').parseString;

const MINIMUM_XML = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48Uk1FPjwvUk1FPg=='
const WS = 'http://200.111.181.78/SignServerEsign/WSIntercambiaDocSoap'
const TEMPLATE = fs.readFileSync('./SoapTemplate.xml').toString()

function sign(xml, credentials) {
  let run = credentials.run.replace('-', '').toUpperCase()
  let data = TEMPLATE.replace('{DOCUMENT}', Buffer.from(xml).toString('base64'))
  data = data.replace('{RUN}', run)
  data = data.replace('{RUN}', run)
  data = data.replace('{CLAVE}', credentials.clave)

  return fetch(WS, {
    method: 'POST',
    headers: {
      'Content-Type':  'text/xml;charset=UTF-8'
    },
    body: data
  }).then(r => r.text()).then(parseXmlResponse)
}

function echo(run, password) {
  run = run.replace('-', '').toUpperCase()
  let data = TEMPLATE.replace('{DOCUMENT}', MINIMUM_XML)
  data = data.replace('{RUN}', run)
  data = data.replace('{RUN}', run)
  data = data.replace('{CLAVE}', password)
  return fetch(WS, {
    method: 'POST',
    headers: {
      'Content-Type':  'text/xml;charset=UTF-8'
    },
    body: data
  }).then(r => r.text()).then(parseXmlResponse)
}

function parseXmlResponse(txt) {
  return new Promise((resolve, reject) => {
    parseString(txt, (err, result) => {
      if (err) return reject(err)
      let xmlResult = null
      try {
        xmlResult = result['soap:Envelope']['soap:Body'][0]['ns2:intercambiaDocResponse'][0]['intercambiaDoc'][0]['IntercambiaDocResult'][0]
        if (xmlResult.Estado[0] === 'OK') {
          let signedXml = Buffer.from(xmlResult.Documento[0], 'base64').toString()
          return resolve({
            code: 'OK',
            document: signedXml
          })
        }
        resolve({
          code: xmlResult.Estado[0],
          message: '[sign] ' + xmlResult.Comentarios[0]
        })
      } catch(e) {
        reject(e)
      }
    })
  })
}

module.exports = {
  sign, echo
}
