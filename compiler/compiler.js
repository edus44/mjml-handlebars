'use strict'

const chalk = require('chalk')
console.log(chalk.blue('START'))
const mjml2html = require('mjml')
const glob = require('glob')
const { resolve, basename } = require('path')
const fs = require('fs-extra')
const handlebars = require('handlebars')
const { withI18n } = require('../helpers')
const { extractComment } = require('./utils')

function compile(root) {
  // Preview folder, cleaned
  const previewFolder = resolve(root, 'preview')
  fs.emptyDirSync(previewFolder)

  // Output folder, cleaned
  const outputFolder = resolve(root, 'output')
  fs.emptyDirSync(outputFolder)

  // Find al mjml files
  const templatesFolder = resolve(root, 'templates')

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
    const subjectTemplate = extractComment(content, 'subject')
    let vars = extractComment(content, 'vars', true)

    if (!messages || typeof messages !== 'object')
      throw new Error('i18n block nees to be a valid YAML object of objects')
    if (vars == undefined) vars = {}
    if (typeof vars !== 'object') throw new Error('vars block nees to be a valid YAML object')

    // Compile MJML
    const mjmlResult = mjml2html(content, { filePath: templatesFolder })
    if (mjmlResult.errors.length) console.error('   error: ', mjmlResult.errors)

    // Write templates
    const assetName = resolve(outputFolder, name, name)
    fs.outputFileSync(assetName + '.html', mjmlResult.html)
    fs.outputFileSync(assetName + '.txt', textTemplate)
    fs.outputFileSync(assetName + '.subject.txt', subjectTemplate)
    fs.outputJSONSync(assetName + '.i18n.json', messages, { spaces: 2 })
    fs.outputJSONSync(assetName + '.vars.json', vars, { spaces: 2 })
    fs.outputFileSync(
      assetName + '.html.cjs',
      'module.exports=' + handlebars.precompile(mjmlResult.html),
    )
    fs.outputFileSync(
      assetName + '.txt.cjs',
      'module.exports=' + handlebars.precompile(textTemplate),
    )
    fs.outputFileSync(
      assetName + '.subject.txt.cjs',
      'module.exports=' + handlebars.precompile(subjectTemplate),
    )

    // Compile Handlebars
    const hbHtmlTemplate = handlebars.compile(mjmlResult.html)
    const hbTextTemplate = handlebars.compile(textTemplate)
    const hbSubjectTemplate = handlebars.compile(subjectTemplate)

    // Default vars
    vars.year = new Date().getFullYear()

    // Iterate languages
    const languages = Object.keys(messages)
    for (const language of languages) {
      process.stdout.write(' ' + chalk.gray(language))

      // Execute template with language
      const context = withI18n(vars, messages, language)
      const html = hbHtmlTemplate(context)
      const text = hbTextTemplate(context)
      const subject = hbSubjectTemplate(context)

      // Write preview HTML
      fs.outputFileSync(
        resolve(previewFolder, 'by-language', language, `${name}-${language}.html`),
        html,
      )
      fs.outputFileSync(
        resolve(previewFolder, 'by-template', name, `${name}-${language}.html`),
        html,
      )

      // Write preview TEXT
      fs.outputFileSync(
        resolve(previewFolder, 'by-language', language, `${name}-${language}.txt`),
        text,
      )
      fs.outputFileSync(
        resolve(previewFolder, 'by-template', name, `${name}-${language}.txt`),
        text,
      )

      // Write preview SUBJECT
      fs.outputFileSync(
        resolve(previewFolder, 'by-language', language, `${name}-${language}.subject.txt`),
        subject,
      )
      fs.outputFileSync(
        resolve(previewFolder, 'by-template', name, `${name}-${language}.subject.txt`),
        subject,
      )
    }
  }

  console.log(chalk.blue('\nDONE'))
}

module.exports = { compile }
