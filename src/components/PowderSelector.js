import m from 'mithril'
import Powders from './Powders'

function PowderSelector() {
  return {
    view({ attrs: { onSelect, close }}) {
      return m('.ui active modal', [
        m('.header', 'Select Powder'),
        m('.scrolling content', m(Powders, { onSelect })),
        m('.actions', [
          m('.ui button', { onclick: close }, 'Close'),
        ])
      ])
    }
  }
}

export default PowderSelector