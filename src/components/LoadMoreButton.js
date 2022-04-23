import m from 'mithril'

export default {
  view({ attrs }) {
    const { store } = attrs
    if (!store.hasMore) return null
    return m('button.ui fluid button', {
      onclick: () => store.loadMore()
    }, store.isLoading
        ? 'Loading...' 
        : `Load more (${store.count - store.items.length} remaining)`)
  }
}