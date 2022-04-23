import m from 'mithril'
import './initialize-parse'
import Layout from './components/Layout'
import Home from './components/Home'
import Customers from './components/Customers'

const rootElement = document.body

m.route(rootElement, '/home', {
  '/home': {
    render() {
      return m(Layout, m(Home))
    }
  },
  '/customers': {
    render: () => m(Layout, m(Customers))
  }
})