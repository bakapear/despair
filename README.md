# despair
Lightweight library for making HTTP requests.

```js
let dp = require("despair")

dp('https://google.com/').text().then(console.log)

dp.get('https://httpbin.org/get').json().then(console.log)

dp.post('https://httpbin.org/post', { data: { rawr: true }, type: 'json' }).json().then(console.log)

let res = await dp.get('https://httpbin.org/get')
console.log(res.headers, res.body)

```