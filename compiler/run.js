const { compile } = require('./compiler')
const { resolve } = require('path')

const defaultRoot = resolve(process.cwd(), 'emails')

compile(process.env.MJML_HANDLEBARS_ROOT || defaultRoot)
