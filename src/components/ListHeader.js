import m from 'mithril'

export default {
  view({ attrs }) {
    const { store, title } = attrs
    return m('.ui secondary menu', [
      m('.header item', title),
      m('.item', [
        store.lastLoadedAt ? 
          `${store.count} ${store.count > 1 ? 'items' : 'item'}`
          : 'Not loaded',
      ]),
      m('.right menu', [
        m('.link icon item',
          m('i.refresh icon', {
            onclick: () => store.load(),
            class: store.isLoading ? 'loading' : '',
          })
        )
      ])
    ])
  }
}