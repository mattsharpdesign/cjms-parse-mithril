import m from 'mithril'

export default {
  view() {
    return m('[', [
      m('h1', 'Home'),
      m('ul', [
        m('li', m(m.route.Link, { href: '/customers' }, 'Customers'))
      ])
    ])
  }
}
