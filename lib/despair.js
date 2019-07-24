let cheerio = require('cheerio')
let got = require('got')
let fs = require('fs')

function Despair () { }
module.exports = new Despair()

/**
 * Removes duplicate elements in array.
 */
Despair.prototype.distinct = function (arr) {
  if (!arr) return null
  return arr.filter((x, i, a) => a.indexOf(x) === i)
}

/**
 * Format milliseconds into H:M:S optimized version.
 */
Despair.prototype.hms = function (ms) {
  if (!ms) return null
  let t = new Date(ms).toISOString().substr(11, 8).split(':')
  let h = Math.floor(ms / 1000 / 60 / 60).toString()
  if (h > 23) t[0] = h
  while (t.length > 2 && t[0] === '00' && t[1].startsWith('0')) {
    t.shift()
  }
  if (t.length > 2 && t[0] === '00') t.shift()
  if (t[0].startsWith('0')) t[0] = t[0].substr(1)
  return t.join(':')
}

/**
 * Match items in an array of objects by query (sorted).
 */
Despair.prototype.match = function (arr, p, q) {
  if (!q || !q.trim()) return null
  q = q.toLowerCase().trim()
  return arr
    .filter(x => `${x[p]}`.toLowerCase().indexOf(q) !== -1)
    .map(x => {
      let i = `${x[p]}`.toLowerCase()
      let s = 0
      s += i === q ? 500 : 0 // prefer exact match
      s += i.startsWith(q) ? 50 : 0 // prefer match beginning with query
      s -= i.indexOf(q) // prefer query near beginning of match
      s -= i.length // prefer shorter matches
      x.score = s
      return x
    })
    .sort((a, b) => b.score - a.score)
}

/**
 * Shuffles array in place.
 */
Despair.prototype.shuffle = function (arr) {
  if (!arr) return null
  let j, x, i
  let a = arr.slice()
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

/**
 * Waits an amount of milliseconds.
 */
Despair.prototype.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Formats a string using {n}
 */
Despair.prototype.format = (str, ...args) => str.replace(/{(\d+)}/g, (m, n) => typeof args[n] !== 'undefined' ? args[n] : m)

/**
 * Formats a string using color flags.
 *
 * 'This is a {r|red color} and this is a {B|blue background}'
 *
 * 'Both combined {rB|look like this}!'
 */
Despair.prototype.color = function (str) {
  let codes = [
    { name: ['d', 'dark', 'black'], fg: 30, bg: 40 },
    { name: ['r', 'red'], fg: 31, bg: 41 },
    { name: ['g', 'green'], fg: 32, bg: 42 },
    { name: ['y', 'yellow'], fg: 33, bg: 43 },
    { name: ['b', 'blue'], fg: 34, bg: 44 },
    { name: ['m', 'magenta', 'purple'], fg: 35, bg: 45 },
    { name: ['t', 'teal'], fg: 36, bg: 46 },
    { name: ['w', 'white'], fg: 37, bg: 47 },
    { name: ['s', 'stone', 'gray', 'grey'], fg: 90, bg: 100 },
    { name: ['f', 'fire'], fg: 91, bg: 101 },
    { name: ['l', 'lime'], fg: 92, bg: 102 },
    { name: ['h', 'honey'], fg: 93, bg: 103 },
    { name: ['a', 'azure'], fg: 94, bg: 104 },
    { name: ['p', 'pink'], fg: 95, bg: 105 },
    { name: ['c', 'cyan'], fg: 96, bg: 106 },
    { name: ['i', 'invert'], fg: 7, bg: 7 },
    { name: ['u', 'underline'], fg: 4, bg: 4 }
  ]
  return str.replace(/{([a-zA-Z]+)\|(.*?)(?<=[^\\])}/g, (m, a, b) => {
    a = a.split('')
    let dibs = []
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < codes.length; j++) {
        if (codes[j].name.includes(a[i].toLowerCase())) {
          if (codes[j].name.includes(a[i])) {
            dibs.push(codes[j].fg)
          } else dibs.push(codes[j].bg)
        }
      }
    }
    b = b.replace(/\\}/g, '}') // poor workaround
    if (dibs.length) {
      let str = ''
      dibs.forEach(x => { str += `\x1b[${x}m` })
      str += `${b}\x1b[0m`
      return str
    } else return b
  })
}

/**
 * Checks if a given string is an URL.
 */
Despair.prototype.isURL = function (str, lazy) {
  let regex = lazy
    ? /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    : /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
  let match = str.match(regex)
  if (match) return true
  else return false
}

/**
 * Escapes RegExp in string.
 */
Despair.prototype.escapeRegex = str => str.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')

/**
 * Unescapes RegExp in string.
 */
Despair.prototype.unescapeRegex = str => str.replace(/\\([\\^$*+?.()|[\]{}])/g, '$1')

/**
 * Syncronously writes data to a file, replacing the file if it already exists or creates a directory if filename ends with a slash.
 */
