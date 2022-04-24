import m from 'mithril'

export default {
  view({ attrs: { close }}) {
    return m('.actions', [
      m('.ui button', {
        onclick: close
      }, 'Close')
    ])
  }
}