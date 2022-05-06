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

> Run `emails:dev` to watch for changes and a live server preview

To generate the final email, the precompiled version of the handlebars email will be used to improve performance. Example:

```typescript
import { generateEmail } from 'mjml-handlebars'

const { html, text } = generateEmail(
  'welcome',
  {
    email: 'john@gmail.com',
    items: [{ name: 'item1' }, { name: 'item2' }, { name: 'item3' }],
    showButton: true,
    disclaimer: 'This is the disclaimer',
  },
  'en',
)
```

## MJML templates powerups

There are 3 required comment blocks:

- **text** (_plain text_): contains the email in text mode (with same handlebars support as the mjml part)
- **i18n** (_YAML_): languages and messages for translations 
- **vars** (_YAML_): sample variables for previewing

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
        <mj-text mj-class="title" css-class="tal">
          <i18n key="welcome">{{__ "greetings" email=email}}</i18n>
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
        {{#if disclaimer}}
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

<!-- vars
email: jaime2@gmail.com
items:
  - name: item1
  - name: item2
  - name: item3
showButton: true
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
