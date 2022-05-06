'use strict'

const { get } = require('lodash')
const handlebars = require('handlebars')

handlebars.registerHelper('__', (key, options) => {
  const i18n = options.data.root._i18n
  let value = get(i18n.messages[i18n.language], key)
  // Interpolation
  for (const key in options.hash) {
    value = value.replace(`{{${key}}}`, options.hash[key])
  }
  return value
})

function withI18n(vars, messages, language) {
  return {
    ...vars,
    _i18n: { language, messages },
  }
}

module.exports = {
  withI18n,
}
