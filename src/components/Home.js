import m from 'mithril'

export default {
  view() {
    return m('[', [
      m('.ui fluid vertical menu', [
        m(m.route.Link, { href: '/queues', class: 'item' }, 'Job Queues'),
        m(m.route.Link, { href: '/jobs', class: 'item' }, 'Job Admin'),
      ]),
      m('.ui fluid vertical menu', [
        m(m.route.Link, { href: '/customers', class: 'item' }, 'Customers'),
        m(m.route.Link, { href: '/powders', class: 'item' }, 'Powders'),
      ])
    ])
  }
}
