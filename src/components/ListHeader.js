import m from 'mithril'

export default {
  view({ attrs, children }) {
    const { store } = attrs
    return m('.ui menu', [
      m('.item', m(SearchInput, { store })),
      m('.item', [
        store.isLoading ? 
          'Loading...' :
          `${store.count} ${(store.count > 1 || store.count === 0) ? 'items' : 'item'}`
      ]),
      m('.right menu', [
        children,
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

const SearchInput = {
  view({ attrs }) {
    const { store } = attrs
    return m('.ui transparent icon input', {
      class: store.searchString && 'active',
    }, [
      m('input.prompt[type=text][placeholder=Search...]', {
        value: store.searchString,
        oninput: e => store.setSearchString(e.target.value),
      }),
      m('i.link icon', {
        class: store.searchString.length > 0 ? 'cancel' : 'search',
        onclick: () => store.setSearchString('')
      })
    ])
  }
}