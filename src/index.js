import m from 'mithril'
import './initialize-parse'
import Layout from './components/Layout'
import Home from './components/Home'
import Customers from './components/Customers'
import Powders from './components/Powders'
import Jobs from './components/Jobs'
import JobQueues from './components/JobQueues'

const rootElement = document.body

m.route(rootElement, '/home', {
  '/home': {
    render: () => m(Layout, m(Home))
  },
  '/customers': {
    render: () => m(Layout, m(Customers, { view: 'table' }))
  },
  '/powders': {
    render: () => m(Layout, m(Powders))
  },
  '/jobs': {
    render: () => m(Layout, m(Jobs))
  },
  '/jobs/:jobNum': {
    render: ({ attrs: { jobNum } }) => m(Layout, m(Jobs, { jobNum }))
  },
  '/queues': {
    render: () => m(Layout, m(JobQueues))
  },
})