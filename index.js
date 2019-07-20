function Despair () { }
module.exports = new Despair()

/**
 * Removes duplicate elements in array.
 */
Despair.prototype.distinct = arr => {
  if (!arr) return null
  return arr.filter((x, i, a) => a.indexOf(x) === i)
}

/**
 * Format milliseconds into H:M:S optimized version.
 */
Despair.prototype.hms = ms => {
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
Despair.prototype.match = (arr, p, q) => {
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
Despair.prototype.shuffle = arr => {
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
 * da = dark | RE = red BG | bg = bright green
 *
 */
Despair.prototype.color = (flags, str) => {
  flags = flags.match(/.{1,2}/g)
  let colors = { bo: 1, un: 4, in: 7 }
  let codes = ['da', 're', 'gr', 'ye', 'bl', 'ma', 'cy', 'wh', 'bd', 'br', 'bg', 'by', 'bb', 'bm', 'bc', 'bw']
  codes.forEach((x, i) => {
    colors[x] = i < 8 ? i + 30 : i <= 15 ? i + 82 : 0
    colors[x.toUpperCase()] = i < 8 ? i + 40 : i <= 15 ? i + 92 : 0
  })
  flags = flags.map(x => colors[x] ? `\x1b[${colors[x]}m` : '').join('')
  return flags + str + '\x1b[0m'
}

/**
 * Checks if a given string is an URL.
 */
Despair.prototype.isURL = (str, lazy) => {
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
