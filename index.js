let m = { 'https:': require('https'), 'http:': require('http') }
let types = {
  json: 'application/json',
  form: 'application/x-www-form-urlencoded'
}

function Despair (url = '', opts = {}) {
  if (!opts.method) opts.method = 'GET'
  if (!opts.headers) opts.headers = {}
  if (!opts.redirects) opts.redirects = 5
  if (opts.type) opts.headers['Content-Type'] = types[opts.type]
  url = new URL(url, opts.base)
  if (opts.query) url.search = new URLSearchParams(opts.query)
  let out = new Promise((resolve, reject) => {
    let req = m[url.protocol].request(url, opts, (res, data = '') => {
      if (res.statusCode >= 400) reject(new HTTPError(res.statusCode))
      if (res.statusCode >= 300 && res.statusCode < 400) {
        if (opts.redirects-- > 0 || opts.redirects === -1) {
          if (res.statusCode === 303 && opts.method !== 'GET' && opts.method !== 'HEAD') opts.method = 'GET'
          delete opts.query
          delete opts.base
          resolve(Despair(res.headers.location, opts))
          return res.destroy()
        }
      }
      res.setEncoding(opts.encoding)
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        res.body = data
        resolve(res)
      })
    })
    req.on('error', e => reject(e))
    if (opts.data) {
      if (opts.data.constructor === Object) opts.data = JSON.stringify(opts.data)
      req.write(opts.data)
    }
    req.end()
  })
  out.json = () => Promise.resolve(out).then(p => JSON.parse(p.body))
  out.text = () => Promise.resolve(out).then(p => p.body)
  return out
}

Despair.get = (url, opts) => Despair(url, { ...opts, method: 'GET' })
Despair.put = (url, opts) => Despair(url, { ...opts, method: 'PUT' })
Despair.post = (url, opts) => Despair(url, { ...opts, method: 'POST' })
Despair.head = (url, opts) => Despair(url, { ...opts, method: 'HEAD' })
Despair.patch = (url, opts) => Despair(url, { ...opts, method: 'PATCH' })
Despair.trace = (url, opts) => Despair(url, { ...opts, method: 'TRACE' })
Despair.delete = (url, opts) => Despair(url, { ...opts, method: 'DELETE' })
Despair.options = (url, opts) => Despair(url, { ...opts, method: 'OPTIONS' })
Despair.connect = (url, opts) => Despair(url, { ...opts, method: 'CONNECT' })

class HTTPError extends Error {
  constructor (msg) {
    super('Response code ' + msg)
    this.name = this.constructor.name
    this.status = msg
  }
}

module.exports = Despair
