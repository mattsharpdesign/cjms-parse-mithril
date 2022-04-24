import m from 'mithril'
import Customers from './Customers'

const CustomerSelector = {
  view({ attrs: { onSelect, close } }) {
    return m('[', [
      m('.ui small active modal', [
        m('.header', [
          'Select Customer',
        ]),
        m('.scrolling content', [
          m(Customers, { onSelect })
        ]),
        m('.actions', [
          m('button.ui button', {
            onclick: () => close()
          }, 'Close')
        ])
      ])
    ])
  }
}

export default CustomerSelector