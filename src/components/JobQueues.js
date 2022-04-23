import m from 'mithril'
import { jobStore as store } from '../stores'
import ListHeader from './ListHeader'
import LoadMoreButton from './LoadMoreButton'

const queuesConfig = [
  { id: 'waterjet', heading: 'Waterjet' },
  { id: 'flashing', heading: 'Flashings' },
  { id: 'pretreatment', heading: 'Pretreatment' },
  { id: 'coating', heading: 'Coating' },
  { id: 'dispatch', heading: 'QA/Dispatch' },
]

export default {
  oninit() {
    if (store.groupBy !== 'queue') {
      store.setGroupBy('queue')
    } else {
      if (!store.lastLoadedAt && !store.isLoading) store.load()
    }
  },
  view() {
    return m('[', [
      m('.ui tabular menu', [
        queuesConfig.map(q => m('.item', {
          onclick() {
            store.setQueue(q.id)
          },
          class: q.id === store.queue ? 'active' : ''
        }, q.heading))
      ]),
      m(ListHeader, { store, title: `${store.queue} Queue` }),
      m('.ui segments', store.items.map(job => m(ListItem, { job }))),
      m(LoadMoreButton, { store })
    ])
  }
}

const ListItem = {
  view({attrs}) {
    const { job } = attrs
    return m('.ui segment', [
      m('.header', job.get('customer').name),
      m('p', job.get('description'))
    ])
  }
}