'use strict'

const handlebars = require('handlebars')
const { withI18n } = require('./helpers')
const { resolve } = require('path')

const defaultRoot = resolve(process.cwd() , 'emails')

function generateEmail(templateName, vars, language, fallbackLanguage) {

  const root = process.env.MJML_HANDLEBARS_ROOT || defaultRoot

  const asset = resolve(root, `output/${templateName}/${templateName}`)
  const templateHtml = require(asset + '.html.cjs')
  const templateText = require(asset + '.txt.cjs')
  const templateSubject = require(asset + '.subject.txt.cjs')
  const messages = require(asset + '.i18n.json')
  vars.year = new Date().getFullYear()
  const context = withI18n(vars, messages, language, fallbackLanguage)
  return {
    html: handlebars.template(templateHtml)(context),
    text: handlebars.template(templateText)(context),
    subject: handlebars.template(templateSubject)(context),
  }
}

module.exports = { generateEmail }
