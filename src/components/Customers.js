import m from 'mithril'
import { customerStore as store} from '../stores'
import ListHeader from './ListHeader'
import LoadMoreButton from './LoadMoreButton'

function Customers() {
  return {
    oninit() {
      if (!store.lastLoadedAt && !store.isLoading) store.load()
    },
    view({ attrs: { view, onSelect }}) {
      const ViewComponent = view === 'table' ? CustomerTable : CustomerList
      return m('[', [
        m(ListHeader, { store, title: 'Customers'}),
        store.hasError && m('.ui negative message', store.error),
        m(ViewComponent, { customers: store.items, onSelect }),
        m(LoadMoreButton, { store })
      ])
    }
  }
}

const CustomerList = {
  view({ attrs: { customers, onSelect }}) {
    return m('.ui divided link items', [
      customers.map(customer => m('.item', {
        onclick: () => onSelect(customer)
      }, [
        m('.content', [
          customer.get('name')
        ])
      ]))
    ])
  }
}

const CustomerTable = {
  view({ attrs: { customers, onSelect }}) {
    return m('table.ui selectable table', [
      m('thead', [
        m('th', 'Name'),
        m('th', 'Email'),
        m('th', 'Landline'),
        m('th', 'Mobile'),
      ]),
      m('tbody', customers.map(customer => m(TableRow, { customer })))
    ])
  }
}

const TableRow = {
  view({ attrs }) {
    const { customer } = attrs
    return m('tr', [
      m('td', customer.get('name')),
      m('td', customer.get('email')),
      m('td', customer.get('landline')),
      m('td', customer.get('mobile')),
    ])
  }
}

export default Customers