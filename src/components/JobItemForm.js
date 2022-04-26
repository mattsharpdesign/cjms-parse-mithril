import m from 'mithril'

export default function() {
  
  let clone
  
  return {

    oninit({ attrs: { item } }) {
      clone = JSON.parse(JSON.stringify(item))
    },

    view({ attrs: { item, onEdit, close } }) {

      return m('.ui small active modal', [
        m('.header', 'Edit Item'),
        m('.scrolling content', [
          m('.ui form', [
            m('.field', [
              m('label', 'Description'),
              m('input[type=text]', {
                value: item.description,
                oninput: e => item.description = e.target.value,
                // oninput: e => handleInput(e)
              }),
            ]),
          ]),
        ]),
        m('.actions', [
          m('.ui small button', { 
            onclick: () => {
              onEdit(item, clone)
              close()
            }
          }, 'Done')
        ])
      ]);
    }
  }
}