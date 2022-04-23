import m from 'mithril'
import { jobStore as store } from '../stores'
import ListHeader from './ListHeader'

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
    ])
  }
}

export default Jobs