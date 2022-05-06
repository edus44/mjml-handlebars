import { generateEmail } from 'mjml-handlebars'

console.log(
  generateEmail(
    'welcome',
    {
      email: 'jaime2@gmail.com',
      items: [{ name: 'item1' }, { name: 'item2' }, { name: 'item3' }],
      showButton: true,
      disclaimer: 'This is the disclaimer',
    },
    'es',
  ),
)
