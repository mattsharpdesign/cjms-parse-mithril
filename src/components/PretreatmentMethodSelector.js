import m from 'mithril'
import PretreatmentMethods from './PretreatmentMethods'
import SelectorModalActions from './SelectorModalActions'

export default function() {
  
  function view({ attrs: { onSelect, close }}) {
    return m('.ui tiny active modal', [
      m('.header', 'Pretreatment Method'),
      m('.scrolling content', m(PretreatmentMethods, { onSelect })),
      m(SelectorModalActions, { close })
    ])
  }

  return {
    view
  }
}