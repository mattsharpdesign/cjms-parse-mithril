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
    console.log('JobQueues oninit')
    if (!store.lastLoadedAt) store.load()
  },
  view() {
    return m('[', [
      m('.ui tabular menu', [
        queuesConfig.map(q => m('.item', {
          onclick() {
            store.currentQueue = q.id
          },
          class: q.id === store.currentQueue ? 'active' : ''
        }, q.heading))
      ]),
      m(ListHeader, { store, title: `${store.currentQueue} Queue` }),
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