Despair.prototype.write = function (path, data, options) {
  if (path.endsWith('/') || path.endsWith('\\')) {
    return fs.mkdirSync(path, options)
  } else {
    return fs.writeFileSync(path, data, options)
  }
}

/**
 * Syncronously reads the entire contents of a file or gets files in a directory.
 */
Despair.prototype.read = function (path, options) {
  if (this.stat(path).isDirectory()) {
    return fs.readdirSync(path, options)
  } else {
    return fs.readFileSync(path, options)
  }
}

/**
 * Syncronously tests whether or not the given path exists by checking with the file system.
 */
Despair.prototype.exists = path => fs.existsSync(path)

/**
 * Gets a file status. Does not reference symbolic links.
 */
Despair.prototype.stat = path => fs.lstatSync(path)

/**
 * Requests http or https with extended options.
 */
Despair.prototype.fetch = (url, options) => got(url, options)

/**
 * Loads HTML into cheerio and uses it similar to JQuery.
 */
Despair.prototype.html = (html, options) => cheerio.load(html, options)

/**
 * Gets a random integer between min and max. One argument can be given aswell.
 */
Despair.prototype.rnd = function (min, max) {
  if (!min && !max) return Math.random()
  if (!min && max) min = 0
  if (min && !max) {
    min = 0
    max = min
  }
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
}

/**
 * Encodes a string using given type.
 */
Despair.prototype.encode = function (str, type) {
  if (type === 'base64') return Buffer.from(str).toString('base64')
  if (type === 'uri') return encodeURI(str)
  if (type === 'uric') return encodeURIComponent(str)
  if (type === 'html') {
    // eslint-disable-next-line quote-props
    let t = { '¢': 'cent', '£': 'pound', '¥': 'yen', '€': 'euro', '©': 'copy', '®': 'reg', '<': 'lt', '>': 'gt', '"': 'quot', '&': 'amp', '\'': '#39' }
    return str.replace(/[¢£¥€©®<>"&']/g, m => '&' + t[m] + ';')
  }
  return str
}

/**
 * Decodes a string using given type.
 */
Despair.prototype.decode = function (str, type) {
  if (type === 'base64') return Buffer.from(str, 'base64').toString('ascii')
  if (type === 'uri') return decodeURI(str)
  if (type === 'uric') return decodeURIComponent(str)
  if (type === 'html') {
    let t = { nbsp: ' ', cent: '¢', pound: '£', yen: '¥', euro: '€', copy: '©', reg: '®', lt: '<', gt: '>', quot: '"', amp: '&', apos: '\'' }
    return str.replace(/&([^;]+);/g, (m, e) => {
      if (e in t) return t[e]
      let match = e.match(/^#x([\da-fA-F]+)$/)
      if (match) return String.fromCharCode(parseInt(match[1], 16))
      match = e.match(/^#(\d+)$/)
      if (match) return String.fromCharCode(~~match[1])
      return m
    })
  }
  return str
}

/**
 * Tests if function output or variable equals result. Prints Log.
 */
Despair.prototype.test = function (fn, any, full) {
  let res = typeof fn === 'function' ? fn() : fn
  let err = (function () { try { throw Error('') } catch (err) { return err } })()
  let stack = err.stack.split('\n')[3]
  stack = stack.substr(stack.indexOf('('))
  stack = '(' + stack.substring(stack.lastIndexOf('\\') + 1, stack.indexOf(')') + 1) + ' '
  let test = ''
  let a = res
  let b = any
  let check = false
  if (a.constructor === b.constructor) {
    if (a.constructor === Object || a.constructor === Array) {
      a = JSON.stringify(a)
      b = JSON.stringify(b)
    }
    check = a === b
  }
  a = a.toString().replace(/}/g, '\\}')
  b = b.toString().replace(/}/g, '\\}')
  if (!full) {
    let limit = 25
    if (a.length < limit) while (a.length < limit) a += ' '
    else if (a.length > limit) a = `${a}`.substr(0, limit - 3) + '...'
    if (b.length < limit) while (b.length < limit) b += ' '
    else if (b.length > limit) b = `${b}`.substr(0, limit - 3) + '...'
  }
  if (check) {
    test = this.color(`{g|SUCC ->} {b|${a}} {s|=} {b|${b}}`)
  } else {
    test = this.color(`{r|FAIL ->} {m|${a}} {s|!} {m|${b}}`)
  }
  if (!full) stack = ''
  this.log(this.color(`{y|TEST}: ${stack}${test}`))
  return res === any
}

/**
 * Prints to stdout with newline.
 */
Despair.prototype.log = (...any) => console.log(...any)

/**
 * Prints to stderr with newline.
 */
Despair.prototype.err = (...any) => console.error(...any)

/**
 * Executes function and then returns given type.
 */
Despair.prototype.die = function (fn, type) {
  if (typeof fn === 'function') fn()
  return type || true
}
