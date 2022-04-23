import m from 'mithril'
import Auth from '../stores/Auth'

const Navbar = {
  view() {
    const user = Auth.current()
    return m('.ui menu', [
      m(m.route.Link, { href: '/', class: 'header item' }, 'CJMS'),
      user && (
        m('.right menu', [
          m('.item', {
            onclick: () => Auth.logOut().then(m.redraw)
          }, 'Log out')
        ])
      )
    ])
  }
}

export default Navbar