import { expect, test } from 'vitest'
import { generateEmail } from '..'
import { compile } from '../compiler/compiler'
import { resolve } from 'path'
import fs from 'fs-extra'
import glob from 'glob'

const basicFolder = resolve(__dirname, 'basic')
process.env.MJML_HANDLEBARS_ROOT = basicFolder

test('compile', async () => {
  await fs.emptyDir(resolve(basicFolder, 'output'))
  await fs.emptyDir(resolve(basicFolder, 'preview'))

  compile(basicFolder)

  const files = glob.sync(basicFolder.replace(__dirname, 'tests') + '/{output,preview}/**/*', {
    nodir: true,
  })

  expect(files).toMatchSnapshot()

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    expect(content).toMatchSnapshot()
  }
})

test('generateEmail', () => {
  process.env.MJML_HANDLEBARS_ROOT = basicFolder
  const result = generateEmail('welcome', {
    email: 'john@gmail.com',
    items: [{ name: 'item1' }, { name: 'item2' }, { name: 'item3' }],
    showButton: true,
    link: 'http://example.com'
  },'en')

  expect(result).toMatchSnapshot()
})


test('generateEmail with fallbackLanguage', () => {
  const vars = {
    email: 'john@gmail.com',
    items: [{ name: 'item1' }, { name: 'item2' }, { name: 'item3' }],
    showButton: true,
    link: 'http://example.com'
  }
  const result = generateEmail('welcome', vars,'es')
  const resultWith = generateEmail('welcome', vars,'es','en')

  expect(result).toMatchSnapshot()
  expect(resultWith).toMatchSnapshot()

  expect(result.html).toContain('goTo')
  expect(resultWith.html).toContain(`go to <a href="${vars.link}">${vars.link}</a>`)
  expect(result.html).not.toBe(resultWith.html)
})
