import m from 'mithril'
import './initialize-parse'
import Layout from './components/Layout'
import Home from './components/Home'

console.log(`Hello, developer. It's ${new Date()}.`)

const rootElement = document.body

m.route(rootElement, '/home', {
  '/home': {
    render() {
      return m(Layout, m(Home))
    }
  }
})