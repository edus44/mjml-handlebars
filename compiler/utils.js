'use strict'

const { parse } = require('yaml')

function extractComment(content, key, isYaml) {
  try{
  const [, value] = content.match(new RegExp(`<!-- ${key}([\\s\\S]*?)-->`)) || []
  return isYaml
    ? parse(value, {
        strict: true,
      })
    : value.trim()
  }catch(err){
    throw new Error(`Error parsing block ${key}`)
  }
}

module.exports = { extractComment }
