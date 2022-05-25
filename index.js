'use strict'

const handlebars = require('handlebars')
const { withI18n } = require('./i18n')
const { resolve } = require('path')

const root = process.env.MJML_HANDLEBARS_ROOT || resolve(process.cwd() , 'emails')

function generateEmail(templateName, vars, language) {
  const asset = resolve(root, `output/${templateName}/${templateName}`)
  const templateHtml = require(asset + '.html.js')
  const templateText = require(asset + '.txt.js')
  const templateSubject = require(asset + '.subject.txt.js')
  const messages = require(asset + '.i18n.json')
  vars.year = new Date().getFullYear()
  const context = withI18n(vars, messages, language)
  return {
    html: handlebars.template(templateHtml)(context),
    text: handlebars.template(templateText)(context),
    subject: handlebars.template(templateSubject)(context),
  }
}

module.exports = { generateEmail }
