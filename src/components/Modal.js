import m from 'mithril'

const Modal = function() {
  let dom
  let title
	let children
  let onCancel

  // Container component we mount to the dimmer that is
  // added to the dom in the oncreate method
  const FullModalContainer = {
		view: () => m('.ui active modal', [
      m('.header', [
        title,
        m('i.ui right floated cancel icon', {
          onclick: onCancel
        })
      ]),
      m('.scrolling content', children),
    ])
	}

  const ModalContainer = {
    view: () => children
  }

  return {
    oncreate(v) {
      title = v.attrs.title || 'Modal'
      onCancel = v.attrs.onCancel
      children = v.children
      // Append a modal container to the end of body
      dom = document.createElement('div')
      // The modal class has a fade-in animation
      dom.className = 'ui active page dimmer top aligned transition'
      document.body.appendChild(dom)
      // Mount a separate VDOM tree here
      m.mount(dom, ModalContainer)
    },
    onbeforeupdate(v) {
      children = v.children
    },
    onbeforeremove: (vnode) => {
      // console.log('dimmer onbeforeremove')
      // Add a class with fade-out exit animation
      dom.classList.add('hide')
      return new Promise(r => {
        // setTimeout(() => r(), 100) 
        dom.addEventListener('animationend', r)
      })
    },
    onremove() {
      // Destroy the modal dom tree. Using m.mount with
      // null triggers any modal children removal hooks.
      m.mount(dom, null)
      document.body.removeChild(dom)
    },
    view() {}
  }
}

export default Modal