# mjml-handlebars

Use MJML to pregenerate your emails, then Handlebars with i18n support to generate your final emails (html and text).

BONUS: Live preview your templates with sample variables for all your languages.

## Installation

```bash
npm install mjml-handlebars
yarn add mjml-handlebars
```

Add this scripts to your package.json

```
"emails": "mjml-handlebars",
```

Use this if you are using custom root folder and dotenv
```
"emails": "node -r dotenv/config node_modules/.bin/mjml-handlebars",
```

### For live preview support:

```
npm install -D npm-run-all @compodoc/live-server nodemon
yarn add -D npm-run-all @compodoc/live-server nodemon
```

Additional package.json scripts:

```
"emails:dev": "run-p emails:watch emails:preview",
"emails:watch": "nodemon --exec 'npm run emails' -e mjml -i emails/output",
"emails:preview": "live-server -q emails/preview"
```

Add `emails/preview` to your `.gitignore`

## Usage

Generate an `emails/templates` folder, add your mjml templates there. If your run the `emails` script, the emails/output and emails/preview folders will be generated with the compiled assets.

By default it uses `{cwd}/emails` as root folder, can be changed with `MJML_HANDLEBARS_ROOT` environment variable.

> Run `emails:dev` to watch for changes and a live server preview

To generate the final email, the precompiled version of the handlebars email will be used to improve performance. Example:

```typescript
import { generateEmail } from 'mjml-handlebars'

const { html, text, subject } = generateEmail(
  'welcome',
  {
    email: 'john@gmail.com',
    items: [{ name: 'item1' }, { name: 'item2' }, { name: 'item3' }],
    showButton: true,
    disclaimer: 'This is the disclaimer',
  },
  'de', // Language
  'en' // Optional fallback Language
)
```

## MJML templates powerups

There are 4 required comment blocks (only available for main templates, not partials):

- **text** (_plain text_): contains the email in text mode (with same handlebars support as the mjml part)
- **subject** (_plain text_): contains the email subject (with same handlebars support as the mjml part)
- **i18n** (_YAML_): languages and messages for translations 
- **vars** (_YAML_): sample variables for previewing

_There is support for logical operators, taken from [here](https://stackoverflow.com/a/31632215)_

Example template:

```handlebars
<mjml>
  <mj-head>
    <mj-include path="./partials/head.mjml" />
  </mj-head>

  <mj-body>
    <mj-include path="./partials/header.mjml" />
    <mj-section mj-class="main">
      <mj-column>
        <mj-text mj-class="title">
          {{__ "greetings" email=email}}
        </mj-text>
        <mj-text>
          {{__ "welcome"}}
        </mj-text>
        <mj-raw>{{#if showButton}}</mj-raw>
        <mj-button href="#">
          Go to my account 
        </mj-button>
        <mj-raw>{{/if}}</mj-raw>
        <mj-raw>{{#each items}}</mj-raw>
        <mj-text>Item: <b>{{this.name}}</b></mj-text>
        <mj-raw>{{/each}}</mj-raw>

        <mj-text>
        {{#if (ne type 'show') }}
        {{disclaimer}}
        {{else}}
        no disclaimer
        {{/if}}
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-include path="./partials/footer.mjml" />
  </mj-body>
</mjml>

<!-- text
{{__ "greetings" email=email}}

{{__ "welcome"}}
-->

<!-- subject
{{__ "greetings" email=email}}
-->

<!-- vars
email: john@gmail.com 
items: 
  - name: item1
  - name: item2
  - name: item3
showButton: true
type: 'show'
# disclaimer: 'This is the disclaimer'
-->

<!-- i18n
en:
  greetings: hello {{email}}
  welcome: Welcome to my company
es:
  greetings: hola {{email}}
  welcome: Bienvenido a mi empresa
-->
```

See a working example project at `/example`.

## License

MIT
