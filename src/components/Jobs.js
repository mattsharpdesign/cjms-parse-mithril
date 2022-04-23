import m from 'mithril'
import { jobStore as store } from '../stores'
import ListHeader from './ListHeader'

const Jobs = {
  oninit() {
    if (!store.lastLoadedAt && !store.isLoading) store.load()
  },
  view() {
    return m('[', [
      m(ListHeader, { store }),
    ])
  }
}

export default Jobs