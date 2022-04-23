import m from 'mithril'
import './initialize-parse'
import Layout from './components/Layout'
import Home from './components/Home'
import Customers from './components/Customers'
import Powders from './components/Powders'
import JobQueues from './components/JobQueues'

const rootElement = document.body

m.route(rootElement, '/home', {
  '/home': {
    render: () => m(Layout, m(Home))
  },
  '/customers': {
    render: () => m(Layout, m(Customers))
  },
  '/powders': {
    render: () => m(Layout, m(Powders))
  },
  '/queues': {
    render: () => m(Layout, m(JobQueues))
  },
})