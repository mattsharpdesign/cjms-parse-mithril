import m from 'mithril'
import ListHeader from './ListHeader'
import { powderStore as store } from '../stores'
import LoadMoreButton from './LoadMoreButton'

export default {
  oninit() {
    if (!store.lastLoadedAt) store.load()
  },
  view() {
    return m('[', [
      m(ListHeader, { store, title: 'Powders' }),
      m('table.ui selectable table', [
        m('thead', [
          m('th', 'Manufacturer'),
          m('th', 'Colour'),
          m('th', 'Code'),
          m('th', 'Price per kg'),
          m('th', 'Last stock take'),
        ]),
        m('tbody', store.items.map(powder => m(TableRow, { powder })))
      ]),
      m(LoadMoreButton, { store })
    ])
  }
}

const TableRow = {
  view({ attrs }) {
    const { powder } = attrs
    return m('tr', [
      m('td', powder.get('manufacturer')),
      m('td', powder.get('colour')),
      m('td', powder.get('code')),
      m('td', powder.get('pricePerKg')),
      m('td', powder.get('stockKg')),
    ])
  }
}