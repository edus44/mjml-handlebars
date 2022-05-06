'use strict'

const handlebars = require('handlebars')
const { withI18n } = require('./i18n')
const {resolve} = require('path')

const root = process.cwd()

function generateEmail(templateName, vars, language) {
  const templateHtml = require(resolve(root,`emails/output/${templateName}.html.js`))
  const templateText = require(resolve(root,`emails/output/${templateName}.txt.js`))
  const messages = require(resolve(root,`emails/output/${templateName}.i18n.json`))
  vars.year = new Date().getFullYear()
  const context = withI18n(vars, messages, language)
  return {
    html: handlebars.template(templateHtml)(context),
    text: handlebars.template(templateText)(context),
  }
}

module.exports = { generateEmail }
