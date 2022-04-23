import m from 'mithril'
import { jobStore as store } from '../stores'
import ListHeader from './ListHeader'
import LoadMoreButton from './LoadMoreButton'

const statusTabs = [
  { id: 'all', heading: 'All' },
  { id: 'unfinished', heading: 'Unfinished' },
  { id: 'finished', heading: 'Finished' },
  { id: 'approved', heading: 'Approved' },
  { id: 'invoiced', heading: 'Invoiced' },
]

const Jobs = {
  oninit() {
    if (store.groupBy !== 'status') {
      store.setGroupBy('status')
    } else {
      if (!store.lastLoadedAt && !store.isLoading) store.load()
    }
  },
  view() {
    return m('[', [
      m('.ui tabular menu', [
        statusTabs.map(s => m('.item', {
          class: s.id === store.status ? 'active' : '',
          onclick() {
            store.setStatus(s.id)
          }
        }, s.heading))
      ]),
      m(ListHeader, { store }),
      m('table.ui selectable table', [
        m('thead', [
          m('tr', [
            m('th', 'Job #'),
            m('th', 'Ordered'),
            m('th', 'Customer'),
            m('th', 'Description'),
            m('th', 'Due'),
            m('th', 'Order Number'),
            m('th', 'Status'),
          ])
        ]),
        m('tbody', store.items.map(job => m(TableRow, { job })))
      ]),
      m(LoadMoreButton, { store })
    ])
  }
}

const TableRow = {
  view({ attrs: { job } }) {
    return m('tr', [
      m('td', job.get('jobNum')),
      m('td', job.get('orderDate').toLocaleDateString()),
      m('td', job.get('customer').name),
      m('td', job.get('description')),
      m('td', job.get('dueDate').toLocaleDateString()),
      m('td', job.get('orderNum')),
      m('td'),
    ])
  }
}

export default Jobs