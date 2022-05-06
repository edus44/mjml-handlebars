'use strict'

const chalk = require('chalk')
console.log(chalk.blue('START'))
const mjml2html = require('mjml')
const glob = require('glob')
const { resolve, basename } = require('path')
const fs = require('fs-extra')
const handlebars = require('handlebars')
const { withI18n } = require('../i18n')
const { extractComment } = require('./utils')

const root = process.cwd()

// Preview folder, cleaned
const previewFolder = resolve(root, 'emails/preview')
fs.emptyDirSync(previewFolder)

// Output folder, cleaned
const outputFolder = resolve(root, 'emails/output')
fs.emptyDirSync(outputFolder)

// Find al mjml files
const templatesFolder = resolve(root, 'emails/templates')

const templateFiles = glob.sync(`${templatesFolder}/*.mjml`)
console.log(chalk.blue(`Found ${chalk.bold(templateFiles.length)} templates`))

for (const templateFile of templateFiles) {
  // Read template file
  const name = basename(templateFile, '.mjml')
  process.stdout.write(chalk.bold.cyanBright(name))

  const content = fs.readFileSync(templateFile, 'utf-8')

  // Extract comment blocks
  const messages = extractComment(content, 'i18n', true)
  const textTemplate = extractComment(content, 'text')
  const vars = extractComment(content, 'vars', true)

  // Default vars
  vars.year = new Date().getFullYear()

  // Compile MJML
  const mjmlResult = mjml2html(content, { filePath: templatesFolder })
  if (mjmlResult.errors.length) console.error('   error: ', mjmlResult.errors)

  // Write templates
  fs.outputFileSync(resolve(outputFolder, `${name}.html`), mjmlResult.html)
  fs.outputFileSync(resolve(outputFolder, `${name}.txt`), textTemplate)
  fs.outputJSONSync(resolve(outputFolder, `${name}.i18n.json`), messages, { spaces: 2 })
  fs.outputJSONSync(resolve(outputFolder, `${name}.vars.json`), messages, { spaces: 2 })
  fs.outputFileSync(
    resolve(outputFolder, `${name}.html.js`),
    'module.exports=' + handlebars.precompile(mjmlResult.html),
  )
  fs.outputFileSync(
    resolve(outputFolder, `${name}.txt.js`),
    'module.exports=' + handlebars.precompile(textTemplate),
  )

  // Compile Handlebars
  const hbHtmlTemplate = handlebars.compile(mjmlResult.html)
  const hbTextTemplate = handlebars.compile(textTemplate)

  // Iterate languages
  const languages = Object.keys(messages)
  for (const language of languages) {
    process.stdout.write(' ' + chalk.gray(language))

    // Execute template with language
    const context = withI18n(vars, messages, language)
    const html = hbHtmlTemplate(context)
    const text = hbTextTemplate(context)

    // Write preview HTML
    fs.outputFileSync(
      resolve(previewFolder, 'by-language', language, `${name}-${language}.html`),
      html,
    )
    fs.outputFileSync(resolve(previewFolder, 'by-template', name, `${name}-${language}.html`), html)

    // Write preview TEXT
    fs.outputFileSync(
      resolve(previewFolder, 'by-language', language, `${name}-${language}.txt`),
      text,
    )
    fs.outputFileSync(resolve(previewFolder, 'by-template', name, `${name}-${language}.txt`), text)
  }
}

console.log(chalk.blue('\nDONE'))
