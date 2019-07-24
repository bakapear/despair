let dp = require('../lib/despair')

dp.test(
  dp.distinct(['cheese', 'burger', 1, 2, 3, 2, 'cheese']),
  ['cheese', 'burger', 1, 2, 3]
)

dp.test(
  dp.hms(843483250),
  '234:18:03'
)

dp.test(
  dp.match([{ name: 'cheese' }, { name: 'cloth' }, { name: 'cheese cake' }], 'name', 'che'),
  [{ name: 'cheese', score: 44 }, { name: 'cheese cake', score: 39 }]
)

dp.test(
  dp.format('To {0} is also to {0} how to {1}.', 'forget', 'evolve'),
  'To forget is also to forget how to evolve.'
)

dp.test(
  dp.isURL('example.com', true),
  true
)

dp.test(
  dp.escapeRegex('What§*+34)(F4+'),
  'What§\\*\\+34\\)\\(F4\\+'
)

dp.test(
  dp.unescapeRegex('What§\\*\\+34\\)\\(F4\\+'),
  'What§*+34)(F4+'
)

dp.test(
  dp.encode('The ability to think, the ability to continue thinking.', 'base64'),
  'VGhlIGFiaWxpdHkgdG8gdGhpbmssIHRoZSBhYmlsaXR5IHRvIGNvbnRpbnVlIHRoaW5raW5nLg=='
)

dp.test(
  dp.decode('Rm9yZ2V0PyBJZGlvdGljLg==', 'base64'),
  'Forget? Idiotic.'
)

dp.test(
  dp.decode('&lt;html&gt;stuff&lt;/html&gt;', 'html'),
  '<html>stuff</html>'
)
