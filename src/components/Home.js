import m from 'mithril'

export default {
  view() {
    return m('[', [
      m('.ui items', [
        m(m.route.Link, { href: '/customers', class: 'item' }, 'Customers'),
        m(m.route.Link, { href: '/powders', class: 'item' }, 'Powders'),
      ])
    ])
  }
}
