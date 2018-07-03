const fs = require('fs')
const fetch = require('node-fetch')
const parseString = require('xml2js').parseString;

const WS = 'http://200.111.181.78/SignServerEsign/WSIntercambiaDocSoap'
const TEMPLATE = fs.readFileSync('./SoapTemplate.xml').toString()

function sign(xml, credentials) {
  let run = credentials.run.replace('-', '')
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
  }).then(r => r.text()).then(txt => {
    return new Promise((resolve, reject) => {
      parseString(txt, (err, result) => {
        if (err) return reject(err)
        let xmlResult = null
        try {
          xmlResult = result['soap:Envelope']['soap:Body'][0]['ns2:intercambiaDocResponse'][0]['intercambiaDoc'][0]['IntercambiaDocResult'][0]
          if (xmlResult.Estado[0] === 'OK') {
            let signedXml = Buffer.from(xmlResult.Documento[0], 'base64').toString()
            resolve(signedXml)
          }
          reject(xmlResult.Estado[0])
        } catch(e) {
          reject(e)
        }
      })
    })
  })
}

module.exports = {
  sign
}