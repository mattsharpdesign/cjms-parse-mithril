import m from 'mithril'
import { jobStore as store } from '../stores'
import ListHeader from './ListHeader'

const queuesConfig = [
  { id: 'waterjet', heading: 'Waterjet' },
  { id: 'flashing', heading: 'Flashings' },
  { id: 'pretreatment', heading: 'Pretreatment' },
  { id: 'coating', heading: 'Coating' },
  { id: 'dispatch', heading: 'QA/Dispatch' },
]

let queue = 'waterjet'

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
        // m('.active item', 'Pretreatment'),
        // m('.item', 'Coating'),
        // m('.item', 'QA/Dispatch'),
      ]),
      m(ListHeader, { store, title: `${queue} Queue` })
    ])
  }
}