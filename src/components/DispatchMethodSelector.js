import m from 'mithril'
import DispatchMethods from './DispatchMethods'
import SelectorModalActions from './SelectorModalActions'

export default function() {
  
  function view({ attrs: { onSelect, close }}) {
    return m('.ui tiny active modal', [
      m('.header', 'Dispatch Method'),
      m('.scrolling content', m(DispatchMethods, { onSelect })),
      m(SelectorModalActions, { close })
    ])
  }

  return {
    view
  }
}