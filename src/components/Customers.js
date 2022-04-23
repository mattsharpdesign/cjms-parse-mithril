import m from 'mithril'
import { customerStore as store} from '../stores'
import ListHeader from './ListHeader'
import LoadMoreButton from './LoadMoreButton'

function Customers() {
  return {
    view() {
      return m('[', [
        m(ListHeader, { store, title: 'Customers'}),
        store.hasError && m('.ui negative message', store.error),
        m('table.ui selectable table', [
          m('thead', [
            m('th', 'Name'),
            m('th', 'Email'),
            m('th', 'Landline'),
            m('th', 'Mobile'),
          ]),
          m('tbody', store.customers.map(customer => m(TableRow, { customer })))
        ]),
        m(LoadMoreButton, { store })
      ])
    }
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