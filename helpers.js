'use strict'

const { get } = require('lodash')
const handlebars = require('handlebars')

// Translate
handlebars.registerHelper('__', (key, options) => {
  const i18n = options.data.root._i18n
  let value = get(i18n.messages[i18n.language], key)
  if (value === undefined && i18n.fallbackLanguage)
    value = get(i18n.messages[i18n.fallbackLanguage], key)

  if (value === undefined) return key

  // Interpolation
  for (const key in options.hash) {
    value = value.replaceAll(`{{${key}}}`, options.hash[key])
  }
  return value
})

// Logical operators (https://stackoverflow.com/a/31632215)
handlebars.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
    return Array.prototype.every.call(arguments, Boolean)
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean)
  },
})

function withI18n(vars, messages, language, fallbackLanguage) {
  return {
    ...vars,
    _i18n: { language, messages, fallbackLanguage },
  }
}

module.exports = {
  withI18n,
}
