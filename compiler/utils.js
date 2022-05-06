'use strict'

const { parse } = require('yaml')

function extractComment(content, key, isYaml) {
  const [, value] = content.match(new RegExp(`<!-- ${key}([^>]*)-->`)) || []
  return isYaml
    ? parse(value, {
        strict: true,
      })
    : value.trim()
}

module.exports = { extractComment }
