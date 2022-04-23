import m from 'mithril'
import Auth from '../stores/Auth'
import Login from './Login'

const Layout = {
  view({ children }) {
    const user = Auth.current()
    
    return m('[', [
      m('nav.navbar navbar-dark bg-dark', [
        m('a.navbar-brand[href=#]', 'CJMS'),
        user && (
          m('span.navbar-text', {
            onclick: () => Auth.logOut().then(m.redraw)
          }, 'Log out')
        )
      ]),
      m('.container', user ? children : m(Login))
    ])
  }
}

export default Layout