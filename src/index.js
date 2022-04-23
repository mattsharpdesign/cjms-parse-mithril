import m from 'mithril'
import './initialize-parse'
import Layout from './components/Layout'
import Home from './components/Home'
import Customers from './components/Customers'
import Powders from './components/Powders'

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
})