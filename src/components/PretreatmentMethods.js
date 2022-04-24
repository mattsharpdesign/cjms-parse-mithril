import m from 'mithril'
import ListHeader from './ListHeader'
import { pretreatmentMethodStore as store } from '../stores'

export default function() {

  function oninit() {
    if (!store.lastLoadedAt && !store.isLoading) store.load()
  }

  function view({ attrs: { onSelect }}) {
    return m('[', [
      m(ListHeader, { store }),
      m('.ui divided link items', store.items.map(pretreatmentMethod => {
        return m(ListItem, { pretreatmentMethod, onSelect })
      }))
    ])
  }

  return {
    oninit,
    view,
  }
}

const ListItem = {
  view({ attrs: { pretreatmentMethod, onSelect }}) {
    return m('.item', {
      onclick: () => onSelect(pretreatmentMethod)
    }, pretreatmentMethod.get('description'))
  }
}