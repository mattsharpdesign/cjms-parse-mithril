import m from 'mithril'
import ListHeader from './ListHeader'
import { dispatchMethodStore as store } from '../stores'

export default function() {

  function oninit() {
    if (!store.lastLoadedAt && !store.isLoading) store.load()
  }

  function view({ attrs: { onSelect }}) {
    return m('[', [
      m(ListHeader, { store }),
      m('.ui divided link items', store.items.map(dispatchMethod => {
        return m(ListItem, { dispatchMethod, onSelect })
      }))
    ])
  }

  return {
    oninit,
    view,
  }
}

const ListItem = {
  view({ attrs: { dispatchMethod, onSelect }}) {
    return m('.item', {
      onclick: () => onSelect(dispatchMethod)
    }, dispatchMethod.get('description'))
  }
}