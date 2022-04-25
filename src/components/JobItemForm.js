import m from 'mithril'

export default function() {
  
  // let itemsClone

  // function oninit({ attrs: { job, itemIndex } }) {
  //   itemsClone = [ ...job.get('items') ]
  // }

  function onremove({ attrs: { whenDone }}) {
    console.log('removing job item form, calling whenDone attr')
    // job.set('items', itemsClone)
    whenDone()
  }

  function view({ attrs: { item, close, onEdit } }) {
    
    // function handleInput(e) {
    //   job.set('items', [
    //     { qty: 69, description: 'Test'}
    //   ])
    // }

    // const item = itemsClone[itemIndex]

    return m('.ui active modal', [
      m('.header', 'Job Item'),
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
        m('.ui button', { onclick: () => close(item) }, 'Save')
      ])
    ]);
  }

  return {
    // oninit,
    onremove,
    view,
  }

}