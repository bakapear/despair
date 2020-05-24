let m = { 'https:': require('https'), 'http:': require('http') }
let types = {
  json: 'application/json',
  form: 'application/x-www-form-urlencoded'
}

/**
  The function of make request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
function Despair(url = '', opts = {}) {
  if (!opts.method) opts.method = 'GET'
  if (!opts.headers) opts.headers = {}
  if (!opts.redirects) opts.redirects = 5
  if (opts.type) opts.headers['Content-Type'] = types[opts.type]
  url = new URL(url, opts.base)
  if (opts.query) url.search = new URLSearchParams(opts.query)
  let error = false
  let out = new Promise((resolve, reject) => {
    let req = m[url.protocol].request(url, opts, (res, data = '') => {
      if (res.statusCode >= 400) error = true
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
        if (error) reject(new HTTPError(res))
        else resolve(res)
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

/**
  The function of make GET request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.get = (url, opts) => Despair(url, { ...opts, method: 'GET' })
/**
  The function of make PUT request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.put = (url, opts) => Despair(url, { ...opts, method: 'PUT' })
/**
  The function of make POST request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.post = (url, opts) => Despair(url, { ...opts, method: 'POST' })
/**
  The function of make GET request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.head = (url, opts) => Despair(url, { ...opts, method: 'HEAD' })
/**
  The function of make PATCH request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.patch = (url, opts) => Despair(url, { ...opts, method: 'PATCH' })
/**
  The function of make TRACE request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.trace = (url, opts) => Despair(url, { ...opts, method: 'TRACE' })
/**
  The function of make DELETE request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.delete = (url, opts) => Despair(url, { ...opts, method: 'DELETE' })
/**
  The function of make OPTIONS request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.options = (url, opts) => Despair(url, { ...opts, method: 'OPTIONS' })
/**
  The function of make CONNECT request
  @param {String} url - URL of the request
  @param {Object} opts - Options of the request
*/
Despair.connect = (url, opts) => Despair(url, { ...opts, method: 'CONNECT' })

class HTTPError extends Error {
  constructor (res) {
    super(res.statusMessage)
    this.name = this.constructor.name
    this.code = res.statusCode
    this.message = res.statusMessage
    this.body = res.body
  }
}

module.exports = Despair
