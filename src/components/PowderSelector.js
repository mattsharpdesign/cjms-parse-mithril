import m from 'mithril'
import Powders from './Powders'

function PowderSelector() {
  return {
    view({ attrs: { onSelect, close }}) {
      return m('.ui small active modal', [
        m('.header', 'Select Powder'),
        m('.scrolling content', m(Powders, { onSelect })),
        m('.actions', [
          m('.ui button', 'Close'),
        ])
      ])
    }
  }
}

export default PowderSelector