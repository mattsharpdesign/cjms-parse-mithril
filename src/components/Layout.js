import m from 'mithril'
import Auth from '../stores/Auth'
import Login from './Login'
import Navbar from './Navbar'

const Layout = {
  view({ children }) {
    const user = Auth.current()
    
    return m('[', [
      m(Navbar),
      m('.ui container', user ? children : m(Login))
    ])
  }
}

export default Layout