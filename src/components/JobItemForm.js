import m from 'mithril'

export default function() {

  function view({ attrs: { item, close }}) {
    return m('.ui active modal', [
      m('.header', 'Job Item'),
      m('.scrolling content', [
        m('.ui form', [
          m('.field', [
            m('label', 'Description'),
            m('input[type=text]', {
              value: item.description,
              oninput: e => item.description = e.target.value,
            }),
          ]),
        ]),
      ]),
      m('.actions', [
        m('.ui button', 'Save')
      ])
    ]);
  }

  return {
    view,
  }

}